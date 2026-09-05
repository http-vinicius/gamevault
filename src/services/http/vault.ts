import { VaultData, MonthlyGoal } from '../../types'
import { httpClient } from './httpClient'

export async function getVaultData(): Promise<VaultData> {
  const res = await httpClient.get('/vault')
  return res.data
}

export async function depositFunds(payload: {
  amount: number
  destination: 'free' | 'game' | 'monthly_goal'
  gameId?: string
  description?: string
}): Promise<VaultData> {
  const res = await httpClient.post('/vault/deposit', payload)
  return res.data
}

export async function updateMonthlyGoal(goalData: {
  targetAmount: number
  month: number
  year: number
}): Promise<MonthlyGoal> {
  const res = await httpClient.put('/vault/goal', goalData)
  return res.data
}
