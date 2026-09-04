import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface GenreDistributionChartProps {
  data: { genre: string; count: number }[]
}

export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  // Sort descending
  const sorted = [...data].sort((a, b) => b.count - a.count)

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/60 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-zinc-100">Distribuição por Gênero</CardTitle>
        <p className="text-xs text-zinc-400">Seus estilos e gêneros favoritos</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="genre"
                tick={{ fill: '#d4d4d8', fontSize: 11 }}
                axisLine={{ stroke: '#27272a' }}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f4f4f5',
                }}
                formatter={(val: number) => [`${val} jogos`, 'Quantidade']}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
