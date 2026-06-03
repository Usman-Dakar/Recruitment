import { useTransition } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import DepartmentSelect from './DepartmentSelect'
import TagSelect from './TagSelect'
import { useTagSelect } from '@/hooks/useTagSelect'
import { useJobSearch } from '@/hooks/useJobSearch'
import { useSearchStore } from '@/store/searchStore'
import { experienceLevels } from '@/data/experienceLevels'
import { educationLevels } from '@/data/educationLevels'
import { employmentTypes } from '@/data/employmentTypes'
import { industries } from '@/data/industries'
import { jobCategories } from '@/data/jobCategories'

const selectClass =
  'w-full px-3 py-2.5 bg-surface-700 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
const labelClass =
  'block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5'

interface SearchFormProps {
  onSearch?: () => void
  onReset?: () => void
}

export default function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const { params, setParams, resetParams } = useSearchStore()
  const { search } = useJobSearch()
  const [isPending, startTransition] = useTransition()

  const industrySelect = useTagSelect()
  const categorySelect = useTagSelect()

  const handleSearch = () => {
    const searchParams = {
      ...params,
      bussinessSectorIds: industrySelect.idsString,
      jobNatureIds: categorySelect.idsString,
      pageNo: 1,
    }
    setParams(searchParams)
    startTransition(async () => {
      await search(searchParams)
      onSearch?.()
    })
  }

  const handleReset = () => {
    resetParams()
    industrySelect.reset()
    categorySelect.reset()
    onReset?.()
  }

  return (
    <form
      id="SearchJobForm"
      onSubmit={(e) => { e.preventDefault(); handleSearch() }}
      className="space-y-4"
      aria-label="Job search filters"
    >
      {/* Free text */}
      <div>
        <label htmlFor="freeTextSearch" className={labelClass}>
          Keywords
        </label>
        <input
          type="search"
          id="freeTextSearch"
          name="freeTextSearch"
          value={params.freeText}
          onChange={(e) => setParams({ freeText: e.target.value })}
          placeholder="Job title or skill…"
          autoComplete="off"
          className="w-full px-3 py-2.5 bg-surface-700 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </div>

      {/* Department */}
      <div>
        <p className={labelClass}>Department</p>
        <DepartmentSelect
          value={params.departmentId}
          onChange={(val) => setParams({ departmentId: val })}
        />
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="ExperienceLevelSearch" className={labelClass}>
          Experience Level
        </label>
        <select
          id="ExperienceLevelSearch"
          value={params.experienceLevelId}
          onChange={(e) => setParams({ experienceLevelId: Number(e.target.value) })}
          className={selectClass}
          aria-label="Filter by experience level"
          autoComplete="off"
        >
          <option value={0}>Any Experience</option>
          {experienceLevels.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
          ))}
        </select>
      </div>

      {/* Education Level */}
      <div>
        <label htmlFor="EducationLevelSearch" className={labelClass}>
          Education Level
        </label>
        <select
          id="EducationLevelSearch"
          value={params.educationLevelId}
          onChange={(e) => setParams({ educationLevelId: Number(e.target.value) })}
          className={selectClass}
          aria-label="Filter by education level"
          autoComplete="off"
        >
          <option value={0}>Any Education</option>
          {educationLevels.map((lvl) => (
            <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
          ))}
        </select>
      </div>

      {/* Employment Type */}
      <div>
        <label htmlFor="EmployementTypeSearch" className={labelClass}>
          Employment Type
        </label>
        <select
          id="EmployementTypeSearch"
          value={params.employmentTypeId}
          onChange={(e) => setParams({ employmentTypeId: Number(e.target.value) })}
          className={selectClass}
          aria-label="Filter by employment type"
          autoComplete="off"
        >
          <option value={0}>Any Type</option>
          {employmentTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Industry */}
      <TagSelect
        id="BusinessSector"
        label="Industry"
        options={industries}
        selectedItems={industrySelect.selectedItems}
        atMax={industrySelect.atMax}
        onAdd={industrySelect.addItem}
        onRemove={industrySelect.removeItem}
      />

      {/* Job Category */}
      <TagSelect
        id="JobNature"
        label="Job Category"
        options={jobCategories}
        selectedItems={categorySelect.selectedItems}
        atMax={categorySelect.atMax}
        onAdd={categorySelect.addItem}
        onRemove={categorySelect.removeItem}
      />

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-400 disabled:opacity-50 transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {isPending ? 'Searching…' : 'Search'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset all filters"
          className="px-3.5 py-2.5 text-slate-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-colors touch-target"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
