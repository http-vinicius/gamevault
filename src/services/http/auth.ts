import { httpClient } from './httpClient'
import { UserProfile } from '../../types'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

export interface AuthResponse {
  user: AuthUser
  profile: UserProfile
}

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/register', data)
  return res.data
}

export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/login', data)
  return res.data
}

export async function logout(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function getMe(): Promise<AuthResponse> {
  const res = await httpClient.get('/auth/me')
  return res.data
}
