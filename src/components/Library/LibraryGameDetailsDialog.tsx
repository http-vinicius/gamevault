import { Star, Clock, Calendar, DollarSign, RotateCcw, Edit2 } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { LibraryGame } from '../../types'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants'
import { formatCurrency } from '../../lib/utils'
import { formatShortDate } from '../../utils/formatters'

interface LibraryGameDetailsDialogProps {
  game: LibraryGame | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (game: LibraryGame) => void
}

export function LibraryGameDetailsDialog({
  game,
  open,
  onOpenChange,
  onEdit,
}: LibraryGameDetailsDialogProps) {
  if (!game) return null

  const statusCfg = STATUS_COLORS[game.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Cover Banner */}
      <div className="-mx-6 -mt-6 relative h-48 sm:h-56 overflow-hidden rounded-t-xl bg-zinc-950 mb-4">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${statusCfg.badge}`}>
                {STATUS_LABELS[game.status]}
              </span>
              <Badge variant="secondary" className="bg-zinc-950/80 backdrop-blur-md">
                {game.platform}
              </Badge>
            </div>
            <h2 className="text-2xl font-black text-white drop-shadow-md">{game.title}</h2>
            <p className="text-xs text-zinc-300 drop-shadow">{game.genre}</p>
          </div>

          {game.rating > 0 && (
            <div className="flex items-center gap-1 bg-zinc-950/90 border border-amber-500/30 px-3 py-1 rounded-lg text-amber-400 font-bold font-mono">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{game.rating.toFixed(1)}/10</span>
            </div>
          )}
        </div>
      </div>

      <DialogHeader className="mb-3">
        <DialogTitle className="sr-only">{game.title}</DialogTitle>
      </DialogHeader>

      {/* Progress */}
      <div className="space-y-1.5 mb-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Progresso de Campanha</span>
          <span className="font-mono font-bold text-zinc-200">{game.progress}%</span>
        </div>
        <Progress value={game.progress} className="h-2" />
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
        <div className="bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800">
          <span className="text-zinc-500 block mb-0.5">Tempo de Jogo</span>
          <span className="font-bold text-zinc-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {game.hoursPlayed} horas
          </span>
        </div>

        <div className="bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800">
          <span className="text-zinc-500 block mb-0.5">Preço Pago</span>
          <span className="font-bold text-zinc-200 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
            {formatCurrency(game.pricePaid)}
          </span>
        </div>

        <div className="bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-800 col-span-2 sm:col-span-1">
          <span className="text-zinc-500 block mb-0.5">Jogaria Novamente?</span>
          <span className="font-bold text-zinc-200 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            {game.wouldPlayAgain ? 'Sim, com certeza!' : 'Apenas uma vez'}
          </span>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Início: {formatShortDate(game.startDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
          <span>Conclusão: {formatShortDate(game.completionDate)}</span>
        </div>
      </div>

      {/* Notes */}
      {game.notes && (
        <div className="bg-zinc-800/30 p-3.5 rounded-lg border border-zinc-800 text-xs text-zinc-300 mb-2">
          <span className="font-semibold text-zinc-400 block mb-1">Observações do Jogador:</span>
          <p className="leading-relaxed whitespace-pre-wrap">{game.notes}</p>
        </div>
      )}

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="text-xs"
        >
          Fechar
        </Button>
        <Button
          onClick={() => {
            onOpenChange(false)
            onEdit(game)
          }}
          className="gap-2 text-xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Editar Jogo
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
