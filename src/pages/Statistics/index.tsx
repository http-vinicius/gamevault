import { Header } from '../../components/Layout/Header'
import { StatisticsOverviewCards } from '../../components/Statistics/StatisticsOverviewCards'
import { GamesByStatusChart } from '../../components/Statistics/GamesByStatusChart'
import { GamesByPlatformChart } from '../../components/Statistics/GamesByPlatformChart'
import { SpendingVsSavingsChart } from '../../components/Statistics/SpendingVsSavingsChart'
import { GenreDistributionChart } from '../../components/Statistics/GenreDistributionChart'
import { useStatistics } from '../../hooks/useStatistics'

export function StatisticsPage() {
  const { stats, isLoading } = useStatistics()

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Estatísticas & Métricas" subtitle="Carregando dados..." />
        <div className="p-8 text-center text-zinc-500">Carregando métricas gamers...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Estatísticas Pessoais & Financeiras"
        subtitle="Analise seu tempo de jogo, custo por hora, hábitos de consumo e economia no cofre."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Metric Cards */}
        <StatisticsOverviewCards stats={stats} />

        {/* 2-Column Charts: Status Donut + Platform Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GamesByStatusChart data={stats.gamesByStatus} />
          <GamesByPlatformChart data={stats.gamesByPlatform} />
        </div>

        {/* 2-Column Charts: Spending vs Savings + Genre Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingVsSavingsChart data={stats.monthlySpending} />
          <GenreDistributionChart data={stats.genreDistribution} />
        </div>
      </div>
    </div>
  )
}
