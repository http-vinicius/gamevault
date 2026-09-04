import { Achievement, UserProfile } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'
import { applyXpGain } from '../../utils/gamification'

export async function getAchievements(): Promise<Achievement[]> {
  const achs = db.getAchievements()
  const games = db.getGames()
  const wishlist = db.getWishlist()
  const freeBalance = db.getFreeBalance()
  const reserved = wishlist.reduce((s, i) => s + (i.reservedAmount || 0), 0)
  const totalSaved = freeBalance + reserved

  const completedCount = games.filter((g) => g.status === 'completed' || g.status === 'platinum').length
  const platinumCount = games.filter((g) => g.status === 'platinum').length

  // Dynamically update progresses
  const updatedAchs = achs.map((ach) => {
    let progress = ach.progress
    let unlocked = ach.unlocked

    if (ach.id === 'ach-1') {
      progress = Math.min(completedCount, 1)
      if (progress >= 1) unlocked = true
    } else if (ach.id === 'ach-2') {
      progress = Math.min(completedCount, 5)
      if (progress >= 5) unlocked = true
    } else if (ach.id === 'ach-3') {
      progress = Math.min(completedCount, 10)
      if (progress >= 10) unlocked = true
    } else if (ach.id === 'ach-4') {
      progress = Math.round(totalSaved)
      if (progress >= 1000) unlocked = true
    } else if (ach.id === 'ach-7') {
      progress = Math.min(completedCount, 100)
      if (progress >= 100) unlocked = true
    } else if (ach.id === 'ach-8') {
      progress = Math.min(platinumCount, 2)
      if (progress >= 2) unlocked = true
    }

    return {
      ...ach,
      progress,
      unlocked,
      unlockedAt: unlocked && !ach.unlockedAt ? new Date().toISOString() : ach.unlockedAt,
    }
  })

  db.setAchievements(updatedAchs)
  return simulateNetworkDelay(updatedAchs)
}

export async function getUserProfile(): Promise<UserProfile> {
  const profile = db.getProfile()
  return simulateNetworkDelay(profile)
}

export async function addManualXp(amount: number): Promise<UserProfile> {
  const profile = db.getProfile()
  const { updatedProfile } = applyXpGain(profile, amount)
  db.setProfile(updatedProfile)
  return simulateNetworkDelay(updatedProfile)
}
