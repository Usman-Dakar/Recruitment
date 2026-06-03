import { useCallback } from 'react'
import { useSearchStore } from '@/store/searchStore'
import { mockJobs } from '@/data/mockJobs'
import type { Job, SearchParams } from '@/types'

const PAGE_SIZE = 10

export function useJobSearch() {
  const { setResults, setLoading } = useSearchStore()

  const search = useCallback(
    async (params: SearchParams) => {
      setLoading(true)

      await new Promise<void>((resolve) => setTimeout(resolve, 350))

      let filtered: Job[] = [...mockJobs]

      if (params.freeText.trim()) {
        const q = params.freeText.toLowerCase()
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q),
        )
      }

      if (params.departmentId > 0) {
        filtered = filtered.filter((j) => j.departmentId === params.departmentId)
      }

      if (params.experienceLevelId > 0) {
        filtered = filtered.filter(
          (j) => j.experienceLevelId === params.experienceLevelId,
        )
      }

      if (params.educationLevelId > 0) {
        filtered = filtered.filter(
          (j) => j.educationLevelId === params.educationLevelId,
        )
      }

      if (params.employmentTypeId > 0) {
        filtered = filtered.filter(
          (j) => j.employmentTypeId === params.employmentTypeId,
        )
      }

      if (params.bussinessSectorIds) {
        const ids = params.bussinessSectorIds.split(',').map(Number)
        filtered = filtered.filter((j) =>
          j.industryIds.some((id) => ids.includes(id)),
        )
      }

      if (params.jobNatureIds) {
        const ids = params.jobNatureIds.split(',').map(Number)
        filtered = filtered.filter((j) => ids.includes(j.jobCategoryId))
      }

      const totalRecords = filtered.length
      const start = (params.pageNo - 1) * PAGE_SIZE
      const jobs = filtered.slice(start, start + PAGE_SIZE)

      setResults({ jobs, totalRecords, pageNo: params.pageNo, pageSize: PAGE_SIZE })
      setLoading(false)
    },
    [setResults, setLoading],
  )

  return { search }
}
