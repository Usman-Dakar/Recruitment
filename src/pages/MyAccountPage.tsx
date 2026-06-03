import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, Save } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { COUNTRIES } from '@/data/countries'
import ConfirmModal from '@/components/modals/ConfirmModal'
import MessageModal from '@/components/modals/MessageModal'
import AvatarUpload from '@/components/profile/AvatarUpload'
import { inputClass, labelClass, errClass } from '@/lib/formStyles'

const schema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  country: z.string(),
})

type AccountFields = z.infer<typeof schema>

export default function MyAccountPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const profileReset = useProfileStore((s) => s.reset)
  const personalInfo = useProfileStore((s) => s.personalInfo)
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: personalInfo.firstName,
      middleName: personalInfo.middleName,
      country: personalInfo.country || 'Malta',
    },
  })

  const onSubmit = async (data: AccountFields) => {
    await new Promise<void>((r) => setTimeout(r, 400))
    const patch: Partial<typeof data> = { middleName: data.middleName, country: data.country }
    if (!personalInfo.firstName && data.firstName) patch.firstName = data.firstName
    updatePersonalInfo(patch)
    setSavedOpen(true)
  }

  const handleDeleteConfirm = () => {
    profileReset()
    logout()
    navigate('/')
  }

  const initials = `${personalInfo.firstName?.[0] ?? user?.firstName?.[0] ?? ''}${personalInfo.lastName?.[0] ?? user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">My Account</h1>
        <p className="text-sm text-slate-400">Manage your account details.</p>
      </div>

      {/* Avatar upload */}
      <div className="glass rounded-xl p-6 mb-6 flex items-center gap-5">
        <AvatarUpload initials={initials} size="lg" rounded="full" />
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {personalInfo.firstName || user?.firstName || 'Your Name'}
            {(personalInfo.lastName || user?.lastName) && ` ${personalInfo.lastName || user?.lastName}`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          <p className="text-xs text-slate-500 mt-1">Click the photo to upload a new picture</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 sm:p-8 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* First Name — editable only once */}
          <div>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              readOnly={!!personalInfo.firstName}
              className={personalInfo.firstName ? `${inputClass} opacity-60 cursor-not-allowed` : inputClass}
              title={personalInfo.firstName ? 'First name cannot be changed once set' : undefined}
            />
            {personalInfo.firstName && (
              <p className="mt-1 text-xs text-slate-600">First name cannot be changed once set.</p>
            )}
          </div>

          {/* Editable: Middle Name */}
          <div>
            <label htmlFor="middleName" className={labelClass}>Middle Name</label>
            <input
              id="middleName"
              type="text"
              autoComplete="additional-name"
              {...register('middleName')}
              className={inputClass}
            />
            {errors.middleName && (
              <p className={errClass}>{errors.middleName.message}</p>
            )}
          </div>

          {/* Read-only: Last Name */}
          <div>
            <label className={labelClass}>Last Name</label>
            <div className={inputClass + ' opacity-50 cursor-not-allowed'}>
              {user?.lastName || '—'}
            </div>
          </div>

          {/* Editable: Country */}
          <div>
            <label htmlFor="country" className={labelClass}>Country</label>
            <select
              id="country"
              {...register('country')}
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Read-only: Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <div className={inputClass + ' opacity-50 cursor-not-allowed'}>
              {user?.email || '—'}
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Email changes require contacting HR.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-xl p-6 border border-red-500/20">
        <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-xs text-slate-400 mb-4">
          Deleting your profile is permanent and cannot be undone. All your CV data and applications
          will be removed.
        </p>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-red-500/40 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          Delete Profile
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Profile?"
        message="This will permanently delete all your CV data, applications, and bookmarks. This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />

      <MessageModal
        isOpen={savedOpen}
        message="Your account details have been updated successfully."
        onClose={() => setSavedOpen(false)}
      />
    </div>
  )
}
