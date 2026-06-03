import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalShellProps {
  isOpen: boolean
  title: string
  labelId: string
  maxWidth?: string
  headerClass?: string
  panelClass?: string
  onClose: () => void
  children: React.ReactNode
}

export default function ModalShell({
  isOpen,
  title,
  labelId,
  maxWidth = 'max-w-sm',
  headerClass,
  panelClass,
  onClose,
  children,
}: ModalShellProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('relative glass rounded-xl w-full shadow-2xl', maxWidth, panelClass)}>
        <div
          className={cn(
            'flex items-center justify-between px-5 py-4 border-b border-white/5',
            headerClass,
          )}
        >
          <h2 id={labelId} className="font-semibold text-slate-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
