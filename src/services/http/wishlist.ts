import { WishlistGame, LibraryGame } from '../../types'
import { httpClient } from './httpClient'

export async function getWishlistGames(filters?: {
  priority?: string
  search?: string
  sortBy?: 'priority' | 'price' | 'date' | 'progress'
}): Promise<WishlistGame[]> {
  const res = await httpClient.get('/wishlist', { params: filters })
  return res.data
}

export async function createWishlistGame(
  data: Omit<WishlistGame, 'id' | 'createdAt'>,
): Promise<WishlistGame> {
  const res = await httpClient.post('/wishlist', data)
  return res.data
}

export async function updateWishlistGame(
  id: string,
  data: Partial<WishlistGame>,
): Promise<WishlistGame> {
  const res = await httpClient.patch(`/wishlist/${id}`, data)
  return res.data
}

export async function deleteWishlistGame(id: string): Promise<{ success: boolean }> {
  const res = await httpClient.delete(`/wishlist/${id}`)
  return res.data
}

export async function reserveMoneyForWishlistGame(
  id: string,
  amount: number,
): Promise<{ wishlistGame: WishlistGame; newFreeBalance: number }> {
  const res = await httpClient.post(`/wishlist/${id}/reserve`, { amount })
  return res.data
}

export async function moveWishlistToLibrary(
  wishlistId: string,
  purchasePrice: number,
  initialStatus: 'backlog' | 'playing' = 'backlog',
): Promise<{ libraryGame: LibraryGame; boughtBelowTarget?: boolean }> {
  const res = await httpClient.post(`/wishlist/${wishlistId}/move-to-library`, {
    purchasePrice,
    initialStatus,
  })
  return res.data
}
