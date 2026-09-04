import {
  LibraryGame,
  WishlistGame,
  ReleaseGame,
  MonthlyGoal,
  VaultTransaction,
  Achievement,
  UserProfile,
} from '../../types'
import {
  INITIAL_GAMES,
  INITIAL_WISHLIST,
  INITIAL_RELEASES,
  INITIAL_MONTHLY_GOAL,
  INITIAL_TRANSACTIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_USER_PROFILE,
} from './mockData'

const KEYS = {
  GAMES: 'gamevault_games_v1',
  WISHLIST: 'gamevault_wishlist_v1',
  RELEASES: 'gamevault_releases_v1',
  GOAL: 'gamevault_goal_v1',
  TRANSACTIONS: 'gamevault_transactions_v1',
  ACHIEVEMENTS: 'gamevault_achievements_v1',
  PROFILE: 'gamevault_profile_v1',
  FREE_BALANCE: 'gamevault_free_balance_v1',
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error('Error writing to localStorage', err)
  }
}

export const db = {
  getGames: (): LibraryGame[] => safeGet<LibraryGame[]>(KEYS.GAMES, INITIAL_GAMES),
  setGames: (games: LibraryGame[]) => safeSet(KEYS.GAMES, games),

  getWishlist: (): WishlistGame[] => safeGet<WishlistGame[]>(KEYS.WISHLIST, INITIAL_WISHLIST),
  setWishlist: (wishlist: WishlistGame[]) => safeSet(KEYS.WISHLIST, wishlist),

  getReleases: (): ReleaseGame[] => safeGet<ReleaseGame[]>(KEYS.RELEASES, INITIAL_RELEASES),
  setReleases: (releases: ReleaseGame[]) => safeSet(KEYS.RELEASES, releases),

  getGoal: (): MonthlyGoal => safeGet<MonthlyGoal>(KEYS.GOAL, INITIAL_MONTHLY_GOAL),
  setGoal: (goal: MonthlyGoal) => safeSet(KEYS.GOAL, goal),

  getTransactions: (): VaultTransaction[] => safeGet<VaultTransaction[]>(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  setTransactions: (txs: VaultTransaction[]) => safeSet(KEYS.TRANSACTIONS, txs),

  getAchievements: (): Achievement[] => safeGet<Achievement[]>(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  setAchievements: (achs: Achievement[]) => safeSet(KEYS.ACHIEVEMENTS, achs),

  getProfile: (): UserProfile => safeGet<UserProfile>(KEYS.PROFILE, INITIAL_USER_PROFILE),
  setProfile: (profile: UserProfile) => safeSet(KEYS.PROFILE, profile),

  getFreeBalance: (): number => {
    const raw = localStorage.getItem(KEYS.FREE_BALANCE)
    if (raw === null) return 335.0 // Initial free balance matching prompt
    return parseFloat(raw) || 0
  },
  setFreeBalance: (balance: number) => {
    localStorage.setItem(KEYS.FREE_BALANCE, balance.toString())
  },
}
