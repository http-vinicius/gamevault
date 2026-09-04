import { ArrowDownLeft, ArrowUpRight, Lock, Target, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { VaultTransaction } from '../../types'
import { formatCurrency } from '../../lib/utils'
import { formatShortDate } from '../../utils/formatters'

interface TransactionHistoryListProps {
  transactions: VaultTransaction[]
}

export function TransactionHistoryList({ transactions }: TransactionHistoryListProps) {
  const getIcon = (type: VaultTransaction['type']) => {
    switch (type) {
      case 'deposit_free':
        return <Wallet className="w-4 h-4 text-emerald-400" />
      case 'monthly_goal':
        return <Target className="w-4 h-4 text-indigo-400" />
      case 'reserve_game':
        return <Lock className="w-4 h-4 text-violet-400" />
      default:
        return <ArrowDownLeft className="w-4 h-4 text-amber-400" />
    }
  }

  const getTypeLabel = (type: VaultTransaction['type']) => {
    switch (type) {
      case 'deposit_free':
        return 'Saldo Livre'
      case 'monthly_goal':
        return 'Meta Mensal'
      case 'reserve_game':
        return 'Reserva para Jogo'
      default:
        return 'Transação'
    }
  }

  return (
    <Card className="border-zinc-800/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-zinc-100 flex items-center justify-between">
          <span>Histórico de Transações</span>
          <span className="text-xs font-normal text-zinc-500">
            {transactions.length} registros
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500">
            Nenhuma transação registrada ainda no Cofre Gamer.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/70">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/60 flex-shrink-0">
                    {getIcon(tx.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-200 truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] mt-0.5">
                      <span className="font-medium text-zinc-400">{getTypeLabel(tx.type)}</span>
                      <span>•</span>
                      <span>{formatShortDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-mono font-bold text-sm text-emerald-400 block">
                    +{formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
