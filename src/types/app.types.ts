export type SiteSetting = {
  key: string
  value: string
  section: string
}

export type Game = {
  id: string
  name: string
  description: string
  ageGroup: string
  startTime: string
}

export type GalleryImage = {
  id: string
  url: string
  alt: string
}

export type ImpactStat = {
  id: string
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
