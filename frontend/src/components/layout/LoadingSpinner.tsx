interface LoadingSpinnerProps {
  fullPage?: boolean
  label?: string
}

export default function LoadingSpinner({
  fullPage = false,
  label = 'Loading…',
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] bg-surface-950/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">{label}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16" aria-label={label}>
      <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  )
}
