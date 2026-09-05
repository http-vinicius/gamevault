import { ReleaseGame } from '../../types'
import { httpClient } from './httpClient'

export async function getReleases(filters?: {
  platform?: string
  onlyWishlist?: boolean
  search?: string
}): Promise<ReleaseGame[]> {
  const res = await httpClient.get('/releases', { params: filters })
  return res.data
}

export async function toggleReleaseWishlist(releaseId: string): Promise<{ inWishlist: boolean }> {
  const res = await httpClient.post(`/releases/${releaseId}/toggle-wishlist`)
  return res.data
}
