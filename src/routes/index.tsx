import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppLayout } from '../components/Layout/AppLayout'
import { LoginPage } from '../pages/Login'
import { DashboardPage } from '../pages/Dashboard'
import { LibraryPage } from '../pages/Library'
import { WishlistPage } from '../pages/Wishlist'
import { ReleasesPage } from '../pages/Releases'
import { VaultPage } from '../pages/Vault'
import { AchievementsPage } from '../pages/Achievements'
import { StatisticsPage } from '../pages/Statistics'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: DashboardPage,
})

const libraryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/library',
  component: LibraryPage,
})

const wishlistRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/wishlist',
  component: WishlistPage,
})

const releasesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/releases',
  component: ReleasesPage,
})

const vaultRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/vault',
  component: VaultPage,
})

const achievementsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/achievements',
  component: AchievementsPage,
})

const statisticsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/statistics',
  component: StatisticsPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([
    indexRoute,
    libraryRoute,
    wishlistRoute,
    releasesRoute,
    vaultRoute,
    achievementsRoute,
    statisticsRoute,
  ]),
  loginRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
