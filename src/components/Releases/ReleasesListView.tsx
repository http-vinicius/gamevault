import { Heart, Calendar, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ReleaseGame } from '../../types'
import { getCountdownText, formatLongDate } from '../../utils/formatters'
import { Skeleton } from '../ui/skeleton'

interface ReleasesListViewProps {
  releases: ReleaseGame[]
  isLoading: boolean
  onToggleWishlist: (id: string) => void
}

export function ReleasesListView({
  releases,
  isLoading,
  onToggleWishlist,
}: ReleasesListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex gap-4">
            <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (releases.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <Calendar className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-zinc-300">Nenhum lançamento encontrado</h3>
        <p className="text-xs text-zinc-500 mt-1">Tente ajustar seus filtros de plataforma ou busca.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {releases.map((item) => {
        const countdown = getCountdownText(item.releaseDate)

        return (
          <Card
            key={item.id}
            className="overflow-hidden border-zinc-800/80 bg-zinc-900/70 hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Cover & Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-20 h-24 rounded-lg object-cover flex-shrink-0 bg-zinc-950 shadow border border-zinc-800/60"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-zinc-100 truncate">{item.title}</h3>
                    <Badge
                      variant={countdown.isReleased ? 'success' : 'default'}
                      className="text-[11px] font-mono font-semibold"
                    >
                      {countdown.label}
                    </Badge>
                  </div>

                  <p className="text-xs text-zinc-400">
                    <span className="text-zinc-300 font-medium">{item.developer}</span> • {item.genre}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>{formatLongDate(item.releaseDate)}</span>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {item.platforms.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Wishlist Toggle */}
              <div className="self-end sm:self-center flex-shrink-0">
                <Button
                  onClick={() => onToggleWishlist(item.id)}
                  variant={item.inWishlist ? 'secondary' : 'outline'}
                  size="sm"
                  className={`gap-1.5 text-xs transition-colors ${
                    item.inWishlist
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      : 'hover:text-rose-400'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      item.inWishlist ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                    }`}
                  />
                  <span>{item.inWishlist ? 'Na Wishlist' : 'Adicionar ao Desejo'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
