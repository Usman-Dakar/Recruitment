import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import SearchForm from '@/components/search/SearchForm'
import SearchResults from '@/components/search/SearchResults'
import FilterDrawer from '@/components/common/FilterDrawer'
import { useSearchStore, defaultSearchParams } from '@/store/searchStore'
import { useJobSearch } from '@/hooks/useJobSearch'
import { jobCategories } from '@/data/jobCategories'

export default function VacancySearchPage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const { setParams } = useSearchStore()
  const { search } = useJobSearch()
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const activeCategoryName = categoryId
    ? jobCategories.find((c) => c.value === Number(categoryId))?.label
    : undefined

  useEffect(() => {
    const init = { ...defaultSearchParams, pageNo: 1 }
    if (categoryId) {
      const id = Number(categoryId)
      if (!isNaN(id) && id > 0) {
        init.jobNatureIds = String(id)
        setParams({ jobNatureIds: String(id), pageNo: 1 })
      }
    }
    search(init)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">
          {activeCategoryName ? `${activeCategoryName} Jobs` : 'Vacancy Search'}
        </h1>
        {activeCategoryName && (
          <p className="text-sm text-slate-400 mt-1">
            Showing positions in{' '}
            <span className="text-brand-400">{activeCategoryName}</span>
          </p>
        )}
      </div>

      <div className="flex gap-7 lg:gap-8">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-20 glass rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Filters
            </p>
            <SearchForm />
          </div>
        </aside>

        {/* ── Main results ── */}
        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium glass rounded-lg hover:border-brand-500/30 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              Show Filters
            </button>
          </div>

          <SearchResults />
        </div>
      </div>

      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </div>
  )
}
