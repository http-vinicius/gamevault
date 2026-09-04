import { Link } from '@tanstack/react-router'
import { Play, Clock, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { LibraryGame } from '../../types'

interface CurrentlyPlayingListProps {
  games: LibraryGame[]
}

export function CurrentlyPlayingList({ games }: CurrentlyPlayingListProps) {
  const featuredGame = games[0]
  const otherGames = games.slice(1)

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-zinc-800/80">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold tracking-wider uppercase">
              Jogando Agora
            </span>
            {featuredGame && (
              <span className="text-xs text-zinc-500 font-mono">
                {featuredGame.hoursPlayed}h Registradas
              </span>
            )}
          </div>
          <Link
            to="/library"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            Ver biblioteca
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredGame ? (
          <div className="mb-6">
            <div className="flex gap-4 items-start">
              <img
                src={featuredGame.coverUrl}
                alt={featuredGame.title}
                className="w-16 h-20 rounded-xl object-cover shadow-lg border border-zinc-700/60 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                    {featuredGame.title}
                  </h3>
                  <Badge variant="outline" className="text-[10px] py-0 px-2 h-5 border-zinc-700">
                    {featuredGame.platform}
                  </Badge>
                </div>
                <p className="text-zinc-400 text-xs line-clamp-2">
                  {featuredGame.notes || 'Campanha em andamento ativo. Foco total em completar os objetivos principais.'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">Progresso da Campanha</span>
                <span className="text-purple-400 font-bold font-mono">{featuredGame.progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full xp-gradient transition-all duration-500 ease-out"
                  style={{ width: `${featuredGame.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-sm">
            Nenhum jogo em andamento no momento.
          </div>
        )}
      </div>

      {otherGames.length > 0 && (
        <div className="pt-4 border-t border-zinc-800/80 space-y-2 mt-auto">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            Outros em Andamento
          </p>
          {otherGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <span className="text-xs font-semibold text-slate-200 truncate">{game.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                <span className="text-zinc-400">{game.hoursPlayed}h</span>
                <span className="text-purple-400 font-bold">{game.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
