import { useSearchStore } from '@/store/searchStore'
import { useJobSearch } from '@/hooks/useJobSearch'
import JobCard from '@/components/jobs/JobCard'
import Pagination from '@/components/common/Pagination'
import LoadingSpinner from '@/components/layout/LoadingSpinner'

export default function SearchResults() {
  const { results, isLoading, params, setParams } = useSearchStore()
  const { search } = useJobSearch()

  const handlePageChange = async (page: number) => {
    const next = { ...params, pageNo: page }
    setParams({ pageNo: page })
    await search(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) return <LoadingSpinner />

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-700 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Search open positions</p>
        <p className="text-slate-500 dark:text-slate-500 text-sm">Use the filters to find your next opportunity.</p>
      </div>
    )
  }

  if (results.jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-700 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-slate-800 dark:text-slate-200 font-medium mb-1">No positions found</h3>
        <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting or clearing your filters.</p>
      </div>
    )
  }

  return (
    <div id="jobHolder">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        <span className="text-slate-900 dark:text-slate-200 font-semibold">{results.totalRecords}</span>{' '}
        position{results.totalRecords !== 1 ? 's' : ''} found
      </p>

      <div
        className="space-y-3"
        style={{ contentVisibility: 'auto' }}
      >
        {results.jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <Pagination
        currentPage={results.pageNo}
        totalRecords={results.totalRecords}
        pageSize={results.pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
