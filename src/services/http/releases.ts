import { ReleaseGame } from '../../types'
import { db } from './storage'
import { simulateNetworkDelay } from './httpClient'

export async function getReleases(filters?: {
  platform?: string
  onlyWishlist?: boolean
  search?: string
}): Promise<ReleaseGame[]> {
  let list = db.getReleases()
  const wishlist = db.getWishlist()
  const wishlistTitles = new Set(wishlist.map((w) => w.title.toLowerCase()))

  // Sync wishlist flag dynamically
  list = list.map((rel) => ({
    ...rel,
    inWishlist: wishlistTitles.has(rel.title.toLowerCase()),
  }))

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    list = list.filter((r) => r.title.toLowerCase().includes(q) || r.genre.toLowerCase().includes(q))
  }

  if (filters?.onlyWishlist) {
    list = list.filter((r) => r.inWishlist)
  }

  if (filters?.platform && filters.platform !== 'all') {
    list = list.filter((r) => r.platforms.some((p) => p.toLowerCase().includes(filters.platform!.toLowerCase())))
  }

  // Sort by release date ascending
  list.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())

  return simulateNetworkDelay(list)
}

export async function toggleReleaseWishlist(releaseId: string): Promise<{ inWishlist: boolean }> {
  const releases = db.getReleases()
  const found = releases.find((r) => r.id === releaseId)
  if (!found) throw new Error('Lançamento não encontrado')

  const wishlist = db.getWishlist()
  const existingWishIndex = wishlist.findIndex((w) => w.title.toLowerCase() === found.title.toLowerCase())

  let nowInWishlist = false

  if (existingWishIndex >= 0) {
    // Remove from wishlist
    wishlist.splice(existingWishIndex, 1)
    db.setWishlist(wishlist)
    nowInWishlist = false
  } else {
    // Add to wishlist
    const newWish = {
      id: `wish-${Date.now()}`,
      title: found.title,
      coverUrl: found.coverUrl,
      platform: 'Multiplataforma' as const,
      genre: found.genre,
      priority: 'medium' as const,
      currentPrice: found.priceEstimate || 299,
      targetPrice: (found.priceEstimate || 299) * 0.8,
      reservedAmount: 0,
      releaseDate: found.releaseDate,
      notes: found.description,
      createdAt: new Date().toISOString(),
    }
    db.setWishlist([newWish, ...wishlist])
    nowInWishlist = true
  }

  // Update in release list
  found.inWishlist = nowInWishlist
  db.setReleases(releases)

  return simulateNetworkDelay({ inWishlist: nowInWishlist })
}
