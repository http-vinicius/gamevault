import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppLayout } from '../components/Layout/AppLayout'
import { DashboardPage } from '../pages/Dashboard'
import { LibraryPage } from '../pages/Library'
import { WishlistPage } from '../pages/Wishlist'
import { ReleasesPage } from '../pages/Releases'
import { VaultPage } from '../pages/Vault'
import { AchievementsPage } from '../pages/Achievements'
import { StatisticsPage } from '../pages/Statistics'

const rootRoute = createRootRoute({
  component: AppLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library',
  component: LibraryPage,
})

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: WishlistPage,
})

const releasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/releases',
  component: ReleasesPage,
})

const vaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vault',
  component: VaultPage,
})

const achievementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/achievements',
  component: AchievementsPage,
})

const statisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/statistics',
  component: StatisticsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  libraryRoute,
  wishlistRoute,
  releasesRoute,
  vaultRoute,
  achievementsRoute,
  statisticsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
