import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Coins, Trophy, Gamepad2, Shield, LogOut } from 'lucide-react'
import { useVault } from '../../hooks/useVault'
import { useAchievements } from '../../hooks/useAchievements'
import { useAuth } from '../../contexts/AuthContext'
import { formatCurrency } from '../../lib/utils'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { vaultData } = useVault()
  const { profile } = useAchievements()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 bg-[#09090b]/80 px-6 md:px-8 py-5 backdrop-blur-md">
      <div>
        <div className="flex items-center gap-2 lg:hidden mb-1">
          <Gamepad2 className="h-5 w-5 text-purple-400" />
          <span className="font-extrabold text-sm tracking-tight text-white">GameVault</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Server status badge from Immersive UI */}
        <div className="hidden sm:flex bg-zinc-900 px-3.5 py-2 rounded-lg border border-zinc-800 items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">SERVER: ONLINE</span>
        </div>

        {/* Vault Quick Pill */}
        <Link
          to="/vault"
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:border-emerald-500/30 transition-colors"
          title="Saldo livre do Cofre Gamer"
        >
          <Coins className="h-4 w-4 text-emerald-400" />
          <span>Livre: {formatCurrency(vaultData?.freeBalance ?? 0)}</span>
        </Link>

        {/* Level / XP Quick Pill */}
        <Link
          to="/achievements"
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:border-purple-500/30 transition-colors"
          title="Nível e Conquistas"
        >
          <Trophy className="h-4 w-4 text-purple-400" />
          <span>Nv. {profile?.level ?? 1}</span>
          <span className="hidden sm:inline text-zinc-500">({profile?.currentXp ?? 0} XP)</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-rose-300 hover:border-rose-500/30 transition-colors cursor-pointer"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>

        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
