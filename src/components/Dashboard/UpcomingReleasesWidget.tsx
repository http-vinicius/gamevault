import { Link } from '@tanstack/react-router'
import { Calendar, ArrowRight, Heart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { ReleaseGame } from '../../types'
import { getCountdownText, formatShortDate } from '../../utils/formatters'

interface UpcomingReleasesWidgetProps {
  releases: ReleaseGame[]
}

export function UpcomingReleasesWidget({ releases }: UpcomingReleasesWidgetProps) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-zinc-800/80">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Próximos Lançamentos
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Radar gamer de estreias aguardadas</p>
          </div>
          <Link
            to="/releases"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            Ver calendário
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {releases.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Nenhum lançamento agendado no radar.
            </div>
          ) : (
            releases.map((rel) => {
              const countdown = getCountdownText(rel.releaseDate)
              return (
                <div
                  key={rel.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-purple-500/40 transition-colors"
                >
                  <img
                    src={rel.coverUrl}
                    alt={rel.title}
                    className="w-12 h-16 rounded-lg object-cover shrink-0 bg-zinc-800 shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-white truncate">{rel.title}</h4>
                      {rel.inWishlist && (
                        <span className="text-[10px] text-purple-400 flex items-center gap-1 shrink-0 font-medium">
                          <Heart className="w-3 h-3 fill-purple-400 text-purple-400" />
                          Wishlist
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span className="font-mono text-zinc-300">{formatShortDate(rel.releaseDate)}</span>
                      <span>•</span>
                      <span className="truncate">{rel.genre}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge
                        variant={countdown.isReleased ? 'success' : 'secondary'}
                        className={`text-[10px] py-0 px-2 h-4 font-mono font-semibold ${
                          countdown.isReleased
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {countdown.label}
                      </Badge>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {rel.platforms.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
