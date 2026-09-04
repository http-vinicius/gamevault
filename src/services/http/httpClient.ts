import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || ''

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor for auth token (ready for production backend)
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gamevault_auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for centralized error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Erro na requisição'
    return Promise.reject(new Error(message))
  },
)

// Helper to simulate realistic network delay for mock endpoints
export function simulateNetworkDelay<T>(data: T, delayMs: number = 180): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delayMs)
  })
}
