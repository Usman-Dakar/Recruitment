import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfileStore } from '@/store/profileStore'

interface Props {
  initials?: string
  size?: 'md' | 'lg'
  rounded?: 'full' | '2xl'
}

export default function AvatarUpload({ initials = 'U', size = 'lg', rounded = '2xl' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const profilePicUrl   = useProfileStore((s) => s.personalInfo.profilePicUrl)
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo)

  const dim = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
  const textSize = size === 'lg' ? 'text-2xl' : 'text-base'
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl'

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updatePersonalInfo({ profilePicUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
    // reset so picking the same file again fires onChange
    e.target.value = ''
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative group shrink-0 border-4 border-surface-900 overflow-hidden',
        'bg-brand-500/20 flex items-center justify-center shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        dim, roundedClass,
      )}
      aria-label="Upload profile picture"
      title="Click to upload a photo"
    >
      {profilePicUrl ? (
        <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className={cn('font-bold text-brand-300', textSize)}>{initials}</span>
      )}

      {/* hover overlay */}
      <span className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-0.5',
        'bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
      )}>
        <Camera className="w-5 h-5 text-white" aria-hidden="true" />
        <span className="text-[10px] font-semibold text-white leading-none">Upload</span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />
    </button>
  )
}
