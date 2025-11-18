import apiClient from './client'
import { format } from 'date-fns'

export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  description?: string
  created_at: string
}

export interface Income {
  id: number
  amount: number
  description?: string
  category_id: number
  date: string
  payment_method?: string
  reference?: string
  notes?: string
  created_at: string
  updated_at: string
  category: Category
}

export interface Expense {
  id: number
  amount: number
  description?: string
  category_id: number
  date: string
  payment_method?: string
  reference?: string
  vendor?: string
  notes?: string
  created_at: string
  updated_at: string
  category: Category
}

export interface DashboardStats {
  total_income: number
  total_expense: number
  net_profit: number
  income_count: number
  expense_count: number
  income_by_category: Record<string, number>
  expense_by_category: Record<string, number>
  income_by_month: Record<string, number>
  expense_by_month: Record<string, number>
}

// Categories API
export const categoriesApi = {
  getAll: (type?: 'income' | 'expense') => 
    apiClient.get<Category[]>('/api/categories', { params: { type } }),
  getById: (id: number) => 
    apiClient.get<Category>(`/api/categories/${id}`),
  create: (data: { name: string; type: 'income' | 'expense'; description?: string }) =>
    apiClient.post<Category>('/api/categories', data),
  delete: (id: number) =>
    apiClient.delete(`/api/categories/${id}`),
}

// Income API
export const incomeApi = {
  getAll: (params?: { start_date?: string; end_date?: string; category_id?: number }) =>
    apiClient.get<Income[]>('/api/income', { params }),
  getById: (id: number) =>
    apiClient.get<Income>(`/api/income/${id}`),
  create: (data: Omit<Income, 'id' | 'created_at' | 'updated_at' | 'category'>) =>
    apiClient.post<Income>('/api/income', data),
  update: (id: number, data: Partial<Income>) =>
    apiClient.put<Income>(`/api/income/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/income/${id}`),
  getSummary: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/api/income/stats/summary', { params }),
}

// Expense API
export const expenseApi = {
  getAll: (params?: { start_date?: string; end_date?: string; category_id?: number }) =>
    apiClient.get<Expense[]>('/api/expense', { params }),
  getById: (id: number) =>
    apiClient.get<Expense>(`/api/expense/${id}`),
  create: (data: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'category'>) =>
    apiClient.post<Expense>('/api/expense', data),
  update: (id: number, data: Partial<Expense>) =>
    apiClient.put<Expense>(`/api/expense/${id}`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/expense/${id}`),
  getSummary: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/api/expense/stats/summary', { params }),
}

// Dashboard API
export const dashboardApi = {
  getStats: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get<DashboardStats>('/api/dashboard/stats', { params }),
  getRecentTransactions: (limit?: number) =>
    apiClient.get('/api/dashboard/recent-transactions', { params: { limit } }),
}

// Exchange Rate API
export interface ExchangeRate {
  thb_to_usd: number
  usd_to_thb: number
  last_updated: string
  base_currency: string
  target_currency: string
}

export const exchangeApi = {
  getRate: () => apiClient.get<ExchangeRate>('/api/exchange/rate'),
  convert: (amount: number, from: string, to: string) =>
    apiClient.get('/api/exchange/convert', {
      params: { amount, from_currency: from, to_currency: to },
    }),
}

// Helper function to format date for API
export const formatDateForAPI = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}

