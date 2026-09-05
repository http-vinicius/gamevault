import * as React from 'react'
import { Navigate, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { useAuth } from '../../contexts/AuthContext'

export function AppLayout() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-400">
        Carregando GameVault...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col lg:flex-row antialiased font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0 bg-gradient-to-br from-[#0c0c0e] to-[#09090b]">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Toaster notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          className: '!bg-zinc-900 !border-zinc-800 !text-zinc-100',
        }}
      />
    </div>
  )
}
