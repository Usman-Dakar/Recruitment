import { create } from 'zustand'
import type { SearchParams, SearchResult } from '@/types'

export const defaultSearchParams: SearchParams = {
  jobTypeId: 0,
  occupationId: 0,
  pageNo: 1,
  experienceLevelId: 0,
  educationLevelId: 0,
  bussinessSectorIds: '',
  jobNatureIds: '',
  employmentTypeId: 0,
  jobCallTypeId: 0,
  departmentId: 0,
  freeText: '',
}

interface SearchStore {
  params: SearchParams
  results: SearchResult | null
  isLoading: boolean
  setParams: (updates: Partial<SearchParams>) => void
  resetParams: () => void
  setResults: (results: SearchResult) => void
  setLoading: (loading: boolean) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  params: defaultSearchParams,
  results: null,
  isLoading: false,
  setParams: (updates) =>
    set((state) => ({ params: { ...state.params, ...updates } })),
  resetParams: () =>
    set({ params: defaultSearchParams, results: null }),
  setResults: (results) => set({ results }),
  setLoading: (isLoading) => set({ isLoading }),
}))
