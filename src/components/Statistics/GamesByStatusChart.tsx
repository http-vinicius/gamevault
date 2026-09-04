import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { STATUS_LABELS } from '../../constants'

interface GamesByStatusChartProps {
  data: { status: string; count: number }[]
}

const STATUS_COLOR_MAP: Record<string, string> = {
  playing: '#10b981', // emerald
  completed: '#6366f1', // indigo
  platinum: '#f59e0b', // amber
  backlog: '#8b5cf6', // violet
  paused: '#3b82f6', // blue
  dropped: '#ef4444', // red
}

export function GamesByStatusChart({ data }: GamesByStatusChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    rawStatus: d.status,
  }))

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/60 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-zinc-100">Distribuição por Status</CardTitle>
        <p className="text-xs text-zinc-400">Proporção dos jogos na sua biblioteca</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center min-h-[280px]">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
              <Legend
                formatter={(value) => <span className="text-xs text-zinc-300 font-medium">{value}</span>}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLOR_MAP[entry.rawStatus] || '#8b5cf6'}
                    stroke="#18181b"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
