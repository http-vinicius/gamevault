import { Trophy, Award, Sparkles, Shield, Star, Coins, Gamepad2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'
import { UserProfile } from '../../types'
import { XP_RULES } from '../../constants'
import { calculatePercentage } from '../../utils/formatters'

interface GamificationProfileCardProps {
  profile?: UserProfile
  unlockedCount: number
  totalCount: number
}

export function GamificationProfileCard({
  profile,
  unlockedCount,
  totalCount,
}: GamificationProfileCardProps) {
  const currentXp = profile?.currentXp ?? 0
  const xpForNextLevel = profile?.xpForNextLevel ?? 0
  const level = profile?.level ?? 1
  const xpPercent = calculatePercentage(currentXp, xpForNextLevel)
  const achievementsPercent = calculatePercentage(unlockedCount, totalCount)

  return (
    <div className="space-y-4">
      {/* Gamer Profile Header Card */}
      <div className="glass-card rounded-2xl relative overflow-hidden border border-purple-500/30 bg-purple-950/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
          <Trophy className="w-48 h-48 text-purple-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Level & Avatar Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center glow-purple border-2 border-purple-400/40 shrink-0">
                  <Gamepad2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-purple-400/40 px-2 py-0.5 rounded-full text-[11px] font-black font-mono text-purple-300 shadow">
                  Nv. {level}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {profile?.name ?? ''}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {profile?.title ?? ''}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Nível de maestria e autocontrole gamer em evolução contínua.
                </p>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="flex items-center gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
              <div className="text-center px-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Conquistas</span>
                <span className="text-xl font-black font-mono text-amber-400">
                  {unlockedCount} / {totalCount}
                </span>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center px-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Total XP</span>
                <span className="text-xl font-black font-mono text-purple-400">
                  {profile?.totalXp ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Progresso para o Nível {level + 1}
              </span>
              <span className="font-mono font-bold text-white">
                {currentXp} <span className="text-zinc-500 font-normal">/ {xpForNextLevel} XP</span> ({xpPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full xp-gradient transition-all duration-500 ease-out"
                style={{ width: `${Math.min(Math.max(xpPercent, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rules Table / Legend on how to earn XP */}
      <div className="glass-card rounded-2xl p-5 border border-zinc-800/80 bg-zinc-900/40">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Tabela de Recompensas de XP
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Adicionar Jogo</span>
              <span className="font-mono font-bold text-violet-400 text-sm">+{XP_RULES.ADD_GAME} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Iniciar Jogo</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">+{XP_RULES.START_GAME} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Zerar Campanha</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">+{XP_RULES.COMPLETE_GAME} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Platinar (100%)</span>
              <span className="font-mono font-bold text-amber-400 text-sm">+{XP_RULES.PLATINUM_GAME} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Poupar R$50</span>
              <span className="font-mono font-bold text-teal-400 text-sm">+{XP_RULES.SAVE_FIFTY_REAIS} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Meta Mensal</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">+{XP_RULES.COMPLETE_MONTHLY_GOAL} XP</span>
            </div>

            <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block truncate">Promo Hunter</span>
              <span className="font-mono font-bold text-rose-400 text-sm">+{XP_RULES.BUY_BELOW_TARGET_PRICE} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
