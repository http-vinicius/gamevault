import { Search, Heart, LayoutList, Calendar as CalendarIcon, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface ReleasesFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  selectedPlatform: string
  onPlatformChange: (platform: string) => void
  onlyWishlist: boolean
  onOnlyWishlistChange: (value: boolean) => void
  viewMode: 'list' | 'calendar'
  onViewModeChange: (mode: 'list' | 'calendar') => void
}

export function ReleasesFilters({
  search,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  onlyWishlist,
  onOnlyWishlistChange,
  viewMode,
  onViewModeChange,
}: ReleasesFiltersProps) {
  const platforms = [
    { key: 'all', label: 'Todos' },
    { key: 'PC', label: 'PC' },
    { key: 'PlayStation', label: 'PlayStation' },
    { key: 'Xbox', label: 'Xbox' },
    { key: 'Nintendo', label: 'Nintendo' },
  ]

  return (
    <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por jogo ou gênero..."
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

        {/* View Mode Toggle: Lista vs Calendario */}
        <div className="flex items-center bg-zinc-950/80 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-violet-600 text-white shadow font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-violet-600 text-white shadow font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendário</span>
          </button>
        </div>
      </div>

      {/* Platform & Wishlist Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Platforms */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {platforms.map((p) => {
            const isActive = selectedPlatform === p.key
            return (
              <button
                key={p.key}
                onClick={() => onPlatformChange(p.key)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow font-semibold'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Only Wishlist toggle */}
        <button
          onClick={() => onOnlyWishlistChange(!onlyWishlist)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            onlyWishlist
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm'
              : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-rose-400 text-rose-400' : 'text-zinc-400'}`} />
          <span>Somente Wishlist</span>
        </button>
      </div>
    </div>
  )
}
