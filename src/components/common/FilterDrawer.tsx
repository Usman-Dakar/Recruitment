import { X } from 'lucide-react'
import SearchForm from '@/components/search/SearchForm'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onReset?: () => void
}

export default function FilterDrawer({ isOpen, onClose, onReset }: FilterDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed left-0 top-0 h-full w-80 z-50 bg-surface-800 border-r border-white/5 overflow-y-auto animate-slide-in-left"
        aria-label="Job search filters"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5 sticky top-0 bg-surface-800 z-10">
          <h2 className="font-semibold text-slate-100">Filter Jobs</h2>
          <button
            type="button"
            aria-label="Close filter panel"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 touch-target"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">
          <SearchForm
            onSearch={onClose}
            onReset={() => {
              onReset?.()
              onClose()
            }}
          />
        </div>
      </aside>
    </>
  )
}
