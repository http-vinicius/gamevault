import { LibraryGame } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'
import { applyXpGain } from '../../utils/gamification'
import { XP_RULES } from '../../constants'

export async function getLibraryGames(filters?: {
  search?: string
  status?: string
  platform?: string
  sortBy?: 'title' | 'rating' | 'hours' | 'progress' | 'recent'
}): Promise<LibraryGame[]> {
  let games = db.getGames()

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    games = games.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q) ||
        g.notes?.toLowerCase().includes(q),
    )
  }

  if (filters?.status && filters.status !== 'all') {
    games = games.filter((g) => g.status === filters.status)
  }

  if (filters?.platform && filters.platform !== 'all') {
    games = games.filter((g) => g.platform === filters.platform)
  }

  if (filters?.sortBy) {
    games = [...games].sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating
      if (filters.sortBy === 'hours') return b.hoursPlayed - a.hoursPlayed
      if (filters.sortBy === 'progress') return b.progress - a.progress
      if (filters.sortBy === 'recent') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      return a.title.localeCompare(b.title)
    })
  }

  return simulateNetworkDelay(games)
}

export async function getLibraryGameById(id: string): Promise<LibraryGame | null> {
  const games = db.getGames()
  const found = games.find((g) => g.id === id) || null
  return simulateNetworkDelay(found)
}

export async function createLibraryGame(
  data: Omit<LibraryGame, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<LibraryGame> {
  const games = db.getGames()
  const newGame: LibraryGame = {
    ...data,
    id: `game-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedGames = [newGame, ...games]
  db.setGames(updatedGames)

  // XP Gamification
  let xpReward = XP_RULES.ADD_GAME
  if (newGame.status === 'playing') xpReward += XP_RULES.START_GAME
  if (newGame.status === 'completed') xpReward += XP_RULES.COMPLETE_GAME
  if (newGame.status === 'platinum') xpReward += XP_RULES.PLATINUM_GAME

  const profile = db.getProfile()
  const { updatedProfile } = applyXpGain(profile, xpReward)
  db.setProfile(updatedProfile)

  return simulateNetworkDelay(newGame)
}

export async function updateLibraryGame(
  id: string,
  data: Partial<LibraryGame>,
): Promise<LibraryGame> {
  const games = db.getGames()
  const index = games.findIndex((g) => g.id === id)
  if (index === -1) {
    throw new Error('Jogo não encontrado')
  }

  const prevGame = games[index]
  const updatedGame: LibraryGame = {
    ...prevGame,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  games[index] = updatedGame
  db.setGames(games)

  // XP triggers on status changes
  let extraXp = 0
  if (prevGame.status !== 'playing' && updatedGame.status === 'playing') {
    extraXp += XP_RULES.START_GAME
  }
  if (prevGame.status !== 'completed' && updatedGame.status === 'completed') {
    extraXp += XP_RULES.COMPLETE_GAME
  }
  if (prevGame.status !== 'platinum' && updatedGame.status === 'platinum') {
    extraXp += XP_RULES.PLATINUM_GAME
  }

  if (extraXp > 0) {
    const profile = db.getProfile()
    const { updatedProfile } = applyXpGain(profile, extraXp)
    db.setProfile(updatedProfile)
  }

  return simulateNetworkDelay(updatedGame)
}

export async function deleteLibraryGame(id: string): Promise<{ success: boolean }> {
  const games = db.getGames()
  const filtered = games.filter((g) => g.id !== id)
  db.setGames(filtered)
  return simulateNetworkDelay({ success: true })
}
