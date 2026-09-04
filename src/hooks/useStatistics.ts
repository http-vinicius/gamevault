import { useQuery } from '@tanstack/react-query'
import { getStatistics, getDashboardSummary } from '../services/http/statistics'

export function useStatistics() {
  const statisticsQuery = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics,
  })

  return {
    stats: statisticsQuery.data,
    statistics: statisticsQuery.data,
    isLoading: statisticsQuery.isLoading,
    isError: statisticsQuery.isError,
    error: statisticsQuery.error,
    refetch: statisticsQuery.refetch,
  }
}

export function useDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardSummary,
  })

  return {
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
  }
}
