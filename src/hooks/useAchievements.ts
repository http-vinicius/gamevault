import { useQuery } from '@tanstack/react-query'
import { getAchievements, getUserProfile } from '../services/http/achievements'

export function useAchievements() {
  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  })

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const achievements = achievementsQuery.data ?? []
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const unlockedCount = unlockedAchievements.length
  const totalCount = achievements.length
  const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1]

  return {
    achievements,
    profile: profileQuery.data,
    unlockedCount,
    totalCount,
    latestAchievement,
    isLoading: achievementsQuery.isLoading || profileQuery.isLoading,
    isError: achievementsQuery.isError || profileQuery.isError,
  }
}
