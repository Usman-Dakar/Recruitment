import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DropdownOption } from '@/types'

interface TagSelectProps {
  id: string
  label: string
  options: DropdownOption[]
  selectedItems: DropdownOption[]
  atMax: boolean
  onAdd: (item: DropdownOption) => void
  onRemove: (value: number) => void
}

export default function TagSelect({
  id,
  label,
  options,
  selectedItems,
  atMax,
  onAdd,
  onRemove,
}: TagSelectProps) {
  const [selectValue, setSelectValue] = useState('0')

  const handleAdd = () => {
    const val = Number(selectValue)
    if (val === 0) return
    const option = options.find((o) => o.value === val)
    if (option) {
      onAdd(option)
      setSelectValue('0')
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex gap-2">
        <select
          id={id}
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 bg-white dark:bg-surface-700 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={`Select ${label}`}
          autoComplete="off"
        >
          <option value="0">Select {label}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${label} filter`}
          disabled={atMax}
          className={cn(
            'shrink-0 w-10 rounded-lg flex items-center justify-center transition-colors touch-target',
            atMax
              ? 'bg-slate-100 dark:bg-surface-700 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-white/5'
              : 'bg-brand-500 text-white hover:bg-brand-400',
          )}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {selectedItems.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-500/15 border border-brand-500/25 text-brand-700 dark:text-brand-300 text-xs rounded-full"
            >
              <span className="min-w-0 truncate max-w-[110px]">{item.label}</span>
              <button
                type="button"
                aria-label={`Remove ${item.label}`}
                onClick={() => onRemove(item.value)}
                className="text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-white transition-colors touch-target flex items-center"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}

      {atMax && (
        <p className="text-xs text-amber-400/80">Maximum 5 selections reached.</p>
      )}
    </div>
  )
}
