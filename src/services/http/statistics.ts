import { StatisticsData, DashboardSummary } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'
import { STATUS_LABELS } from '../../constants'

export async function getStatistics(): Promise<StatisticsData> {
  const games = db.getGames()
  const wishlist = db.getWishlist()
  const goal = db.getGoal()
  const freeBalance = db.getFreeBalance()
  const reserved = wishlist.reduce((s, i) => s + (i.reservedAmount || 0), 0)
  const totalVaultBalance = freeBalance + reserved

  const completedGames = games.filter((g) => g.status === 'completed' || g.status === 'platinum')
  const droppedGames = games.filter((g) => g.status === 'dropped')
  const ratedGames = games.filter((g) => g.rating > 0)

  const totalHoursPlayed = games.reduce((acc, g) => acc + (g.hoursPlayed || 0), 0)
  const averageRating = ratedGames.length
    ? parseFloat((ratedGames.reduce((acc, g) => acc + g.rating, 0) / ratedGames.length).toFixed(1))
    : 0

  const annualSpent = games.reduce((acc, g) => acc + (g.pricePaid || 0), 0)
  const moneySaved = reserved + (goal.completed ? goal.targetAmount : goal.currentAmount)

  // Monthly completed
  const completedByMonth = [
    { month: 'Jan', count: 1 },
    { month: 'Fev', count: 1 },
    { month: 'Mar', count: 1 },
    { month: 'Abr', count: 1 },
    { month: 'Mai', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Ago', count: 1 },
    { month: 'Set', count: 1 },
  ]

  // Monthly spending vs saved
  const spendingByMonth = [
    { month: 'Jan', spent: 250, saved: 150 },
    { month: 'Fev', spent: 80, saved: 200 },
    { month: 'Mar', spent: 120, saved: 300 },
    { month: 'Abr', spent: 199, saved: 150 },
    { month: 'Mai', spent: 0, saved: 350 },
    { month: 'Jun', spent: 0, saved: 300 },
    { month: 'Jul', spent: 89, saved: 250 },
    { month: 'Ago', spent: 330, saved: 200 },
    { month: 'Set', spent: 0, saved: 185 },
  ]

  // Platform breakdown
  const platformMap: Record<string, { count: number; hours: number }> = {}
  games.forEach((g) => {
    if (!platformMap[g.platform]) {
      platformMap[g.platform] = { count: 0, hours: 0 }
    }
    platformMap[g.platform].count += 1
    platformMap[g.platform].hours += g.hoursPlayed
  })

  const platformStats = Object.entries(platformMap).map(([name, data]) => ({
    name,
    count: data.count,
    hours: data.hours,
  }))

  // Genre breakdown
  const genreMap: Record<string, number> = {}
  games.forEach((g) => {
    genreMap[g.genre] = (genreMap[g.genre] || 0) + 1
  })

  const genreStats = Object.entries(genreMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Status breakdown
  const statusCounts: Record<string, number> = {
    playing: 0,
    completed: 0,
    platinum: 0,
    backlog: 0,
    paused: 0,
    dropped: 0,
  }
  games.forEach((g) => {
    if (statusCounts[g.status] !== undefined) {
      statusCounts[g.status] += 1
    }
  })

  const statusColors: Record<string, string> = {
    playing: '#10b981',
    completed: '#6366f1',
    platinum: '#f59e0b',
    backlog: '#38bdf8',
    paused: '#eab308',
    dropped: '#f43f5e',
  }

  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as any,
    label: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    count,
    color: statusColors[status] || '#71717a',
  }))

  const costPerHour = totalHoursPlayed > 0 ? parseFloat((annualSpent / totalHoursPlayed).toFixed(2)) : 0
  const gamesByStatus = statusBreakdown.map((s) => ({ status: s.status, count: s.count }))
  const gamesByPlatform = platformStats.map((p) => ({ platform: p.name, count: p.count }))
  const genreDistribution = genreStats.map((g) => ({ genre: g.name, count: g.count }))

  return simulateNetworkDelay({
    gamesCompleted: completedGames.length,
    totalHoursPlayed,
    averageRating,
    gamesDropped: droppedGames.length,
    annualSpent,
    moneySaved,
    vaultBalance: totalVaultBalance,
    goalsAchieved: 4,
    completedByMonth,
    spendingByMonth,
    platformStats,
    genreStats,
    statusBreakdown,
    gamesCount: games.length,
    costPerHour,
    totalSpent: annualSpent,
    totalSavedInVault: totalVaultBalance,
    gamesByStatus,
    gamesByPlatform,
    monthlySpending: spendingByMonth,
    genreDistribution,
  })
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const games = db.getGames()
  const wishlist = db.getWishlist()
  const releases = db.getReleases()
  const goal = db.getGoal()
  const profile = db.getProfile()
  const achievements = db.getAchievements()
  const freeBalance = db.getFreeBalance()
  const reservedBalance = wishlist.reduce((acc, item) => acc + (item.reservedAmount || 0), 0)
  const vaultBalance = freeBalance + reservedBalance

  const completedGames = games.filter((g) => g.status === 'completed' || g.status === 'platinum')
  const currentlyPlayingGames = games.filter((g) => g.status === 'playing')

  const upcomingReleases = releases
    .filter((r) => new Date(r.releaseDate).getTime() >= new Date().getTime())
    .slice(0, 3)

  const unlockedAchs = achievements.filter((a) => a.unlocked)
  const latestAchievement = unlockedAchs.length ? unlockedAchs[unlockedAchs.length - 1] : undefined

  return simulateNetworkDelay({
    profile,
    gamesCompletedCount: completedGames.length,
    wishlistCount: wishlist.length,
    currentlyPlayingCount: currentlyPlayingGames.length,
    vaultBalance,
    reservedBalance,
    freeBalance,
    currentlyPlayingGames,
    monthlyGoal: goal,
    upcomingReleases,
    latestAchievement,
  })
}
