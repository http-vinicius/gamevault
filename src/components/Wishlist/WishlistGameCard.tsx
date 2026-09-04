import { Coins, ShoppingBag, Edit2, Trash2, Calendar, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { WishlistGame } from '../../types'
import { PRIORITY_LABELS } from '../../constants'
import { formatCurrency } from '../../lib/utils'
import { calculatePercentage, formatShortDate } from '../../utils/formatters'

interface WishlistGameCardProps {
  key?: string
  item: WishlistGame
  onReserve: (item: WishlistGame) => void
  onMoveToLibrary: (item: WishlistGame) => void
  onEdit: (item: WishlistGame) => void
  onDelete: (id: string) => void
}

export function WishlistGameCard({
  item,
  onReserve,
  onMoveToLibrary,
  onEdit,
  onDelete,
}: WishlistGameCardProps) {
  const priorityInfo = PRIORITY_LABELS[item.priority]
  const target = item.targetPrice || item.currentPrice
  const reserved = item.reservedAmount || 0
  const progressPercent = calculatePercentage(reserved, target)
  const remaining = Math.max(target - reserved, 0)
  const hasDiscountTarget = item.targetPrice < item.currentPrice

  return (
    <Card className="group overflow-hidden border-zinc-800/80 bg-zinc-900/70 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cover & Priority Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-md backdrop-blur-md shadow font-bold flex items-center gap-1 border ${priorityInfo.badgeClass}`}
            >
              <span>{priorityInfo.icon}</span>
              <span>{priorityInfo.label}</span>
            </span>

            <Badge variant="secondary" className="bg-zinc-950/80 backdrop-blur-md text-[10px]">
              {item.platform}
            </Badge>
          </div>

          {/* Release Date overlay */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-zinc-300 border border-zinc-800">
            <Calendar className="w-3 h-3 text-zinc-400" />
            <span>{formatShortDate(item.releaseDate)}</span>
          </div>
        </div>

        {/* Info */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-zinc-100 truncate" title={item.title}>
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 truncate">{item.genre}</p>
            </div>
          </div>

          {/* Prices Comparison */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/80">
            <div>
              <span className="text-[10px] text-zinc-500 block">Preço Atual</span>
              <span className="font-mono text-zinc-300 font-semibold">
                {formatCurrency(item.currentPrice)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-emerald-400" />
                Preço Desejado
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {formatCurrency(item.targetPrice)}
              </span>
            </div>
          </div>

          {/* Financial Progress as specified in user prompt */}
          <div className="mt-3.5 space-y-2 bg-violet-950/20 p-3 rounded-lg border border-violet-500/20">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-mono font-bold text-zinc-200">
                {formatCurrency(reserved)}{' '}
                <span className="text-zinc-500 font-normal">/ {formatCurrency(target)}</span>
              </span>
              <span className="font-mono font-black text-violet-400">{progressPercent}%</span>
            </div>

            <Progress
              value={progressPercent}
              className="h-2 bg-zinc-800"
              indicatorClassName="bg-gradient-to-r from-violet-500 to-indigo-400"
            />

            <div className="flex justify-between items-center text-[11px] pt-1 text-zinc-400">
              {remaining > 0 ? (
                <span>
                  Faltam <span className="font-semibold text-rose-400 font-mono">{formatCurrency(remaining)}</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold font-mono">Totalmente reservado! 🎉</span>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReserve(item)}
                className="h-6 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 gap-1"
              >
                <Coins className="w-3 h-3" />
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-zinc-950/50 border-t border-zinc-800/60 flex items-center justify-between gap-2 text-xs">
        <Button
          onClick={() => onMoveToLibrary(item)}
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          Comprei (Mover)
        </Button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Editar item"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Remover da wishlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  )
}
