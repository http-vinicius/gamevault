import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVaultData, depositFunds, updateMonthlyGoal } from '../services/http/vault'
import { toast } from 'sonner'

export function useVault() {
  const queryClient = useQueryClient()

  const vaultQuery = useQuery({
    queryKey: ['vault'],
    queryFn: getVaultData,
  })

  const depositMutation = useMutation({
    mutationFn: (payload: {
      amount: number
      destination: 'free' | 'game' | 'monthly_goal'
      gameId?: string
      description?: string
    }) => depositFunds(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vault'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })

      const xpEarned = Math.floor(variables.amount / 50) * 50
      toast.success(
        `Aporte de R$ ${variables.amount.toFixed(2)} registrado com sucesso! ${xpEarned > 0 ? `(+${xpEarned} XP)` : ''}`,
      )
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao realizar aporte no Cofre')
    },
  })

  const goalMutation = useMutation({
    mutationFn: (goalData: { targetAmount: number; month: number; year: number }) =>
      updateMonthlyGoal(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Meta mensal atualizada!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao atualizar meta mensal')
    },
  })

  const reserveForGame = async (payload: {
    gameId: string
    amount: number
    description?: string
  }) => {
    return depositMutation.mutateAsync({
      amount: payload.amount,
      destination: 'game',
      gameId: payload.gameId,
      description: payload.description,
    })
  }

  return {
    vaultData: vaultQuery.data,
    transactions: vaultQuery.data?.transactions ?? [],
    monthlyGoal: vaultQuery.data?.currentGoal,
    isLoading: vaultQuery.isLoading,
    isError: vaultQuery.isError,
    error: vaultQuery.error,
    refetch: vaultQuery.refetch,
    deposit: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
    updateGoal: goalMutation.mutateAsync,
    updateMonthlyGoal: goalMutation.mutateAsync,
    isUpdatingGoal: goalMutation.isPending,
    reserveForGame,
  }
}
