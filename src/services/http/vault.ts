import { VaultData, MonthlyGoal, VaultTransaction } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'
import { applyXpGain } from '../../utils/gamification'
import { XP_RULES } from '../../constants'

export async function getVaultData(): Promise<VaultData> {
  const wishlist = db.getWishlist()
  const reservedForGames = wishlist.reduce((sum, item) => sum + (item.reservedAmount || 0), 0)
  const freeBalance = db.getFreeBalance()
  const totalVaultBalance = reservedForGames + freeBalance
  const currentGoal = db.getGoal()
  const transactions = db.getTransactions()

  return simulateNetworkDelay({
    totalVaultBalance,
    reservedForGames,
    freeBalance,
    currentGoal,
    transactions,
  })
}

export async function depositFunds(payload: {
  amount: number
  destination: 'free' | 'game' | 'monthly_goal'
  gameId?: string
  description?: string
}): Promise<VaultData> {
  const { amount, destination, gameId, description } = payload

  let freeBalance = db.getFreeBalance()
  let currentGoal = db.getGoal()
  const wishlist = db.getWishlist()
  const txs = db.getTransactions()

  let txDescription = description || 'Depósito no Cofre'
  let gameTitle: string | undefined

  if (destination === 'free') {
    freeBalance += amount
    txDescription = description || 'Aporte para saldo livre'
    txs.unshift({
      id: `tx-${Date.now()}`,
      type: 'deposit_free',
      amount,
      description: txDescription,
      date: new Date().toISOString(),
    })
  } else if (destination === 'game' && gameId) {
    const game = wishlist.find((w) => w.id === gameId)
    if (!game) throw new Error('Jogo da wishlist não encontrado')
    game.reservedAmount += amount
    gameTitle = game.title
    txDescription = description || `Reserva direta para ${game.title}`
    db.setWishlist(wishlist)

    txs.unshift({
      id: `tx-${Date.now()}`,
      type: 'reserve_game',
      amount,
      description: txDescription,
      gameTitle,
      date: new Date().toISOString(),
    })
  } else if (destination === 'monthly_goal') {
    const prevCompleted = currentGoal.completed
    currentGoal.currentAmount += amount
    if (currentGoal.currentAmount >= currentGoal.targetAmount) {
      currentGoal.completed = true
    }
    txDescription = description || `Aporte na meta de ${currentGoal.month}/${currentGoal.year}`
    db.setGoal(currentGoal)

    txs.unshift({
      id: `tx-${Date.now()}`,
      type: 'monthly_goal',
      amount,
      description: txDescription,
      date: new Date().toISOString(),
    })

    // If goal completed for the first time
    if (!prevCompleted && currentGoal.completed) {
      const profile = db.getProfile()
      const { updatedProfile } = applyXpGain(profile, XP_RULES.COMPLETE_MONTHLY_GOAL)
      db.setProfile(updatedProfile)
    }
  }

  db.setFreeBalance(freeBalance)
  db.setTransactions(txs)

  // XP for saving money
  const xpReward = Math.floor(amount / 50) * XP_RULES.SAVE_FIFTY_REAIS
  if (xpReward > 0) {
    const profile = db.getProfile()
    const { updatedProfile } = applyXpGain(profile, xpReward)
    db.setProfile(updatedProfile)
  }

  return getVaultData()
}

export async function updateMonthlyGoal(goalData: {
  targetAmount: number
  month: number
  year: number
}): Promise<MonthlyGoal> {
  const current = db.getGoal()
  const updated: MonthlyGoal = {
    ...current,
    targetAmount: goalData.targetAmount,
    month: goalData.month,
    year: goalData.year,
    completed: current.currentAmount >= goalData.targetAmount,
  }

  db.setGoal(updated)
  return simulateNetworkDelay(updated)
}
