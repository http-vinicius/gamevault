export type GameStatus =
  | 'backlog'
  | 'playing'
  | 'paused'
  | 'completed'
  | 'platinum'
  | 'dropped'

export type Platform = 'PC' | 'PlayStation 5' | 'PlayStation 4' | 'Xbox Series X' | 'Nintendo Switch' | 'Multiplataforma'

export type Priority = 'high' | 'medium' | 'low'

export interface LibraryGame {
  id: string
  title: string
  coverUrl: string
  platform: Platform
  status: GameStatus
  genre: string
  hoursPlayed: number
  progress: number // 0-100
  rating: number // 1-10 (0 if unrated)
  pricePaid: number
  startDate?: string
  completionDate?: string
  notes?: string
  wouldPlayAgain: boolean
  createdAt: string
  updatedAt: string
}

export interface WishlistGame {
  id: string
  title: string
  coverUrl: string
  platform: Platform
  genre: string
  priority: Priority
  currentPrice: number
  targetPrice: number
  reservedAmount: number
  releaseDate: string
  notes?: string
  createdAt: string
}

export interface ReleaseGame {
  id: string
  title: string
  coverUrl: string
  releaseDate: string // YYYY-MM-DD
  platforms: ('PC' | 'PlayStation' | 'Xbox' | 'Nintendo')[]
  genre: string
  developer?: string
  priceEstimate?: number
  inWishlist: boolean
  description?: string
}

export interface MonthlyGoal {
  id: string
  month: number // 1 to 12
  year: number
  targetAmount: number
  currentAmount: number
  completed: boolean
}

export interface VaultTransaction {
  id: string
  type: 'deposit_free' | 'reserve_game' | 'monthly_goal' | 'withdraw'
  amount: number
  description: string
  date: string
  gameTitle?: string
}

export interface VaultData {
  totalVaultBalance: number
  reservedForGames: number
  freeBalance: number
  currentGoal: MonthlyGoal
  transactions: VaultTransaction[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  category: 'games' | 'finance' | 'mastery'
  unlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
}

export interface UserProfile {
  name: string
  level: number
  currentXp: number
  xpForNextLevel: number
  totalXp: number
  title: string
  avatarUrl: string
}

export interface DashboardSummary {
  profile: UserProfile
  gamesCompletedCount: number
  wishlistCount: number
  currentlyPlayingCount: number
  vaultBalance: number
  reservedBalance: number
  freeBalance: number
  currentlyPlayingGames: LibraryGame[]
  monthlyGoal: MonthlyGoal
  upcomingReleases: ReleaseGame[]
  latestAchievement?: Achievement
}

export interface StatisticsData {
  gamesCompleted: number
  totalHoursPlayed: number
  averageRating: number
  gamesDropped: number
  annualSpent: number
  moneySaved: number
  vaultBalance: number
  goalsAchieved: number
  completedByMonth: { month: string; count: number }[]
  spendingByMonth: { month: string; spent: number; saved: number }[]
  platformStats: { name: string; count: number; hours: number }[]
  genreStats: { name: string; count: number }[]
  statusBreakdown: { status: GameStatus; label: string; count: number; color: string }[]
  gamesCount: number
  costPerHour: number
  totalSpent: number
  totalSavedInVault: number
  gamesByStatus: { status: string; count: number }[]
  gamesByPlatform: { platform: string; count: number }[]
  monthlySpending: { month: string; spent: number; saved: number }[]
  genreDistribution: { genre: string; count: number }[]
}
