import { UserProfile } from '../types'

// Returns the XP threshold needed to advance from level to level + 1
export function getXpRequiredForLevel(level: number): number {
  // At level 18, 1000 XP matches the prompt example
  return 100 + level * 50
}

export function applyXpGain(profile: UserProfile, xpGain: number): {
  updatedProfile: UserProfile
  leveledUp: boolean
  levelsGained: number
} {
  let currentXp = profile.currentXp + xpGain
  let level = profile.level
  let totalXp = profile.totalXp + xpGain
  let levelsGained = 0

  while (currentXp >= getXpRequiredForLevel(level)) {
    currentXp -= getXpRequiredForLevel(level)
    level += 1
    levelsGained += 1
  }

  const xpForNextLevel = getXpRequiredForLevel(level)

  const updatedProfile: UserProfile = {
    ...profile,
    level,
    currentXp,
    xpForNextLevel,
    totalXp,
  }

  return {
    updatedProfile,
    leveledUp: levelsGained > 0,
    levelsGained,
  }
}

export function getRankTitle(level: number): string {
  if (level >= 50) return 'Lenda dos Games'
  if (level >= 40) return 'Mestre Supremo'
  if (level >= 30) return 'Conquistador de Reinos'
  if (level >= 20) return 'Guardião do Backlog'
  if (level >= 15) return 'Colecionador Veterano'
  if (level >= 10) return 'Aventureiro Experiente'
  if (level >= 5) return 'Explorador Curioso'
  return 'Iniciante'
}
