import { StatisticsData, DashboardSummary } from '../../types'
import { httpClient } from './httpClient'

export async function getStatistics(): Promise<StatisticsData> {
  const res = await httpClient.get('/statistics')
  return res.data
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await httpClient.get('/dashboard')
  return res.data
}
