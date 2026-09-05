import { LibraryGame } from '../../types'
import { httpClient } from './httpClient'

export async function getLibraryGames(filters?: {
  search?: string
  status?: string
  platform?: string
  sortBy?: 'title' | 'rating' | 'hours' | 'progress' | 'recent'
}): Promise<LibraryGame[]> {
  const res = await httpClient.get('/library', { params: filters })
  return res.data
}

export async function getLibraryGameById(id: string): Promise<LibraryGame | null> {
  const res = await httpClient.get(`/library/${id}`)
  return res.data
}

export async function createLibraryGame(
  data: Omit<LibraryGame, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<LibraryGame> {
  const res = await httpClient.post('/library', data)
  return res.data
}

export async function updateLibraryGame(
  id: string,
  data: Partial<LibraryGame>,
): Promise<LibraryGame> {
  const res = await httpClient.patch(`/library/${id}`, data)
  return res.data
}

export async function deleteLibraryGame(id: string): Promise<{ success: boolean }> {
  const res = await httpClient.delete(`/library/${id}`)
  return res.data
}
