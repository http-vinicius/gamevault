import { WishlistGame, LibraryGame } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'
import { applyXpGain } from '../../utils/gamification'
import { XP_RULES } from '../../constants'

export async function getWishlistGames(filters?: {
  priority?: string
  search?: string
  sortBy?: 'priority' | 'price' | 'date' | 'progress'
}): Promise<WishlistGame[]> {
  let list = db.getWishlist()

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    list = list.filter((w) => w.title.toLowerCase().includes(q) || w.genre.toLowerCase().includes(q))
  }

  if (filters?.priority && filters.priority !== 'all') {
    list = list.filter((w) => w.priority === filters.priority)
  }

  if (filters?.sortBy) {
    list = [...list].sort((a, b) => {
      if (filters.sortBy === 'price') return a.currentPrice - b.currentPrice
      if (filters.sortBy === 'date') return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      if (filters.sortBy === 'progress') {
        const pctA = a.targetPrice ? a.reservedAmount / a.targetPrice : 0
        const pctB = b.targetPrice ? b.reservedAmount / b.targetPrice : 0
        return pctB - pctA
      }
      // priority
      const pWeights = { high: 3, medium: 2, low: 1 }
      return pWeights[b.priority] - pWeights[a.priority]
    })
  }

  return simulateNetworkDelay(list)
}

export async function createWishlistGame(
  data: Omit<WishlistGame, 'id' | 'createdAt'>,
): Promise<WishlistGame> {
  const list = db.getWishlist()
  const item: WishlistGame = {
    ...data,
    id: `wish-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  db.setWishlist([item, ...list])

  // Reward XP for planning
  const profile = db.getProfile()
  const { updatedProfile } = applyXpGain(profile, 15)
  db.setProfile(updatedProfile)

  return simulateNetworkDelay(item)
}

export async function updateWishlistGame(
  id: string,
  data: Partial<WishlistGame>,
): Promise<WishlistGame> {
  const list = db.getWishlist()
  const index = list.findIndex((w) => w.id === id)
  if (index === -1) throw new Error('Jogo não encontrado na wishlist')

  const updated: WishlistGame = { ...list[index], ...data }
  list[index] = updated
  db.setWishlist(list)

  return simulateNetworkDelay(updated)
}

export async function deleteWishlistGame(id: string): Promise<{ success: boolean }> {
  const list = db.getWishlist()
  db.setWishlist(list.filter((w) => w.id !== id))
  return simulateNetworkDelay({ success: true })
}

export async function reserveMoneyForWishlistGame(
  id: string,
  amount: number,
): Promise<{ wishlistGame: WishlistGame; newFreeBalance: number }> {
  const list = db.getWishlist()
  const index = list.findIndex((w) => w.id === id)
  if (index === -1) throw new Error('Jogo não encontrado na wishlist')

  const target = list[index]
  const freeBalance = db.getFreeBalance()

  if (amount > freeBalance) {
    throw new Error('Saldo livre insuficiente no Cofre Gamer')
  }

  // Update game reserved amount
  target.reservedAmount += amount
  list[index] = target
  db.setWishlist(list)

  // Deduct from free balance
  const newFreeBalance = freeBalance - amount
  db.setFreeBalance(newFreeBalance)

  // Add transaction
  const txs = db.getTransactions()
  txs.unshift({
    id: `tx-${Date.now()}`,
    type: 'reserve_game',
    amount,
    description: `Reserva para ${target.title}`,
    gameTitle: target.title,
    date: new Date().toISOString(),
  })
  db.setTransactions(txs)

  // Reward XP
  const xpReward = Math.floor(amount / 50) * XP_RULES.SAVE_FIFTY_REAIS
  if (xpReward > 0) {
    const profile = db.getProfile()
    const { updatedProfile } = applyXpGain(profile, xpReward)
    db.setProfile(updatedProfile)
  }

  return simulateNetworkDelay({ wishlistGame: target, newFreeBalance })
}

export async function moveWishlistToLibrary(
  wishlistId: string,
  purchasePrice: number,
  initialStatus: 'backlog' | 'playing' = 'backlog',
): Promise<{ libraryGame: LibraryGame; boughtBelowTarget?: boolean }> {
  const list = db.getWishlist()
  const found = list.find((w) => w.id === wishlistId)
  if (!found) throw new Error('Jogo não encontrado na wishlist')

  // Remove from wishlist
  db.setWishlist(list.filter((w) => w.id !== wishlistId))

  // Create in Library
  const newGame: LibraryGame = {
    id: `game-${Date.now()}`,
    title: found.title,
    coverUrl: found.coverUrl,
    platform: found.platform,
    status: initialStatus,
    genre: found.genre,
    hoursPlayed: 0,
    progress: 0,
    rating: 0,
    pricePaid: purchasePrice,
    notes: found.notes,
    wouldPlayAgain: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const games = db.getGames()
  db.setGames([newGame, ...games])

  // Check if bought below target price for bonus XP!
  let xpGain = XP_RULES.ADD_GAME
  if (purchasePrice <= found.targetPrice) {
    xpGain += XP_RULES.BUY_BELOW_TARGET_PRICE
  }

  const profile = db.getProfile()
  const { updatedProfile } = applyXpGain(profile, xpGain)
  db.setProfile(updatedProfile)

  return simulateNetworkDelay({
    libraryGame: newGame,
    boughtBelowTarget: purchasePrice <= found.targetPrice,
  })
}
