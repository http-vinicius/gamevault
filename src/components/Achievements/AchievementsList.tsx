import * as React from 'react'
import {
  Trophy,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Wallet,
  Clock,
  Compass,
  Zap,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Achievement } from '../../types'
import { formatShortDate } from '../../utils/formatters'

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>('all')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'unlocked' | 'locked'>('all')

  const categories = [
    { key: 'all', label: 'Todas as Categorias' },
    { key: 'games', label: 'Jogos' },
    { key: 'finance', label: 'Finanças' },
    { key: 'mastery', label: 'Maestria' },
  ]

  const filtered = achievements.filter((ach) => {
    if (filterCategory !== 'all' && ach.category !== filterCategory) return false
    if (filterStatus === 'unlocked' && !ach.unlocked) return false
    if (filterStatus === 'locked' && ach.unlocked) return false
    return true
  })

  // Dynamic icon helper
  const renderIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? 'text-amber-400' : 'text-zinc-600'}`
    switch (iconName) {
      case 'Footprints':
      case 'Compass':
        return <Compass className={className} />
      case 'Trophy':
        return <Trophy className={className} />
      case 'Sparkles':
        return <Sparkles className={className} />
      case 'Clock':
        return <Clock className={className} />
      case 'Coins':
      case 'PiggyBank':
      case 'Wallet':
        return <Wallet className={className} />
      case 'Flame':
        return <Flame className={className} />
      default:
        return <Award className={className} />
    }
  }

  return (
    <div className="space-y-4">
      {/* Category and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat.key
                  ? 'bg-violet-600 text-white shadow font-semibold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400'
            }`}
          >
            Todas ({achievements.length})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterStatus === 'unlocked' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-zinc-400'
            }`}
          >
            Desbloqueadas ({achievements.filter((a) => a.unlocked).length})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterStatus === 'locked' ? 'bg-zinc-800 text-zinc-300 font-semibold' : 'text-zinc-400'
            }`}
          >
            Bloqueadas ({achievements.filter((a) => !a.unlocked).length})
          </button>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => {
          const isUnlocked = ach.unlocked
          const progressVal = ach.maxProgress ? (ach.progress / ach.maxProgress) * 100 : 0

          return (
            <Card
              key={ach.id}
              className={`border transition-all duration-200 ${
                isUnlocked
                  ? 'border-amber-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20'
                  : 'border-zinc-800/80 bg-zinc-900/40 opacity-75'
              }`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-xl border flex-shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/10'
                        : 'bg-zinc-800/60 border-zinc-700/60'
                    }`}
                  >
                    {isUnlocked ? (
                      renderIcon(ach.icon, true)
                    ) : (
                      <Lock className="w-6 h-6 text-zinc-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4
                        className={`font-black text-sm truncate ${
                          isUnlocked ? 'text-zinc-100' : 'text-zinc-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex-shrink-0">
                        +{ach.xpReward} XP
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2">{ach.description}</p>
                  </div>
                </div>

                {/* Bottom status / progress */}
                <div className="pt-2 border-t border-zinc-800/80">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[11px] text-emerald-400">
                      <span className="flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Desbloqueada
                      </span>
                      {ach.unlockedAt && (
                        <span className="text-zinc-500">{formatShortDate(ach.unlockedAt)}</span>
                      )}
                    </div>
                  ) : ach.maxProgress ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-400">
                        <span>Progresso</span>
                        <span className="font-mono font-medium text-zinc-300">
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <Progress value={progressVal} className="h-1.5 bg-zinc-800" />
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Bloqueada</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
