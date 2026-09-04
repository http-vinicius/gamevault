import { Plus, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

interface LibraryHeaderProps {
  totalCount: number
  onAddClick: () => void
}

export function LibraryHeader({ totalCount, onAddClick }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100">
            Minha Biblioteca
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {totalCount} jogos
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Acompanhe seu backlog, horas jogadas, conquistas e notas pessoais.
        </p>
      </div>

      <Button onClick={onAddClick} className="gap-2 self-start sm:self-auto" variant="glow">
        <Plus className="h-4 w-4" />
        <span>Adicionar Jogo</span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          +10 XP
        </span>
      </Button>
    </div>
  )
}
