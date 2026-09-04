import { CalendarDays } from 'lucide-react'

interface ReleasesHeaderProps {
  totalCount: number
}

export function ReleasesHeader({ totalCount }: ReleasesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            Lançamentos Futuros
          </h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {totalCount} no radar
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Acompanhe datas oficiais, contagens regressivas e sincronize diretamente com sua Wishlist.
        </p>
      </div>
    </div>
  )
}
