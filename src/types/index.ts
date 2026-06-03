export interface Department {
  value: number
  label: string
  parentId?: number
}

export interface DropdownOption {
  value: number
  label: string
}

export interface Job {
  id: number
  title: string
  departmentId: number
  departmentName: string
  jobCategoryId: number
  jobCategoryName: string
  industryIds: number[]
  experienceLevelId: number
  experienceLevelName: string
  educationLevelId: number
  educationLevelName: string
  employmentTypeId: number
  employmentTypeName: string
  datePosted: string
  description: string
  location: string
  company?: string
  salary?: string
}

export interface SearchParams {
  jobTypeId: number
  occupationId: number
  pageNo: number
  experienceLevelId: number
  educationLevelId: number
  bussinessSectorIds: string
  jobNatureIds: string
  employmentTypeId: number
  jobCallTypeId: number
  departmentId: number
  freeText: string
}

export interface SearchResult {
  jobs: Job[]
  totalRecords: number
  pageNo: number
  pageSize: number
}

export interface ContactFormData {
  Name: string
  Email: string
  Telephone: string
  Message: string
}

export interface RegisterFormData {
  FirstName: string
  LastName: string
  DisplayName: string
  Email: string
}

export interface LoginFormData {
  UserName: string
  pass: string
  remember: boolean
}

export interface User {
  luid: number
  firstName: string
  lastName: string
  displayName: string
  email: string
  avatarUrl?: string
}

/* ── CV / Profile types ── */

export interface Telephone {
  id: string
  type: 'Home' | 'Work' | 'Mobile'
  prefix: string
  number: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  middleName: string
  gender: 'M' | 'F' | 'X'
  dateOfBirth: string
  nationality: string
  idCardNo: string
  headline: string
  address: string
  country: string
  city: string
  postalCode: string
  email: string
  phone: string
  linkedin: string
  github: string
  telephones: Telephone[]
  websites: string[]
  profilePicUrl: string
  cvUrl: string
}

export interface WorkExperience {
  id: string
  company: string
  jobTitle: string
  location: string
  fromDate: string
  toDate: string
  current: boolean
  description: string
  skills: string[]
}

export interface Education {
  id: string
  institution: string
  qualification: string
  location: string
  fromDate: string
  toDate: string
  current: boolean
  notes: string
}

export interface LanguageEntry {
  id: string
  name: string
  proficiency: 'Basic' | 'Conversational' | 'Proficient' | 'Fluent' | 'Native'
}

export interface Certification {
  id: string
  name: string
  issuer: string
  year: string
}

export interface AppliedJob {
  jobId: number
  title: string
  dateApplied: string
}

export interface BookmarkedJob {
  jobId: number
  title: string
}
