import { Search, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { PRIORITY_LABELS } from '../../constants'
import { Priority } from '../../types'

interface WishlistFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedPriority: string
  onPriorityChange: (priority: string) => void
  sortBy: string
  onSortByChange: (sort: any) => void
}

export function WishlistFilters({
  search,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortByChange,
}: WishlistFiltersProps) {
  const priorities: { key: string; label: string; icon?: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'high', label: 'Alta', icon: '🔥' },
    { key: 'medium', label: 'Média', icon: '⭐' },
    { key: 'low', label: 'Baixa', icon: '💤' },
  ]

  return (
    <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por título ou gênero..."
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

        {/* Sort By */}
        <div className="w-full sm:w-56">
          <Select value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
            <option value="priority">Maior Prioridade</option>
            <option value="progress">Mais Perto do Alvo (%)</option>
            <option value="price">Menor Preço</option>
            <option value="date">Data de Lançamento</option>
          </Select>
        </div>
      </div>

      {/* Priority Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {priorities.map((p) => {
          const isActive = selectedPriority === p.key
          return (
            <button
              key={p.key}
              onClick={() => onPriorityChange(p.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {p.icon && <span>{p.icon}</span>}
              <span>{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
