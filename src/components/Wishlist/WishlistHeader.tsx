import { Plus, Heart, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

interface WishlistHeaderProps {
  totalCount: number
  totalReserved: number
  onAddClick: () => void
}

export function WishlistHeader({
  totalCount,
  totalReserved,
  onAddClick,
}: WishlistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Minha Wishlist
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {totalCount} desejados
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Planeje suas compras gamers, reserve dinheiro antecipadamente e monitore preços-alvo.
        </p>
      </div>

      <Button onClick={onAddClick} className="gap-2 self-start sm:self-auto" variant="glow">
        <Plus className="h-4 w-4" />
        <span>Adicionar Desejo</span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          +15 XP
        </span>
      </Button>
    </div>
  )
}
