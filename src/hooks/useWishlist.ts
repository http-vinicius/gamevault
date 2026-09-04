import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getWishlistGames,
  createWishlistGame,
  updateWishlistGame,
  deleteWishlistGame,
  reserveMoneyForWishlistGame,
  moveWishlistToLibrary,
} from '../services/http/wishlist'
import { WishlistGame } from '../types'
import { toast } from 'sonner'

export function useWishlist(initialFilters?: {
  priority?: string
  search?: string
  sortBy?: 'priority' | 'price' | 'date' | 'progress'
}) {
  const queryClient = useQueryClient()

  // Filter states
  const [search, setSearch] = React.useState(initialFilters?.search || '')
  const [priorityFilter, setPriorityFilter] = React.useState(initialFilters?.priority || 'all')
  const [sortBy, setSortBy] = React.useState<'priority' | 'price' | 'date' | 'progress'>(
    initialFilters?.sortBy || 'priority'
  )

  const activeFilters = React.useMemo(() => {
    return {
      search,
      priority: priorityFilter,
      sortBy,
    }
  }, [search, priorityFilter, sortBy])

  const wishlistQuery = useQuery({
    queryKey: ['wishlist', activeFilters],
    queryFn: () => getWishlistGames(activeFilters),
  })

  // Calculate total reserved across wishlist items
  const totalReserved = React.useMemo(() => {
    const list = wishlistQuery.data || []
    return list.reduce((acc, item) => acc + (item.reservedAmount || 0), 0)
  }, [wishlistQuery.data])

  const createMutation = useMutation({
    mutationFn: (data: Omit<WishlistGame, 'id' | 'createdAt'>) => createWishlistGame(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success(`"${newItem.title}" adicionado à sua Wishlist! (+15 XP)`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao adicionar à wishlist')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WishlistGame> }) => updateWishlistGame(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['vault'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Wishlist atualizada!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao atualizar wishlist')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWishlistGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Item removido da wishlist.')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao remover da wishlist')
    },
  })

  const reserveMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => reserveMoneyForWishlistGame(id, amount),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['vault'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      toast.success(`R$ ${res.wishlistGame.reservedAmount.toFixed(2)} acumulados para ${res.wishlistGame.title}!`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao reservar valor')
    },
  })

  const moveToLibraryMutation = useMutation({
    mutationFn: ({
      wishlistId,
      purchasePrice,
      initialStatus,
    }: {
      wishlistId: string
      purchasePrice: number
      initialStatus?: 'backlog' | 'playing'
    }) => moveWishlistToLibrary(wishlistId, purchasePrice, initialStatus),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['library-all'] })
      queryClient.invalidateQueries({ queryKey: ['vault'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })

      const promoXp = res.boughtBelowTarget ? ' (+300 XP Bônus Promo Hunter!)' : ''
      toast.success(`"${res.libraryGame.title}" transferido para a Biblioteca!${promoXp}`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao transferir jogo para biblioteca')
    },
  })

  const moveToLibrary = (payload: {
    id: string
    purchasePrice: number
    initialStatus?: 'backlog' | 'playing'
  }) => {
    return moveToLibraryMutation.mutateAsync({
      wishlistId: payload.id,
      purchasePrice: payload.purchasePrice,
      initialStatus: payload.initialStatus,
    })
  }

  return {
    wishlist: wishlistQuery.data ?? [],
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    error: wishlistQuery.error,
    refetch: wishlistQuery.refetch,

    // Filters
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    totalReserved,

    // Mutations
    addWishlistGame: createMutation.mutateAsync,
    updateWishlistGame: updateMutation.mutateAsync,
    deleteWishlistGame: deleteMutation.mutateAsync,
    reserveFunds: reserveMutation.mutateAsync,
    moveToLibrary,
    isMoving: moveToLibraryMutation.isPending,
  }
}
