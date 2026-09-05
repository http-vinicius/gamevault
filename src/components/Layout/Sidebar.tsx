import { Link, useRouterState } from '@tanstack/react-router'
import {
  Gamepad2,
  LayoutDashboard,
  Library,
  Heart,
  CalendarDays,
  Coins,
  Trophy,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { Progress } from '../ui/progress'
import { useAchievements } from '../../hooks/useAchievements'
import { calculatePercentage } from '../../utils/formatters'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Minha Biblioteca', to: '/library', icon: Library },
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Lançamentos', to: '/releases', icon: CalendarDays },
  { label: 'Cofre Gamer', to: '/vault', icon: Coins },
  { label: 'Conquistas', to: '/achievements', icon: Trophy },
  { label: 'Estatísticas', to: '/statistics', icon: BarChart3 },
]

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { profile } = useAchievements()

  const level = profile?.level ?? 1
  const currentXp = profile?.currentXp ?? 0
  const xpForNextLevel = profile?.xpForNextLevel ?? 0
  const xpPercentage = calculatePercentage(currentXp, xpForNextLevel)

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-zinc-800 bg-[#111114] h-screen sticky top-0 shrink-0 select-none">
      <div className="p-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center glow-purple shrink-0 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white leading-none">
              GameVault
            </h1>
            <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-bold mt-1">
              Command Hub
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'sidebar-item-active text-purple-400 font-semibold'
                    : 'text-zinc-400 hover:text-slate-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-purple-400' : 'opacity-60 text-zinc-400'
                  }`}
                />
                <span className={isActive ? 'text-purple-400' : 'opacity-80'}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Profile & XP Widget */}
      <div className="p-6 pt-0">
        <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-zinc-400 tracking-wider">
              NÍVEL {level}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {currentXp} / {xpForNextLevel} XP
            </span>
          </div>

          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full xp-gradient transition-all duration-500 ease-out"
              style={{ width: `${Math.min(Math.max(xpPercentage, 0), 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile?.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gamepad2 className="w-5 h-5 text-zinc-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {profile?.name ?? ''}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">
                {profile?.title ?? ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
