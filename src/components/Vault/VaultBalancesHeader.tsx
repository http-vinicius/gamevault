import { Coins, Lock, Wallet, Plus, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { formatCurrency } from '../../lib/utils'

interface VaultBalancesHeaderProps {
  totalVaultBalance: number
  reservedForGames: number
  freeBalance: number
  onOpenDeposit: () => void
}

export function VaultBalancesHeader({
  totalVaultBalance,
  reservedForGames,
  freeBalance,
  onOpenDeposit,
}: VaultBalancesHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            Cofre Gamer
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Área financeira gamificada: reserve para compras futuras e atinja suas metas mensais.
          </p>
        </div>

        <Button onClick={onOpenDeposit} variant="glow" className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Fazer Aporte</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            +50 XP / R$50
          </span>
        </Button>
      </div>

      {/* 3 Main Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Vault */}
        <div className="glass-card rounded-2xl p-6 border border-zinc-800/80 bg-zinc-900/60 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Cofre Gamer
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-white font-mono">
            {formatCurrency(totalVaultBalance)}
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">Patrimônio acumulado para jogos</p>
        </div>

        {/* Reserved for Games */}
        <div className="glass-card rounded-2xl p-6 border border-purple-500/30 bg-purple-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Reservado para Jogos
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-purple-200 font-mono">
            {formatCurrency(reservedForGames)}
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">Alocado em itens da sua Wishlist</p>
        </div>

        {/* Free Balance */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Saldo Livre
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight text-emerald-300 font-mono">
            {formatCurrency(freeBalance)}
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">Pronto para ofertas relâmpago ou novas metas</p>
        </div>
      </div>
    </div>
  )
}
