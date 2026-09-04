import { z } from 'zod'

export const gameStatusSchema = z.enum([
  'backlog',
  'playing',
  'paused',
  'completed',
  'platinum',
  'dropped',
])

export const platformSchema = z.enum([
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X',
  'Nintendo Switch',
  'Multiplataforma',
])

export const prioritySchema = z.enum(['high', 'medium', 'low'])

export const libraryGameSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  coverUrl: z.string().url('Insira uma URL de imagem válida').or(z.string().min(1, 'Capa é obrigatória')),
  platform: platformSchema,
  status: gameStatusSchema,
  genre: z.string().min(1, 'Gênero é obrigatório'),
  hoursPlayed: z.coerce.number().min(0, 'Horas jogadas não podem ser negativas'),
  progress: z.coerce.number().min(0).max(100, 'Progresso deve ser entre 0% e 100%'),
  rating: z.coerce.number().min(0).max(10, 'Nota deve ser entre 0 e 10'),
  pricePaid: z.coerce.number().min(0, 'Preço não pode ser negativo'),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  notes: z.string().optional(),
  wouldPlayAgain: z.boolean().default(false),
})

export type LibraryGameFormData = z.infer<typeof libraryGameSchema>

export const wishlistGameSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  coverUrl: z.string().url('Insira uma URL de imagem válida').or(z.string().min(1, 'Capa é obrigatória')),
  platform: platformSchema,
  genre: z.string().min(1, 'Gênero é obrigatório'),
  priority: prioritySchema,
  currentPrice: z.coerce.number().min(0, 'Preço atual deve ser maior ou igual a zero'),
  targetPrice: z.coerce.number().min(0, 'Preço desejado deve ser maior ou igual a zero'),
  reservedAmount: z.coerce.number().min(0, 'Valor reservado deve ser maior ou igual a zero').default(0),
  releaseDate: z.string().min(1, 'Data de lançamento é obrigatória'),
  notes: z.string().optional(),
})

export type WishlistGameFormData = z.infer<typeof wishlistGameSchema>

export const depositVaultSchema = z.object({
  amount: z.coerce.number().positive('O valor deve ser maior que zero'),
  destination: z.enum(['free', 'game', 'monthly_goal']),
  gameId: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
})

export type DepositVaultFormData = z.infer<typeof depositVaultSchema>

export const monthlyGoalSchema = z.object({
  targetAmount: z.coerce.number().positive('A meta deve ser maior que zero'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2035),
})

export type MonthlyGoalFormData = z.infer<typeof monthlyGoalSchema>
