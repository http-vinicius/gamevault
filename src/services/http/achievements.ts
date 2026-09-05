import { Achievement, UserProfile } from '../../types'
import { httpClient } from './httpClient'

export async function getAchievements(): Promise<Achievement[]> {
  const res = await httpClient.get('/achievements')
  return res.data
}

export async function getUserProfile(): Promise<UserProfile> {
  const res = await httpClient.get('/profile')
  return res.data
}

export async function addManualXp(amount: number): Promise<UserProfile> {
  const res = await httpClient.post('/profile/xp', { amount })
  return res.data
}
