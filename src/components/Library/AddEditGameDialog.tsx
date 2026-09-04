import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { libraryGameSchema, LibraryGameFormData } from '../../schemas'
import { LibraryGame } from '../../types'
import { PLATFORMS, GENRES, STATUS_LABELS } from '../../constants'

interface AddEditGameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameToEdit?: LibraryGame | null
  onSubmitGame: (data: LibraryGameFormData) => Promise<void>
}

export function AddEditGameDialog({
  open,
  onOpenChange,
  gameToEdit,
  onSubmitGame,
}: AddEditGameDialogProps) {
  const isEditing = !!gameToEdit

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LibraryGameFormData>({
    resolver: zodResolver(libraryGameSchema) as any,
    defaultValues: {
      title: '',
      coverUrl: '',
      platform: 'PC',
      status: 'backlog',
      genre: 'Ação e Aventura',
      hoursPlayed: 0,
      progress: 0,
      rating: 0,
      pricePaid: 0,
      startDate: '',
      completionDate: '',
      notes: '',
      wouldPlayAgain: false,
    },
  })

  // Populate form when editing or resetting
  React.useEffect(() => {
    if (open) {
      if (gameToEdit) {
        reset({
          title: gameToEdit.title,
          coverUrl: gameToEdit.coverUrl,
          platform: gameToEdit.platform,
          status: gameToEdit.status,
          genre: gameToEdit.genre,
          hoursPlayed: gameToEdit.hoursPlayed,
          progress: gameToEdit.progress,
          rating: gameToEdit.rating,
          pricePaid: gameToEdit.pricePaid,
          startDate: gameToEdit.startDate || '',
          completionDate: gameToEdit.completionDate || '',
          notes: gameToEdit.notes || '',
          wouldPlayAgain: gameToEdit.wouldPlayAgain,
        })
      } else {
        reset({
          title: '',
          coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
          platform: 'PC',
          status: 'backlog',
          genre: 'Ação e Aventura',
          hoursPlayed: 0,
          progress: 0,
          rating: 0,
          pricePaid: 0,
          startDate: '',
          completionDate: '',
          notes: '',
          wouldPlayAgain: false,
        })
      }
    }
  }, [open, gameToEdit, reset])

  const onSubmit = async (values: LibraryGameFormData) => {
    try {
      await onSubmitGame(values)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Editar Jogo' : 'Cadastrar Jogo na Biblioteca'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Atualize os detalhes, progresso ou avaliação do jogo.'
            : 'Preencha as informações para registrar o jogo e acumular XP gamer.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Título do Jogo *</label>
          <Input placeholder="Ex: Elden Ring, Persona 3 Reload..." {...register('title')} />
          {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
        </div>

        {/* Cover URL */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">URL da Imagem da Capa *</label>
          <Input placeholder="https://..." {...register('coverUrl')} />
          {errors.coverUrl && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.coverUrl.message}</p>
          )}
        </div>

        {/* Platform & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Status Gamer *</label>
            <Select {...register('status')}>
              {Object.entries(STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Genre & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Gênero Principal *</label>
            <Select {...register('genre')}>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Preço Pago (R$)</label>
            <Input type="number" step="0.01" min="0" {...register('pricePaid')} />
            {errors.pricePaid && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.pricePaid.message}</p>
            )}
          </div>
        </div>

        {/* Hours Played, Progress & Rating */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Horas</label>
            <Input type="number" min="0" {...register('hoursPlayed')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Progresso %</label>
            <Input type="number" min="0" max="100" {...register('progress')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Nota (0-10)</label>
            <Input type="number" step="0.5" min="0" max="10" {...register('rating')} />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Data de Início</label>
            <Input type="date" {...register('startDate')} />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Data de Conclusão</label>
            <Input type="date" {...register('completionDate')} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Observações Pessoais</label>
          <Textarea
            placeholder="O que achou da campanha? Dificuldade, chefes memoráveis, trilha sonora..."
            {...register('notes')}
          />
        </div>

        {/* Would Play Again checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="wouldPlayAgain"
            className="rounded border-zinc-700 bg-zinc-900 text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
            {...register('wouldPlayAgain')}
          />
          <label htmlFor="wouldPlayAgain" className="text-xs text-zinc-300 cursor-pointer select-none">
            Jogaria novamente este game?
          </label>
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
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Jogo' : 'Cadastrar Jogo'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
