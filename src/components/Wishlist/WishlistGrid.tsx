import { WishlistGame } from '../../types'
import { WishlistGameCard } from './WishlistGameCard'
import { Skeleton } from '../ui/skeleton'
import { Heart, Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface WishlistGridProps {
  items: WishlistGame[]
  isLoading: boolean
  onReserve: (item: WishlistGame) => void
  onMoveToLibrary: (item: WishlistGame) => void
  onEdit: (item: WishlistGame) => void
  onDelete: (id: string) => void
  onAddWish: () => void
}

export function WishlistGrid({
  items,
  isLoading,
  onReserve,
  onMoveToLibrary,
  onEdit,
  onDelete,
  onAddWish,
}: WishlistGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
          <Heart className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-base font-bold text-zinc-200">Sua Wishlist está vazia</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">
          Adicione jogos futuros ou títulos em promoção para planejar suas reservas no Cofre Gamer.
        </p>
        <Button onClick={onAddWish} className="mt-4 gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Adicionar Jogo Desejado
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <WishlistGameCard
          key={item.id}
          item={item}
          onReserve={onReserve}
          onMoveToLibrary={onMoveToLibrary}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
