import { Header } from '../../components/Layout/Header'
import { ReleasesHeader } from '../../components/Releases/ReleasesHeader'
import { ReleasesFilters } from '../../components/Releases/ReleasesFilters'
import { ReleasesListView } from '../../components/Releases/ReleasesListView'
import { ReleasesCalendarView } from '../../components/Releases/ReleasesCalendarView'
import { useReleases } from '../../hooks/useReleases'

export function ReleasesPage() {
  const {
    releases,
    isLoading,
    search,
    setSearch,
    platformFilter,
    setPlatformFilter,
    onlyWishlist,
    setOnlyWishlist,
    viewMode,
    setViewMode,
    toggleWishlist,
  } = useReleases()

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Lançamentos no Radar"
        subtitle="Monitore datas oficiais, faça contagens regressivas e marque na sua Wishlist."
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <ReleasesHeader totalCount={releases.length} />

        <ReleasesFilters
          search={search}
          onSearchChange={setSearch}
          selectedPlatform={platformFilter}
          onPlatformChange={setPlatformFilter}
          onlyWishlist={onlyWishlist}
          onOnlyWishlistChange={setOnlyWishlist}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'list' ? (
          <ReleasesListView
            releases={releases}
            isLoading={isLoading}
            onToggleWishlist={toggleWishlist}
          />
        ) : (
          <ReleasesCalendarView
            releases={releases}
            onToggleWishlist={toggleWishlist}
          />
        )}
      </div>
    </div>
  )
}
