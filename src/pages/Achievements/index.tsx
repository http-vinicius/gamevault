import { Header } from '../../components/Layout/Header'
import { GamificationProfileCard } from '../../components/Achievements/GamificationProfileCard'
import { AchievementsList } from '../../components/Achievements/AchievementsList'
import { useAchievements } from '../../hooks/useAchievements'

export function AchievementsPage() {
  const { achievements, profile, unlockedCount, totalCount, isLoading } = useAchievements()

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Conquistas & Evolução"
        subtitle="Ganhe XP organizando sua rotina gamer, zerando jogos e batendo metas financeiras."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <GamificationProfileCard
          profile={profile}
          unlockedCount={unlockedCount}
          totalCount={totalCount}
        />

        <AchievementsList achievements={achievements} />
      </div>
    </div>
  )
}
