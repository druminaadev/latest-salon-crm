import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as 'light' | 'dark',
      
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
        }
        return { theme: newTheme }
      }),
      
      setTheme: (theme) => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
        set({ theme })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
