import { Header } from '../../components/Layout/Header'
import { DashboardStatsCards } from '../../components/Dashboard/DashboardStatsCards'
import { XpMissionCard } from '../../components/Dashboard/XpMissionCard'
import { CurrentlyPlayingList } from '../../components/Dashboard/CurrentlyPlayingList'
import { UpcomingReleasesWidget } from '../../components/Dashboard/UpcomingReleasesWidget'
import { useDashboard } from '../../hooks/useDashboard'

export function DashboardPage() {
  const {
    completedCount,
    wishlistCount,
    playingCount,
    vaultBalance,
    currentlyPlayingGames,
    upcomingReleases,
    profile,
    monthlyGoal,
    latestAchievement,
  } = useDashboard()

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Dashboard Gamer"
        subtitle="Bem-vindo ao GameVault: gerencie seu tempo, sua grana e sua evolução gamer."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top 4 Stat Cards */}
        <DashboardStatsCards
          completedCount={completedCount}
          wishlistCount={wishlistCount}
          playingCount={playingCount}
          vaultBalance={vaultBalance}
        />

        {/* Gamification & Monthly Mission Hero */}
        <XpMissionCard
          profile={profile}
          monthlyGoal={monthlyGoal}
          latestAchievement={latestAchievement}
        />

        {/* 2-Column Section: Currently Playing + Upcoming Releases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentlyPlayingList games={currentlyPlayingGames} />
          <UpcomingReleasesWidget releases={upcomingReleases} />
        </div>
      </div>
    </div>
  )
}
