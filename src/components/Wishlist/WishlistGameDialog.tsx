import * as React from 'react'
import { Coins, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { WishlistGame } from '../../types'
import { formatCurrency } from '../../lib/utils'

interface WishlistGameDialogProps {
  item: WishlistGame | null
  mode: 'reserve' | 'buy' | null
  open: boolean
  freeBalance: number
  onOpenChange: (open: boolean) => void
  onConfirmReserve: (amount: number) => Promise<void>
  onConfirmBuy: (purchasePrice: number, status: 'backlog' | 'playing') => Promise<void>
}

export function WishlistGameDialog({
  item,
  mode,
  open,
  freeBalance,
  onOpenChange,
  onConfirmReserve,
  onConfirmBuy,
}: WishlistGameDialogProps) {
  if (!item || !mode) return null

  const target = item.targetPrice || item.currentPrice
  const remaining = Math.max(target - item.reservedAmount, 0)

  // Reserve mode state
  const [reserveAmount, setReserveAmount] = React.useState<number>(Math.min(50, freeBalance))

  // Buy mode state
  const [purchasePrice, setPurchasePrice] = React.useState<number>(item.targetPrice || item.currentPrice)
  const [initialStatus, setInitialStatus] = React.useState<'backlog' | 'playing'>('playing')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setReserveAmount(Math.min(remaining > 0 ? remaining : 50, Math.max(freeBalance, 10)))
      setPurchasePrice(item.targetPrice || item.currentPrice)
    }
  }, [open, item, remaining, freeBalance])

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reserveAmount <= 0) return
    setIsSubmitting(true)
    try {
      await onConfirmReserve(reserveAmount)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onConfirmBuy(purchasePrice, initialStatus)
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (mode === 'reserve') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Reservar Dinheiro para {item.title}
          </DialogTitle>
          <DialogDescription>
            Aloque parte do seu saldo livre do Cofre Gamer para este jogo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReserveSubmit} className="space-y-4">
          <div className="bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Saldo Livre Disponível no Cofre:</span>
              <span className="font-mono font-bold text-amber-400">{formatCurrency(freeBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Já reservado para este jogo:</span>
              <span className="font-mono font-bold text-zinc-200">{formatCurrency(item.reservedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Falta para o preço-alvo:</span>
              <span className="font-mono font-bold text-violet-400">{formatCurrency(remaining)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Quanto deseja reservar agora? (R$)
            </label>
            <Input
              type="number"
              step="1"
              min="1"
              max={freeBalance}
              value={reserveAmount}
              onChange={(e) => setReserveAmount(parseFloat(e.target.value) || 0)}
              className="text-lg font-mono font-bold"
            />
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2 text-xs">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setReserveAmount(Math.min(50, freeBalance))}
              disabled={freeBalance < 50}
            >
              + R$ 50
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setReserveAmount(Math.min(100, freeBalance))}
              disabled={freeBalance < 100}
            >
              + R$ 100
            </Button>
            {remaining > 0 && remaining <= freeBalance && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setReserveAmount(remaining)}
              >
                Completar Meta ({formatCurrency(remaining)})
              </Button>
            )}
          </div>

          {reserveAmount > freeBalance && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Saldo livre insuficiente. Faça um depósito no Cofre primeiro.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || reserveAmount <= 0 || reserveAmount > freeBalance}
              className="gap-1.5"
            >
              <Coins className="w-4 h-4" />
              {isSubmitting ? 'Confirmando...' : `Confirmar Reserva de ${formatCurrency(reserveAmount)}`}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    )
  }

  // Buy Mode
  const boughtBelowTarget = purchasePrice <= item.targetPrice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          Mover "{item.title}" para Biblioteca
        </DialogTitle>
        <DialogDescription>
          Confirme a aquisição do jogo para adicioná-lo ao seu catálogo de jogos!
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleBuySubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            Preço Real Pago na Compra (R$) *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
            className="text-lg font-mono font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            Status Inicial na Biblioteca *
          </label>
          <Select
            value={initialStatus}
            onChange={(e) => setInitialStatus(e.target.value as any)}
          >
            <option value="playing">🎮 Começar a Jogar Agora (+25 XP)</option>
            <option value="backlog">📦 Guardar no Backlog (+10 XP)</option>
          </Select>
        </div>

        {boughtBelowTarget && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Bônus Promo Hunter!</strong> Você comprou pelo preço-alvo ou abaixo! Você ganhará <strong>+300 XP extra</strong>!
            </span>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500">
            <ShoppingBag className="w-4 h-4" />
            {isSubmitting ? 'Transferindo...' : 'Confirmar e Adicionar à Biblioteca'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
