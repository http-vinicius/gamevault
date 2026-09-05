import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

// Anexa o token CSRF (lido do cookie) em requisições que mudam estado.
httpClient.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase()
  if (method !== 'get' && method !== 'head' && method !== 'options') {
    const csrf = getCookie('gv_csrf')
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf
    }
  }
  return config
})

// Tratamento centralizado de erro + notificação de sessão expirada.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || 'Erro na requisição'

    if (status === 401) {
      window.dispatchEvent(new Event('gamevault:unauthorized'))
    }

    return Promise.reject(new Error(message))
  },
)
