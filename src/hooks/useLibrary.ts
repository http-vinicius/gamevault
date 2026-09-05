import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLibraryGames,
  getLibraryGameById,
  createLibraryGame,
  updateLibraryGame,
  deleteLibraryGame,
} from '../services/http/library'
import { LibraryGame } from '../types'
import { toast } from 'sonner'

export function useLibrary(initialFilters?: {
  search?: string
  status?: string
  platform?: string
  sortBy?: 'title' | 'rating' | 'hours' | 'progress' | 'recent'
}) {
  const queryClient = useQueryClient()

  // Internal reactive filter states
  const [search, setSearch] = React.useState(initialFilters?.search || '')
  const [statusFilter, setStatusFilter] = React.useState(initialFilters?.status || 'all')
  const [platformFilter, setPlatformFilter] = React.useState(initialFilters?.platform || 'all')
  const [sortBy, setSortBy] = React.useState<'title' | 'rating' | 'hours' | 'progress' | 'recent'>(
    initialFilters?.sortBy || 'recent'
  )

  const activeFilters = React.useMemo(() => {
    return {
      search,
      status: statusFilter,
      platform: platformFilter,
      sortBy,
    }
  }, [search, statusFilter, platformFilter, sortBy])

  const gamesQuery = useQuery({
    queryKey: ['library', activeFilters],
    queryFn: () => getLibraryGames(activeFilters),
  })

  // Full library for status counts
  const allGamesQuery = useQuery({
    queryKey: ['library-all'],
    queryFn: () => getLibraryGames(),
  })

  const countsByStatus = React.useMemo(() => {
    const list = allGamesQuery.data || []
    const counts: Record<string, number> = {
      all: list.length,
      playing: 0,
      completed: 0,
      platinum: 0,
      backlog: 0,
      paused: 0,
      dropped: 0,
    }
    list.forEach((g) => {
      if (counts[g.status] !== undefined) {
        counts[g.status]++
      }
    })
    return counts
  }, [allGamesQuery.data])

  const createGameMutation = useMutation({
    mutationFn: (data: Omit<LibraryGame, 'id' | 'createdAt' | 'updatedAt'>) => createLibraryGame(data),
    onSuccess: (newGame) => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['library-all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      toast.success(`"${newGame.title}" adicionado à biblioteca!`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao adicionar jogo')
    },
  })

  const updateGameMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LibraryGame> }) => updateLibraryGame(id, data),
    onSuccess: (updatedGame) => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['library-all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      toast.success(`"${updatedGame.title}" atualizado com sucesso!`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao atualizar jogo')
    },
  })

  const deleteGameMutation = useMutation({
    mutationFn: (id: string) => deleteLibraryGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['library-all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      toast.success('Jogo removido da biblioteca.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao remover jogo')
    },
  })

  return {
    games: gamesQuery.data ?? [],
    isLoading: gamesQuery.isLoading,
    isError: gamesQuery.isError,
    error: gamesQuery.error,
    refetch: gamesQuery.refetch,

    // Filter controls
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    sortBy,
    setSortBy,
    countsByStatus,

    // Mutations
    addGame: createGameMutation.mutateAsync,
    createGame: createGameMutation.mutateAsync,
    isCreating: createGameMutation.isPending,
    updateGame: updateGameMutation.mutateAsync,
    isUpdating: updateGameMutation.isPending,
    deleteGame: deleteGameMutation.mutateAsync,
    isDeleting: deleteGameMutation.isPending,
  }
}

export function useLibraryGame(id?: string) {
  return useQuery({
    queryKey: ['library-game', id],
    queryFn: () => (id ? getLibraryGameById(id) : null),
    enabled: !!id,
  })
}
