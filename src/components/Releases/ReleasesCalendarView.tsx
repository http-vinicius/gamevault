import * as React from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ReleaseGame } from '../../types'
import { getCountdownText } from '../../utils/formatters'

interface ReleasesCalendarViewProps {
  releases: ReleaseGame[]
  onToggleWishlist: (id: string) => void
}

export function ReleasesCalendarView({ releases, onToggleWishlist }: ReleasesCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date(2026, 9, 1)) // Default to October 2026 where releases are scheduled
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date(2026, 9, 2))

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  // Games on selected day
  const selectedDayReleases = releases.filter((r) => {
    try {
      return isSameDay(parseISO(r.releaseDate), selectedDay)
    } catch {
      return false
    }
  })

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80">
        <div>
          <h3 className="text-lg font-black text-zinc-100 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <p className="text-xs text-zinc-400">Clique em um dia marcado para inspecionar os lançamentos</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date(2026, 9, 1)
              setCurrentMonth(now)
              setSelectedDay(now)
            }}
            className="text-xs"
          >
            Mês Atual
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-400 py-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((d, index) => {
          const isSelected = isSameDay(d, selectedDay)
          const isCurrentMonthDay = isSameMonth(d, monthStart)

          const releasesOnThisDay = releases.filter((r) => {
            try {
              return isSameDay(parseISO(r.releaseDate), d)
            } catch {
              return false
            }
          })

          const hasReleases = releasesOnThisDay.length > 0

          return (
            <div
              key={index}
              onClick={() => setSelectedDay(d)}
              className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-violet-500 bg-violet-950/30 ring-1 ring-violet-500'
                  : hasReleases
                  ? 'border-indigo-500/40 bg-zinc-900/90 hover:border-indigo-400'
                  : isCurrentMonthDay
                  ? 'border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-800/40'
                  : 'border-zinc-900/30 bg-zinc-950/20 text-zinc-600 opacity-40'
              }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-violet-300 font-bold'
                      : isCurrentMonthDay
                      ? 'text-zinc-300'
                      : 'text-zinc-600'
                  }`}
                >
                  {format(d, 'd')}
                </span>

                {hasReleases && (
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
                )}
              </div>

              {/* Game badges inside day box */}
              {hasReleases && (
                <div className="space-y-1 mt-1">
                  {releasesOnThisDay.slice(0, 2).map((rel) => (
                    <div
                      key={rel.id}
                      className="text-[10px] truncate rounded px-1 py-0.5 bg-violet-500/20 text-violet-300 font-medium border border-violet-500/30"
                      title={rel.title}
                    >
                      {rel.title}
                    </div>
                  ))}
                  {releasesOnThisDay.length > 2 && (
                    <div className="text-[9px] text-zinc-400 pl-1">
                      +{releasesOnThisDay.length - 2} outros
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Day Game Details */}
      <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/90 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-violet-400" />
          <h4 className="text-sm font-bold text-zinc-100">
            Lançamentos em {format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h4>
        </div>

        {selectedDayReleases.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">
            Nenhum lançamento no radar cadastrado para esta data selecionada.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDayReleases.map((game) => {
              const countdown = getCountdownText(game.releaseDate)

              return (
                <div
                  key={game.id}
                  className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-12 h-14 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-zinc-200 truncate">{game.title}</h5>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {game.genre} • {game.developer}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px] py-0 px-1.5">
                        {countdown.label}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={game.inWishlist ? 'secondary' : 'outline'}
                    onClick={() => onToggleWishlist(game.id)}
                    className="h-8 px-2 text-xs flex-shrink-0"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        game.inWishlist ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                      }`}
                    />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
