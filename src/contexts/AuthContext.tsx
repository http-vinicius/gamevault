import * as React from 'react'
import {
  AuthUser,
  getMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '../services/http/auth'
import { UserProfile } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const applyAuth = React.useCallback((data: { user: AuthUser; profile: UserProfile }) => {
    setUser(data.user)
    setProfile(data.profile)
  }, [])

  React.useEffect(() => {
    let active = true

    getMe()
      .then((data) => {
        if (active) applyAuth(data)
      })
      .catch(() => {
        if (active) {
          setUser(null)
          setProfile(null)
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    const onUnauthorized = () => {
      setUser(null)
      setProfile(null)
    }
    window.addEventListener('gamevault:unauthorized', onUnauthorized)

    return () => {
      active = false
      window.removeEventListener('gamevault:unauthorized', onUnauthorized)
    }
  }, [applyAuth])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin({ email, password })
      applyAuth(data)
    },
    [applyAuth],
  )

  const register = React.useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiRegister({ name, email, password })
      applyAuth(data)
    },
    [applyAuth],
  )

  const logout = React.useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
      setProfile(null)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, profile, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return ctx
}
