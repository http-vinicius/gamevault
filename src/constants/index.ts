import { GameStatus, Priority, Platform } from '../types'

export const STATUS_LABELS: Record<GameStatus, string> = {
  backlog: 'Backlog',
  playing: 'Jogando',
  paused: 'Pausado',
  completed: 'Zerado',
  platinum: 'Platinado',
  dropped: 'Abandonado',
}

export const STATUS_COLORS: Record<GameStatus, { bg: string; text: string; border: string; badge: string }> = {
  playing: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500 text-zinc-950 font-semibold',
  },
  completed: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500 text-white font-semibold',
  },
  platinum: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    badge: 'bg-gradient-to-r from-amber-400 to-amber-200 text-zinc-950 font-bold',
  },
  backlog: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
  },
  paused: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  },
  dropped: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
  },
}

export const PRIORITY_LABELS: Record<Priority, { label: string; icon: string; color: string; badgeClass: string }> = {
  high: {
    label: 'Alta',
    icon: '🔥',
    color: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  medium: {
    label: 'Média',
    icon: '⭐',
    color: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  low: {
    label: 'Baixa',
    icon: '💤',
    color: 'text-zinc-400',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  },
}

export const PLATFORMS: Platform[] = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X',
  'Nintendo Switch',
  'Multiplataforma',
]

export const GENRES = [
  'RPG / JRPG',
  'Ação e Aventura',
  'Mundo Aberto',
  'Soulslike',
  'Tiro / FPS',
  'Terror / Sobrevivência',
  'Estratégia / Tático',
  'Corrida',
  'Plataforma / Metroidvania',
  'Luta',
  'Ficção Científica',
]

export const XP_RULES = {
  ADD_GAME: 10,
  START_GAME: 25,
  COMPLETE_GAME: 500,
  PLATINUM_GAME: 750,
  SAVE_FIFTY_REAIS: 50,
  COMPLETE_MONTHLY_GOAL: 1000,
  BUY_BELOW_TARGET_PRICE: 300,
} as const

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
