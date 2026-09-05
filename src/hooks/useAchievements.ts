import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAchievements, getUserProfile, addManualXp } from '../services/http/achievements'
import { toast } from 'sonner'

export function useAchievements() {
  const queryClient = useQueryClient()

  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  })

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  })

  const addXpMutation = useMutation({
    mutationFn: (amount: number) => addManualXp(amount),
    onSuccess: (newProfile, amount) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`+${amount} XP concedido! Nível atual: ${newProfile.level}`)
    },
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
    addXp: addXpMutation.mutateAsync,
  }
}
