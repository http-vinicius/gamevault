import { Target, Trophy, Edit3, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { MonthlyGoal } from '../../types'
import { MONTH_NAMES } from '../../constants'
import { formatCurrency } from '../../lib/utils'
import { calculatePercentage } from '../../utils/formatters'

interface MonthlyGoalCardProps {
  goal?: MonthlyGoal
  onEditGoal: () => void
  onAddFundsToGoal: () => void
}

export function MonthlyGoalCard({
  goal,
  onEditGoal,
  onAddFundsToGoal,
}: MonthlyGoalCardProps) {
  const monthName = goal ? MONTH_NAMES[goal.month - 1] : 'Setembro'
  const target = goal?.targetAmount ?? 300
  const current = goal?.currentAmount ?? 185
  const percentage = calculatePercentage(current, target)
  const remaining = Math.max(target - current, 0)
  const isCompleted = goal?.completed || current >= target

  return (
    <div className="glass-card rounded-2xl p-6 border border-zinc-800/80 bg-zinc-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Missão Gamer de Economia
            </span>
            <h3 className="text-lg font-bold text-white">
              Meta de {monthName} de {goal?.year ?? 2026}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Meta Concluída! (+1000 XP)
            </span>
          ) : (
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 px-3 py-1 rounded-lg border border-purple-500/30">
              Recompensa: +1000 XP
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={onEditGoal} title="Alterar valor da meta">
            <Edit3 className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {/* Progress Display */}
        <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <span className="text-xs text-zinc-400 block mb-0.5">Valor Economizado / Alvo</span>
              <span className="text-2xl font-black font-mono text-white">
                {formatCurrency(current)}{' '}
                <span className="text-base text-zinc-500 font-normal">/ {formatCurrency(target)}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-emerald-400">{percentage}%</span>
            </div>
          </div>

          <Progress
            value={percentage}
            className="h-2.5 bg-zinc-800"
            indicatorClassName="xp-gradient"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs mt-3 pt-3 border-t border-zinc-800/60 gap-3">
            <div>
              {remaining > 0 ? (
                <span className="text-zinc-400">
                  Faltam apenas{' '}
                  <span className="font-bold text-emerald-400 font-mono">
                    {formatCurrency(remaining)}
                  </span>{' '}
                  para completar o objetivo mensal.
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  Você superou sua meta de economia mensal! Seu autocontrole gamer é lendário.
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={onAddFundsToGoal}
              className="gap-1.5 text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Aportar na Meta
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
