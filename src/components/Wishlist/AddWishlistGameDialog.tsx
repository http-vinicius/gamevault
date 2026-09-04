import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { wishlistGameSchema, WishlistGameFormData } from '../../schemas'
import { WishlistGame } from '../../types'
import { PLATFORMS, GENRES, PRIORITY_LABELS } from '../../constants'

interface AddWishlistGameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemToEdit?: WishlistGame | null
  onSubmitWish: (data: WishlistGameFormData) => Promise<void>
}

export function AddWishlistGameDialog({
  open,
  onOpenChange,
  itemToEdit,
  onSubmitWish,
}: AddWishlistGameDialogProps) {
  const isEditing = !!itemToEdit

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WishlistGameFormData>({
    resolver: zodResolver(wishlistGameSchema) as any,
    defaultValues: {
      title: '',
      coverUrl: '',
      platform: 'PC',
      genre: 'Ação e Aventura',
      priority: 'high',
      currentPrice: 299,
      targetPrice: 199,
      reservedAmount: 0,
      releaseDate: '',
      notes: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      if (itemToEdit) {
        reset({
          title: itemToEdit.title,
          coverUrl: itemToEdit.coverUrl,
          platform: itemToEdit.platform,
          genre: itemToEdit.genre,
          priority: itemToEdit.priority,
          currentPrice: itemToEdit.currentPrice,
          targetPrice: itemToEdit.targetPrice,
          reservedAmount: itemToEdit.reservedAmount,
          releaseDate: itemToEdit.releaseDate,
          notes: itemToEdit.notes || '',
        })
      } else {
        reset({
          title: '',
          coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
          platform: 'PC',
          genre: 'Ação e Aventura',
          priority: 'high',
          currentPrice: 299,
          targetPrice: 199,
          reservedAmount: 0,
          releaseDate: '2026-11-15',
          notes: '',
        })
      }
    }
  }, [open, itemToEdit, reset])

  const onSubmit = async (values: WishlistGameFormData) => {
    try {
      await onSubmitWish(values)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Editar Jogo Desejado' : 'Adicionar Jogo à Wishlist'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Ajuste metas de preço e prioridade de compra.'
            : 'Defina seu preço desejado e comece a poupar dinheiro com metas claras.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Título do Jogo *</label>
          <Input placeholder="Ex: GTA VI, Clair Obscur..." {...register('title')} />
          {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
        </div>

        {/* Cover */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">URL da Imagem da Capa *</label>
          <Input placeholder="https://..." {...register('coverUrl')} />
          {errors.coverUrl && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.coverUrl.message}</p>
          )}
        </div>

        {/* Platform, Priority & Genre */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Plataforma *</label>
            <Select {...register('platform')}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Prioridade *</label>
            <Select {...register('priority')}>
              {Object.entries(PRIORITY_LABELS).map(([k, item]) => (
                <option key={k} value={k}>
                  {item.icon} {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Gênero *</label>
            <Select {...register('genre')}>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Prices & Reserved */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Preço Atual (R$)</label>
            <Input type="number" step="0.01" min="0" {...register('currentPrice')} />
            {errors.currentPrice && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.currentPrice.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Preço que Quero Pagar (R$)</label>
            <Input type="number" step="0.01" min="0" {...register('targetPrice')} />
            {errors.targetPrice && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.targetPrice.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Dinheiro Reservado (R$)</label>
            <Input type="number" step="0.01" min="0" {...register('reservedAmount')} />
          </div>
        </div>

        {/* Release Date */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Data de Lançamento Prevista *</label>
          <Input type="date" {...register('releaseDate')} />
          {errors.releaseDate && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.releaseDate.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Observações ou Motivo do Desejo</label>
          <Textarea
            placeholder="Ex: Esperando review no lançamento, promoção da Black Friday..."
            {...register('notes')}
          />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Desejo' : 'Adicionar à Wishlist'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
