export type SiteSetting = {
  key: string
  value: string
  section: string
}

export type Game = {
  id: string
  slug?: string
  name: string
  description: string
  icon?: string
  ageGroup: string
  startTime: string
  status?: string
  capacity?: number
  registeredCount?: number
}

export type GalleryImage = {
  id: string
  url: string
  alt: string
  caption?: string
}

export type MediaAsset = {
  id: string
  path: string
  url: string
  alt: string
  size: number
  createdAt: string
}

export type GalleryImageDraft = {
  id: string
  url: string
  alt: string
  caption?: string
  sortOrder: number
}

export type ImpactStat = {
  id: string
  statKey?: string
  value: string
  label: string
  sortOrder?: number
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  photoUrl?: string
  published: boolean
  sortOrder: number
}

export type Contributor = {
  id: string
  name: string
  contribution: string
  photoUrl?: string
  sortOrder: number
}

export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'community'

export type Sponsor = {
  id: string
  name: string
  tier: SponsorTier
  logoUrl?: string
  website?: string
  sortOrder: number
}

export type Testimonial = {
  id: string
  quote: string
  author: string
  relation: string
  photoUrl?: string
  sortOrder: number
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  sortOrder: number
}

export type AboutContent = {
  mission: string
  vision: string
  values: string[]
}

export type RegistrationInput = {
  childName: string
  age: string
  parentName: string
  email: string
  phone: string
  selectedEvents: string[]
}

export type RegistrationResult = {
  id: string
  code: string
}

export type RegistrationStatus = 'confirmed' | 'cancelled' | 'waitlisted'

export type AdminRegistration = {
  id: string
  code: string
  childName: string
  age: number
  parentName: string
  email: string
  phone: string
  status: RegistrationStatus
  createdAt: string
  gameNames: string[]
  gameIds: string[]
}

export type RegistrationFilters = {
  search?: string
  gameId?: string
  status?: RegistrationStatus | ''
}
