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

export type ImpactStat = {
  id: string
  statKey?: string
  value: string
  label: string
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
