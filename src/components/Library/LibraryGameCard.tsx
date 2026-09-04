import { Star, Clock, Trophy, RotateCcw, Edit2, Trash2, Eye } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { LibraryGame } from '../../types'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants'

interface LibraryGameCardProps {
  key?: string
  game: LibraryGame
  onViewDetails: (game: LibraryGame) => void
  onEdit: (game: LibraryGame) => void
  onDelete: (id: string) => void
}

export function LibraryGameCard({
  game,
  onViewDetails,
  onEdit,
  onDelete,
}: LibraryGameCardProps) {
  const statusCfg = STATUS_COLORS[game.status]

  return (
    <div className="glass-card rounded-2xl group overflow-hidden border border-zinc-800/80 hover:border-purple-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover with overlay status */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow font-semibold ${statusCfg.badge}`}
            >
              {STATUS_LABELS[game.status]}
            </span>
            <Badge variant="secondary" className="bg-zinc-950/80 backdrop-blur-md text-[10px] border border-zinc-800">
              {game.platform}
            </Badge>
          </div>

          {/* Bottom badge overlay: Rating */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
            {game.rating > 0 && (
              <span className="flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-amber-400 font-mono border border-amber-500/20 shadow">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {game.rating.toFixed(1)}
              </span>
            )}
            {game.wouldPlayAgain && (
              <span
                className="bg-zinc-950/90 backdrop-blur-md p-1 rounded-lg text-purple-400 border border-purple-500/20"
                title="Jogaria novamente!"
              >
                <RotateCcw className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            onClick={() => onViewDetails(game)}
            className="font-bold text-base text-white truncate hover:text-purple-400 cursor-pointer transition-colors"
            title={game.title}
          >
            {game.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{game.genre}</p>

          <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2 border-t border-zinc-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              {game.hoursPlayed}h jogadas
            </span>
            <span className="font-mono text-purple-400 font-bold">
              {game.progress}%
            </span>
          </div>

          <Progress value={game.progress} className="h-1.5 mt-2" />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <button
          onClick={() => onViewDetails(game)}
          className="flex items-center gap-1 text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer font-medium"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Detalhes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(game)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Editar jogo"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(game.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Excluir da biblioteca"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
