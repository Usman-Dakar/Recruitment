import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  LanguageEntry,
  Certification,
  AppliedJob,
  BookmarkedJob,
} from '@/types'

const defaultPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  middleName: '',
  gender: 'M',
  dateOfBirth: '',
  nationality: 'Maltese',
  idCardNo: '',
  headline: '',
  address: '',
  country: 'Malta',
  city: '',
  postalCode: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  telephones: [],
  websites: [],
  profilePicUrl: '',
  cvUrl: '',
}

const initialState = {
  personalInfo: defaultPersonalInfo,
  personalStatement: '',
  workExperiences: [] as WorkExperience[],
  educations: [] as Education[],
  motherTongue: '',
  otherLanguages: [] as LanguageEntry[],
  digitalSkills: [] as string[],
  drivingLicenseCategories: [] as string[],
  certifications: [] as Certification[],
  appliedJobs: [] as AppliedJob[],
  bookmarkedJobs: [] as BookmarkedJob[],
}

interface ProfileStore {
  personalInfo: PersonalInfo
  personalStatement: string
  workExperiences: WorkExperience[]
  educations: Education[]
  motherTongue: string
  otherLanguages: LanguageEntry[]
  digitalSkills: string[]
  drivingLicenseCategories: string[]
  certifications: Certification[]
  appliedJobs: AppliedJob[]
  bookmarkedJobs: BookmarkedJob[]

  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updatePersonalStatement: (text: string) => void

  addWorkExperience: (entry: Omit<WorkExperience, 'id'>) => void
  updateWorkExperience: (id: string, entry: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void

  addEducation: (entry: Omit<Education, 'id'>) => void
  updateEducation: (id: string, entry: Partial<Education>) => void
  removeEducation: (id: string) => void

  updateMotherTongue: (lang: string) => void

  addLanguage: (lang: Omit<LanguageEntry, 'id'>) => void
  updateLanguage: (id: string, lang: Partial<LanguageEntry>) => void
  removeLanguage: (id: string) => void

  updateDigitalSkills: (skills: string[]) => void
  updateDrivingLicense: (categories: string[]) => void

  addCertification: (cert: Omit<Certification, 'id'>) => void
  updateCertification: (id: string, cert: Partial<Certification>) => void
  removeCertification: (id: string) => void

  applyToJob: (jobId: number, title: string) => void
  withdrawApplication: (jobId: number) => void
  toggleBookmark: (jobId: number, title: string) => void

  reset: () => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      ...initialState,

      updatePersonalInfo: (data) =>
        set((s) => ({ personalInfo: { ...s.personalInfo, ...data } })),

      updatePersonalStatement: (text) => set({ personalStatement: text }),

      addWorkExperience: (entry) =>
        set((s) => ({
          workExperiences: [
            ...s.workExperiences,
            { ...entry, id: crypto.randomUUID() },
          ],
        })),
      updateWorkExperience: (id, entry) =>
        set((s) => ({
          workExperiences: s.workExperiences.map((w) =>
            w.id === id ? { ...w, ...entry } : w,
          ),
        })),
      removeWorkExperience: (id) =>
        set((s) => ({
          workExperiences: s.workExperiences.filter((w) => w.id !== id),
        })),

      addEducation: (entry) =>
        set((s) => ({
          educations: [...s.educations, { ...entry, id: crypto.randomUUID() }],
        })),
      updateEducation: (id, entry) =>
        set((s) => ({
          educations: s.educations.map((e) =>
            e.id === id ? { ...e, ...entry } : e,
          ),
        })),
      removeEducation: (id) =>
        set((s) => ({
          educations: s.educations.filter((e) => e.id !== id),
        })),

      updateMotherTongue: (lang) => set({ motherTongue: lang }),

      addLanguage: (lang) =>
        set((s) => ({
          otherLanguages: [
            ...s.otherLanguages,
            { ...lang, id: crypto.randomUUID() },
          ],
        })),
      updateLanguage: (id, lang) =>
        set((s) => ({
          otherLanguages: s.otherLanguages.map((l) =>
            l.id === id ? { ...l, ...lang } : l,
          ),
        })),
      removeLanguage: (id) =>
        set((s) => ({
          otherLanguages: s.otherLanguages.filter((l) => l.id !== id),
        })),

      updateDigitalSkills: (skills) => set({ digitalSkills: skills }),
      updateDrivingLicense: (categories) =>
        set({ drivingLicenseCategories: categories }),

      addCertification: (cert) =>
        set((s) => ({
          certifications: [
            ...s.certifications,
            { ...cert, id: crypto.randomUUID() },
          ],
        })),
      updateCertification: (id, cert) =>
        set((s) => ({
          certifications: s.certifications.map((c) =>
            c.id === id ? { ...c, ...cert } : c,
          ),
        })),
      removeCertification: (id) =>
        set((s) => ({
          certifications: s.certifications.filter((c) => c.id !== id),
        })),

      applyToJob: (jobId, title) =>
        set((s) => {
          if (s.appliedJobs.some((j) => j.jobId === jobId)) return s
          return {
            appliedJobs: [
              ...s.appliedJobs,
              {
                jobId,
                title,
                dateApplied: new Date().toISOString().split('T')[0],
              },
            ],
          }
        }),

      withdrawApplication: (jobId) =>
        set((s) => ({
          appliedJobs: s.appliedJobs.filter((j) => j.jobId !== jobId),
        })),

      toggleBookmark: (jobId, title) =>
        set((s) => {
          const exists = s.bookmarkedJobs.some((j) => j.jobId === jobId)
          return {
            bookmarkedJobs: exists
              ? s.bookmarkedJobs.filter((j) => j.jobId !== jobId)
              : [...s.bookmarkedJobs, { jobId, title }],
          }
        }),

      reset: () => set(initialState),
    }),
    { name: 'ax-profile' },
  ),
)
