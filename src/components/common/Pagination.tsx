import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalRecords: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalRecords / pageSize)
  if (totalPages <= 1) return null

  const buildPages = (): (number | null)[] => {
    const pages: (number | null)[] = []
    const window = 5
    let start = Math.max(1, currentPage - Math.floor(window / 2))
    const end = Math.min(totalPages, start + window - 1)
    if (end - start < window - 1) start = Math.max(1, end - window + 1)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push(null)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(null)
      pages.push(totalPages)
    }
    return pages
  }

  const btnBase =
    'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={cn(btnBase, 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {buildPages().map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} className="px-1 text-slate-600 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              btnBase,
              page === currentPage
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5',
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={cn(btnBase, 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed')}
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
