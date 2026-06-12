import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, LoginCredentials } from '@/types'

const MOCK_USER: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@hairahmedabad.com',
  phone: '+91 98765 00000',
  role: 'admin',
  createdAt: new Date().toISOString(),
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        await new Promise(r => setTimeout(r, 600))
        if (
          credentials.email === 'admin@hairahmedabad.com' &&
          credentials.password === 'Admin@123'
        ) {
          set({ user: MOCK_USER, token: 'mock-token', isAuthenticated: true, isLoading: false })
        } else {
          set({ error: 'Invalid email or password', isLoading: false })
          throw new Error('Invalid credentials')
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateProfile: async (data: Partial<User>) => {
        set(state => ({ user: state.user ? { ...state.user, ...data } : null }))
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
