import { LibraryGame } from '../../types'
import { LibraryGameCard } from './LibraryGameCard'
import { Skeleton } from '../ui/skeleton'
import { Gamepad2, Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface LibraryGridProps {
  games: LibraryGame[]
  isLoading: boolean
  onViewDetails: (game: LibraryGame) => void
  onEdit: (game: LibraryGame) => void
  onDelete: (id: string) => void
  onAddGame: () => void
}

export function LibraryGrid({
  games,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onAddGame,
}: LibraryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
          <Gamepad2 className="w-6 h-6 text-violet-400" />
        </div>
        <h3 className="text-base font-bold text-zinc-200">Nenhum jogo encontrado</h3>
        <p className="text-xs text-zinc-400 max-w-sm mt-1">
          Não encontramos nenhum jogo com os filtros selecionados ou sua biblioteca ainda está vazia.
        </p>
        <Button onClick={onAddGame} className="mt-4 gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Cadastrar Jogo
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((game) => (
        <LibraryGameCard
          key={game.id}
          game={game}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
