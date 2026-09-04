import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { PLATFORMS, STATUS_LABELS } from '../../constants'
import { GameStatus } from '../../types'

interface LibraryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  selectedPlatform: string
  onPlatformChange: (platform: string) => void
  sortBy: string
  onSortByChange: (sort: any) => void
  countsByStatus?: Record<string, number>
}

export function LibraryFilters({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortByChange,
  countsByStatus,
}: LibraryFiltersProps) {
  const statusOptions: { key: string; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'playing', label: STATUS_LABELS.playing },
    { key: 'completed', label: STATUS_LABELS.completed },
    { key: 'platinum', label: STATUS_LABELS.platinum },
    { key: 'backlog', label: STATUS_LABELS.backlog },
    { key: 'paused', label: STATUS_LABELS.paused },
    { key: 'dropped', label: STATUS_LABELS.dropped },
  ]

  return (
    <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
      {/* Search and Dropdowns Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por título, gênero ou notas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Platform Filter */}
        <div className="w-full sm:w-48">
          <Select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value)}
          >
            <option value="all">Todas Plataformas</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort By */}
        <div className="w-full sm:w-48">
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="recent">Mais Recentes</option>
            <option value="rating">Maior Nota</option>
            <option value="hours">Mais Horas</option>
            <option value="progress">Maior Progresso</option>
            <option value="title">Ordem Alfabética</option>
          </Select>
        </div>
      </div>

      {/* Status Pill Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {statusOptions.map((st) => {
          const isActive = selectedStatus === st.key
          const count = countsByStatus ? countsByStatus[st.key] : undefined

          return (
            <button
              key={st.key}
              onClick={() => onStatusChange(st.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30 font-semibold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{st.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-700/60 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
