import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Library,
  Heart,
  CalendarDays,
  Coins,
  Trophy,
  BarChart3,
} from 'lucide-react'

const MOBILE_ITEMS = [
  { label: 'Início', to: '/', icon: LayoutDashboard },
  { label: 'Biblioteca', to: '/library', icon: Library },
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Lançamentos', to: '/releases', icon: CalendarDays },
  { label: 'Cofre', to: '/vault', icon: Coins },
  { label: 'Conquistas', to: '/achievements', icon: Trophy },
  { label: 'Stats', to: '/statistics', icon: BarChart3 },
]

export function MobileNav() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-[#111114]/95 backdrop-blur-md px-2 py-1.5 safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors text-[10px] font-medium ${
                isActive ? 'text-purple-400 font-semibold' : 'text-zinc-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive ? 'bg-purple-500/20 glow-purple' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="truncate max-w-[52px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
