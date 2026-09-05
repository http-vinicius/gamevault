import { Link } from '@tanstack/react-router'
import { Trophy, Heart, Gamepad2, Coins, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { formatCurrency } from '../../lib/utils'

interface DashboardStatsCardsProps {
  completedCount: number
  wishlistCount: number
  playingCount: number
  vaultBalance: number
}

export function DashboardStatsCards({
  completedCount,
  wishlistCount,
  playingCount,
  vaultBalance,
}: DashboardStatsCardsProps) {
  const cards = [
    {
      title: 'Zeradinhos',
      value: completedCount,
      subtitle: 'Jogos concluídos',
      icon: Trophy,
      to: '/library',
      accentColor: 'text-green-400',
      extraClass: '',
    },
    {
      title: 'Wishlist',
      value: wishlistCount,
      subtitle: `${wishlistCount > 0 ? 'Radar ativo' : 'Vazia'}`,
      icon: Heart,
      to: '/wishlist',
      accentColor: 'text-zinc-500',
      extraClass: '',
    },
    {
      title: 'Jogando',
      value: playingCount,
      subtitle: 'Campanhas em curso',
      icon: Gamepad2,
      to: '/library',
      accentColor: 'text-purple-400',
      extraClass: 'border-l-purple-500 border-l-2',
    },
    {
      title: 'Cofre Gamer',
      value: formatCurrency(vaultBalance),
      subtitle: 'Economia acumulada',
      icon: Coins,
      to: '/vault',
      accentColor: 'text-emerald-400',
      extraClass: 'bg-zinc-900/80',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Link key={card.title} to={card.to} className="group block">
            <div
              className={`glass-card p-5 rounded-2xl hover:border-purple-500/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${card.extraClass}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{card.value}</p>
              <p className={`text-[10px] ${card.accentColor} mt-2 font-medium uppercase tracking-wider`}>
                {card.subtitle}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
