import { format, parseISO, differenceInDays, isPast, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Não informada'
  try {
    const date = typeof dateString === 'string' && dateString.includes('T') ? parseISO(dateString) : new Date(dateString)
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return dateString
  }
}

export const formatLongDate = formatDate


export function formatShortDate(dateString?: string): string {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' && dateString.includes('T') ? parseISO(dateString) : new Date(dateString)
    return format(date, 'dd/MM/yyyy')
  } catch {
    return dateString
  }
}

export function getCountdownText(releaseDateString: string): { label: string; daysLeft: number; isReleased: boolean } {
  try {
    const date = new Date(releaseDateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    if (isToday(date)) {
      return { label: 'Lança Hoje! 🔥', daysLeft: 0, isReleased: true }
    }

    if (isPast(date)) {
      return { label: 'Já lançado', daysLeft: 0, isReleased: true }
    }

    const days = differenceInDays(date, today)
    if (days === 1) {
      return { label: 'Lança amanhã!', daysLeft: 1, isReleased: false }
    }
    return { label: `Faltam ${days} dias`, daysLeft: days, isReleased: false }
  } catch {
    return { label: 'Em breve', daysLeft: 999, isReleased: false }
  }
}

export function calculatePercentage(current: number, target: number): number {
  if (!target || target <= 0) return 0
  const pct = Math.round((current / target) * 100)
  return Math.min(Math.max(pct, 0), 100)
}
