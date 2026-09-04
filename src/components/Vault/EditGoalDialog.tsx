import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Target } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { monthlyGoalSchema, MonthlyGoalFormData } from '../../schemas'
import { MonthlyGoal } from '../../types'
import { MONTH_NAMES } from '../../constants'

interface EditGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGoal?: MonthlyGoal
  onSubmitGoal: (data: MonthlyGoalFormData) => Promise<void>
}

export function EditGoalDialog({
  open,
  onOpenChange,
  currentGoal,
  onSubmitGoal,
}: EditGoalDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MonthlyGoalFormData>({
    resolver: zodResolver(monthlyGoalSchema) as any,
    defaultValues: {
      targetAmount: currentGoal?.targetAmount || 300,
      month: currentGoal?.month || 9,
      year: currentGoal?.year || 2026,
    },
  })

  React.useEffect(() => {
    if (open && currentGoal) {
      reset({
        targetAmount: currentGoal.targetAmount,
        month: currentGoal.month,
        year: currentGoal.year,
      })
    }
  }, [open, currentGoal, reset])

  const onSubmit = async (values: MonthlyGoalFormData) => {
    try {
      await onSubmitGoal(values)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Ajustar Meta Mensal de Economia
        </DialogTitle>
        <DialogDescription>
          Defina o valor alvo que você deseja poupar este mês para acumular XP e bater seus objetivos.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Mês da Meta</label>
          <Select {...register('month')}>
            {MONTH_NAMES.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Ano</label>
          <Input type="number" min="2024" max="2030" {...register('year')} />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1">Valor Alvo da Meta (R$) *</label>
          <Input
            type="number"
            step="10"
            min="10"
            className="text-lg font-mono font-bold"
            {...register('targetAmount')}
          />
          {errors.targetAmount && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.targetAmount.message}</p>
          )}
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
            {isSubmitting ? 'Salvando...' : 'Salvar Nova Meta'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
