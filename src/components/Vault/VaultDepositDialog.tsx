import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Coins, Sparkles, Target, Wallet, Lock } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { depositVaultSchema, DepositVaultFormData } from '../../schemas'
import { WishlistGame, MonthlyGoal } from '../../types'
import { formatCurrency } from '../../lib/utils'

interface VaultDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wishlistGames: WishlistGame[]
  currentGoal?: MonthlyGoal
  defaultDestination?: 'free' | 'game' | 'monthly_goal'
  defaultGameId?: string
  onSubmitDeposit: (data: {
    amount: number
    destination: 'free' | 'game' | 'monthly_goal'
    gameId?: string
    description?: string
  }) => Promise<void>
}

export function VaultDepositDialog({
  open,
  onOpenChange,
  wishlistGames,
  currentGoal,
  defaultDestination = 'free',
  defaultGameId,
  onSubmitDeposit,
}: VaultDepositDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepositVaultFormData>({
    resolver: zodResolver(depositVaultSchema) as any,
    defaultValues: {
      amount: 50,
      destination: defaultDestination,
      gameId: defaultGameId || (wishlistGames[0]?.id ?? ''),
      description: 'Aporte no Cofre',
    },
  })

  const destination = watch('destination')
  const amount = watch('amount') || 0
  const xpReward = Math.floor(amount / 50) * 50

  React.useEffect(() => {
    if (open) {
      reset({
        amount: 50,
        destination: defaultDestination,
        gameId: defaultGameId || (wishlistGames[0]?.id ?? ''),
        description:
          defaultDestination === 'monthly_goal'
            ? 'Aporte para Meta Mensal'
            : defaultDestination === 'game'
            ? 'Reserva para jogo'
            : 'Aporte para saldo livre',
      })
    }
  }, [open, defaultDestination, defaultGameId, wishlistGames, reset])

  const onSubmit = async (values: DepositVaultFormData) => {
    try {
      await onSubmitDeposit({
        amount: values.amount,
        destination: values.destination,
        gameId: values.destination === 'game' ? values.gameId : undefined,
        description: values.description,
      })
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          Guardar Dinheiro no Cofre Gamer
        </DialogTitle>
        <DialogDescription>
          Reserve fundos, ganhe XP e mantenha seu orçamento de games protegido.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Destination Option */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Destino do Aporte *</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setValue('destination', 'free')
                setValue('description', 'Aporte para saldo livre')
              }}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-1 cursor-pointer ${
                destination === 'free'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Saldo Livre</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setValue('destination', 'monthly_goal')
                setValue('description', 'Aporte para meta mensal')
              }}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-1 cursor-pointer ${
                destination === 'monthly_goal'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Meta Mensal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setValue('destination', 'game')
                setValue('description', 'Reserva direta para jogo')
              }}
              className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-1 cursor-pointer ${
                destination === 'game'
                  ? 'border-violet-500 bg-violet-500/15 text-violet-300 font-semibold'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Lock className="w-4 h-4 text-violet-400" />
              <span>Jogo Específico</span>
            </button>
          </div>
        </div>

        {/* If destination is game, select game */}
        {destination === 'game' && (
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Selecione o Jogo da Wishlist *
            </label>
            <Select {...register('gameId')}>
              {wishlistGames.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({formatCurrency(w.reservedAmount)} / {formatCurrency(w.targetPrice || w.currentPrice)})
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Valor do Aporte (R$) *</label>
          <Input
            type="number"
            step="1"
            min="1"
            className="text-lg font-mono font-bold"
            {...register('amount')}
          />
          {errors.amount && <p className="text-[11px] text-rose-400 mt-1">{errors.amount.message}</p>}

          {/* Quick Amount Pills */}
          <div className="flex items-center gap-2 mt-2">
            {[20, 50, 100, 200].map((val) => (
              <Button
                key={val}
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 text-xs font-mono"
                onClick={() => setValue('amount', val)}
              >
                + R$ {val}
              </Button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Descrição / Nota</label>
          <Input placeholder="Ex: Sobra do salário, economia da semana..." {...register('description')} />
          {errors.description && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Gamification Preview */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Recompensa Gamer por Economizar:</span>
          </div>
          <span className="font-mono font-bold text-amber-400 text-sm">+{xpReward} XP</span>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Coins className="w-4 h-4" />
            {isSubmitting ? 'Salvando...' : 'Confirmar Depósito'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
