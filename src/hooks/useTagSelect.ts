import { useState, useCallback } from 'react'
import type { DropdownOption } from '@/types'

const MAX_TAGS = 5

interface UseTagSelectReturn {
  selectedItems: DropdownOption[]
  selectedIds: number[]
  idsString: string
  addItem: (item: DropdownOption) => void
  removeItem: (value: number) => void
  reset: () => void
  atMax: boolean
}

export function useTagSelect(): UseTagSelectReturn {
  const [selectedItems, setSelectedItems] = useState<DropdownOption[]>([])

  const addItem = useCallback((item: DropdownOption) => {
    setSelectedItems((prev) => {
      if (prev.length >= MAX_TAGS) return prev
      if (prev.some((i) => i.value === item.value)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((value: number) => {
    setSelectedItems((prev) => prev.filter((i) => i.value !== value))
  }, [])

  const reset = useCallback(() => setSelectedItems([]), [])

  const selectedIds = selectedItems.map((i) => i.value)

  return {
    selectedItems,
    selectedIds,
    idsString: selectedIds.join(','),
    addItem,
    removeItem,
    reset,
    atMax: selectedItems.length >= MAX_TAGS,
  }
}
