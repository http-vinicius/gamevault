import { useLibrary } from './useLibrary'
import { useWishlist } from './useWishlist'
import { useVault } from './useVault'
import { useReleases } from './useReleases'
import { useAchievements } from './useAchievements'

export function useDashboard() {
  const { games } = useLibrary()
  const { wishlist } = useWishlist()
  const { vaultData, monthlyGoal } = useVault()
  const { releases } = useReleases()
  const { profile, latestAchievement } = useAchievements()

  const completedCount = games.filter(
    (g) => g.status === 'completed' || g.status === 'platinum'
  ).length

  const playingCount = games.filter((g) => g.status === 'playing').length

  const wishlistCount = wishlist.length

  const vaultBalance = vaultData?.totalVaultBalance ?? 1285

  const currentlyPlayingGames = games.filter((g) => g.status === 'playing')

  // Next 4 upcoming releases
  const upcomingReleases = releases.slice(0, 4)

  return {
    completedCount,
    wishlistCount,
    playingCount,
    vaultBalance,
    currentlyPlayingGames,
    upcomingReleases,
    profile,
    monthlyGoal,
    latestAchievement,
  }
}
