import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: user !== null && user.luid > 0 }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'ax-auth' },
  ),
)
