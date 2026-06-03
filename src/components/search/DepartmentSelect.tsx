import { departments } from '@/data/departments'

interface DepartmentSelectProps {
  value: number
  onChange: (value: number) => void
}

const parents = departments.filter((d) => !d.parentId)
const getChildren = (parentId: number) =>
  departments.filter((d) => d.parentId === parentId)

export default function DepartmentSelect({
  value,
  onChange,
}: DepartmentSelectProps) {
  return (
    <select
      id="DepartmentSearch"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2.5 bg-surface-700 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label="Filter by department"
      autoComplete="off"
    >
      <option value={0}>Search By Department</option>
      {parents.map((parent) => {
        const children = getChildren(parent.value)
        return (
          <optgroup key={parent.value} label={parent.label}>
            {children.map((child) => (
              <option key={child.value} value={child.value}>
                {child.label}
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}
