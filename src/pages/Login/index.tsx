import * as React from 'react'
import { Navigate } from '@tanstack/react-router'
import { Gamepad2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

export function LoginPage() {
  const { isAuthenticated, isLoading, login, register } = useAuth()

  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        toast.success('Bem-vindo de volta ao GameVault!')
      } else {
        await register(name, email, password)
        toast.success('Conta criada! Bem-vindo ao GameVault.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro na autenticação')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0c0e] to-[#09090b] p-4">
      <Card className="w-full max-w-md border-zinc-800/80">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto p-3 rounded-2xl bg-purple-600 glow-purple border border-purple-400/40 w-fit">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            GameVault
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Entre para organizar sua vida gamer.'
              : 'Crie sua conta e comece sua jornada.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Nome</label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">E-mail</label>
              <Input
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Senha</label>
              <Input
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            <Button type="submit" variant="glow" className="w-full gap-2" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-400">
            {mode === 'login' ? (
              <>
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  className="text-purple-400 hover:underline cursor-pointer"
                  onClick={() => setMode('register')}
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button
                  type="button"
                  className="text-purple-400 hover:underline cursor-pointer"
                  onClick={() => setMode('login')}
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
