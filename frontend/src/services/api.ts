import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface AuthResponse {
  token: string
  email: string
  name: string
  userId: number
}

export interface Expense {
  id?: number
  date: string
  description: string
  categoryId: number
  amount: number
  paymentMethod?: string
  barcode?: string
  recurring?: boolean
  observations?: string
}

export interface Category {
  id?: number
  name: string
  monthlyLimit?: number
  color?: string
  icon?: string
}

export interface FinancialProjection {
  id?: number
  initialValue: number
  monthlyContribution: number
  interestRate: number
  period: number
  futureValue?: number
}

export interface DashboardData {
  totalMesAtual: number
  totalMesAnterior: number
  percentualVariacao: number
  gastosPorCategoria: Array<{ categoria: string; total: number }>
  gastosPorPeriodo: Array<{ data: string; total: number }>
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  },
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password })
    return response.data
  },
}

export const expenseService = {
  getAll: async (filters?: any) => {
    const response = await api.get('/expenses', { params: filters })
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/expenses/${id}`)
    return response.data
  },
  create: async (expense: Expense) => {
    const response = await api.post('/expenses', expense)
    return response.data
  },
  update: async (id: number, expense: Expense) => {
    const response = await api.put(`/expenses/${id}`, expense)
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/expenses/${id}`)
  },
  getTotal: async (filters?: any) => {
    const response = await api.get('/expenses/total', { params: filters })
    return response.data
  },
}

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
  create: async (category: Category) => {
    const response = await api.post('/categories', category)
    return response.data
  },
  update: async (id: number, category: Category) => {
    const response = await api.put(`/categories/${id}`, category)
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/categories/${id}`)
  },
}

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/dashboard')
    return response.data
  },
}

export const projectionService = {
  getAll: async () => {
    const response = await api.get('/projections')
    return response.data
  },
  getById: async (id: number) => {
    const response = await api.get(`/projections/${id}`)
    return response.data
  },
  create: async (projection: FinancialProjection) => {
    const response = await api.post('/projections', projection)
    return response.data
  },
  delete: async (id: number) => {
    await api.delete(`/projections/${id}`)
  },
  calculate: async (projection: FinancialProjection) => {
    const response = await api.post('/projections/calculate', projection)
    return response.data
  },
}

