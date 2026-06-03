import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
    }),
    { name: 'ax-theme' },
  ),
)

/* Call once on app boot to sync the DOM with persisted state */
export function initTheme() {
  const stored = localStorage.getItem('ax-theme')
  const theme: Theme = stored ? (JSON.parse(stored)?.state?.theme ?? 'dark') : 'dark'
  applyTheme(theme)
}
