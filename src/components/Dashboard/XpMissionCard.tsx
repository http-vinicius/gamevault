import { Trophy, Target, Sparkles, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { UserProfile, MonthlyGoal, Achievement } from '../../types'
import { formatCurrency } from '../../lib/utils'
import { calculatePercentage } from '../../utils/formatters'
import { MONTH_NAMES } from '../../constants'

interface XpMissionCardProps {
  profile?: UserProfile
  monthlyGoal?: MonthlyGoal
  latestAchievement?: Achievement
}

export function XpMissionCard({ profile, monthlyGoal, latestAchievement }: XpMissionCardProps) {
  const currentXp = profile?.currentXp ?? 0
  const xpForNextLevel = profile?.xpForNextLevel ?? 0
  const level = profile?.level ?? 1
  const xpPercent = calculatePercentage(currentXp, xpForNextLevel)

  const monthName = monthlyGoal ? MONTH_NAMES[monthlyGoal.month - 1] : ''
  const target = monthlyGoal?.targetAmount ?? 0
  const current = monthlyGoal?.currentAmount ?? 0
  const goalPercent = calculatePercentage(current, target)
  const remaining = Math.max(target - current, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* XP & Level Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-zinc-800/80 bg-zinc-900/40">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Progresso Gamer
          </span>
          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
            XP ATUAL
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-2xl font-black text-white">
            Nível {level}
          </h3>
          <span className="text-xs text-zinc-400 font-medium">
            {profile?.title ?? ''}
          </span>
        </div>

        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-mono font-bold text-slate-200">
            {currentXp} <span className="text-zinc-500 font-normal">/ {xpForNextLevel} XP</span>
          </span>
          <span className="text-xs font-bold text-purple-400 font-mono">{xpPercent}%</span>
        </div>

        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full xp-gradient transition-all duration-500 ease-out"
            style={{ width: `${Math.min(Math.max(xpPercent, 0), 100)}%` }}
          />
        </div>

        <p className="text-xs text-zinc-400">
          Faltam <span className="font-semibold text-white">{xpForNextLevel - currentXp} XP</span> para alcançar o Nível {level + 1}.
        </p>
      </div>

      {/* Missão do Mês Card (Immersive UI Style) */}
      <div className="glass-card rounded-2xl p-6 bg-purple-900/10 border border-purple-500/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            {monthName ? `Missão de ${monthName}` : 'Missão do Mês'}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            +1000 XP
          </span>
        </div>

        {monthlyGoal ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-purple-500 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white font-mono">{goalPercent}%</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-400">Objetivo: Economizar para</p>
                <p className="text-base font-bold text-white leading-tight truncate">
                  Reserva de Jogos & Lançamentos
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end mb-1.5">
              <p className="text-lg font-black text-white font-mono">
                {formatCurrency(current)}{' '}
                <span className="text-zinc-500 font-normal text-xs">/ {formatCurrency(target)}</span>
              </p>
            </div>

            <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${Math.min(Math.max(goalPercent, 0), 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-400">
              {remaining > 0 ? (
                <>Faltam <span className="text-purple-300 font-semibold">{formatCurrency(remaining)}</span> para a meta.</>
              ) : (
                <span className="text-green-400 font-semibold">Meta de economia batida! 🏆</span>
              )}
            </p>
          </>
        ) : (
          <div className="py-8 text-center text-zinc-500 text-sm">
            Nenhuma meta mensal definida ainda.
          </div>
        )}
      </div>

      {/* Últimas Conquistas Card */}
      <div className="glass-card rounded-2xl p-6 border border-zinc-800/80 bg-zinc-900/40 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Últimas Conquistas
          </h3>
          {latestAchievement && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Desbloqueada
            </span>
          )}
        </div>

        {latestAchievement ? (
          <div className="flex gap-3.5 items-center mt-1">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shrink-0 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {latestAchievement.title}
              </p>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                {latestAchievement.description}
              </p>
              <span className="text-[10px] font-bold text-purple-400 font-mono inline-block mt-1">
                +{latestAchievement.xpReward} XP Obtidos
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-500 text-sm">
            Nenhuma conquista desbloqueada ainda.
          </div>
        )}
      </div>
    </div>
  )
}
