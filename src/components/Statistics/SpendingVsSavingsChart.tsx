import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { formatCurrency } from '../../lib/utils'

interface SpendingVsSavingsChartProps {
  data: { month: string; spent: number; saved: number }[]
}

export function SpendingVsSavingsChart({ data }: SpendingVsSavingsChartProps) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-900/60 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-zinc-100">
          Gastos vs Economia no Cofre
        </CardTitle>
        <p className="text-xs text-zinc-400">Comparativo mensal de compras x valores guardados</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
                tickFormatter={(val) => `R$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f4f4f5',
                }}
                formatter={(val: number) => [formatCurrency(val)]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-zinc-300 font-medium">
                    {value === 'spent' ? 'Gasto em Jogos' : 'Economizado no Cofre'}
                  </span>
                )}
              />
              <Bar dataKey="spent" fill="#f43f5e" name="spent" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saved" fill="#10b981" name="saved" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
