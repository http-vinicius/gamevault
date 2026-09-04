import { Gamepad2, Clock, DollarSign, PiggyBank, Star, Flame } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { StatisticsData } from '../../types'
import { formatCurrency } from '../../lib/utils'

interface StatisticsOverviewCardsProps {
  stats: StatisticsData
}

export function StatisticsOverviewCards({ stats }: StatisticsOverviewCardsProps) {
  const platinumCount =
    stats.statusBreakdown?.find((s) => s.status === 'platinum')?.count ?? 0
  const avgPrice = stats.gamesCount > 0 ? stats.totalSpent / stats.gamesCount : 0

  const cards = [
    {
      title: 'Total de Jogos',
      value: stats.gamesCount,
      subtitle: `${stats.gamesCompleted} zerados (${platinumCount} platinas)`,
      icon: Gamepad2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      title: 'Tempo Total Jogado',
      value: `${stats.totalHoursPlayed}h`,
      subtitle: `Média de ${(stats.totalHoursPlayed / Math.max(stats.gamesCount, 1)).toFixed(1)}h por título`,
      icon: Clock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Total Investido em Jogos',
      value: formatCurrency(stats.totalSpent),
      subtitle: `Média de ${formatCurrency(avgPrice)} por game`,
      icon: DollarSign,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
    {
      title: 'Custo por Hora Jogada',
      value: `${formatCurrency(stats.costPerHour)} /h`,
      subtitle: stats.costPerHour < 5 ? 'Excelente custo-benefício!' : 'Bom aproveitamento',
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      title: 'Total Economizado no Cofre',
      value: formatCurrency(stats.totalSavedInVault),
      subtitle: 'Autocontrole e planejamento',
      icon: PiggyBank,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      title: 'Avaliação Média dos Jogos',
      value: `${stats.averageRating.toFixed(1)} / 10`,
      subtitle: 'Gosto refinado de jogos',
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Card
            key={c.title}
            className={`border ${c.border} bg-zinc-900/60 backdrop-blur-sm overflow-hidden`}
          >
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-zinc-400 font-medium">{c.title}</span>
                <div className="text-2xl font-black text-zinc-100 tracking-tight mt-0.5">
                  {c.value}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">{c.subtitle}</p>
              </div>
              <div className={`p-3 rounded-xl ${c.bg} ${c.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
