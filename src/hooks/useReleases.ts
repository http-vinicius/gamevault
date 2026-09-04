import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReleases, toggleReleaseWishlist } from '../services/http/releases'
import { toast } from 'sonner'

export function useReleases(initialFilters?: {
  platform?: string
  onlyWishlist?: boolean
  search?: string
}) {
  const queryClient = useQueryClient()

  // Filter & view state
  const [search, setSearch] = React.useState(initialFilters?.search || '')
  const [platformFilter, setPlatformFilter] = React.useState(initialFilters?.platform || 'all')
  const [onlyWishlist, setOnlyWishlist] = React.useState(initialFilters?.onlyWishlist || false)
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list')

  const activeFilters = React.useMemo(() => {
    return {
      search,
      platform: platformFilter,
      onlyWishlist,
    }
  }, [search, platformFilter, onlyWishlist])

  const releasesQuery = useQuery({
    queryKey: ['releases', activeFilters],
    queryFn: () => getReleases(activeFilters),
  })

  const toggleWishlistMutation = useMutation({
    mutationFn: (id: string) => toggleReleaseWishlist(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      if (res.inWishlist) {
        toast.success('Jogo adicionado à sua Wishlist!')
      } else {
        toast.info('Jogo removido da sua Wishlist.')
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao atualizar wishlist do lançamento')
    },
  })

  return {
    releases: releasesQuery.data ?? [],
    isLoading: releasesQuery.isLoading,
    isError: releasesQuery.isError,
    error: releasesQuery.error,
    refetch: releasesQuery.refetch,

    // Filters & view modes
    search,
    setSearch,
    platformFilter,
    setPlatformFilter,
    onlyWishlist,
    setOnlyWishlist,
    viewMode,
    setViewMode,

    toggleWishlist: toggleWishlistMutation.mutateAsync,
    isToggling: toggleWishlistMutation.isPending,
  }
}
