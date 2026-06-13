export type GetInvolvedCard = {
  id: string
  title: string
  description: string
  buttonLabel: string
  buttonUrl: string
}

export type GetInvolvedContent = {
  title: string
  cards: GetInvolvedCard[]
}

const cardIds = ['parents', 'schools', 'partners', 'volunteers'] as const

const defaultCards: GetInvolvedCard[] = [
  {
    id: 'parents',
    title: 'Parents',
    description: 'Register your child for Khel 2026 and grassroots sports programs.',
    buttonLabel: 'Register your child',
    buttonUrl: '/register',
  },
  {
    id: 'schools',
    title: 'Schools',
    description: 'Partner with us to bring sports programs to your students.',
    buttonLabel: 'Contact us',
    buttonUrl: '#contact',
  },
  {
    id: 'partners',
    title: 'Partners',
    description: 'Support equipment, coaching, and village outreach with your organization.',
    buttonLabel: 'Partner with us',
    buttonUrl: '/get-involved#partner-inquiry',
  },
  {
    id: 'volunteers',
    title: 'Volunteers',
    description: 'Help at events, training camps, and community sports days.',
    buttonLabel: 'Sign up to volunteer',
    buttonUrl: '/get-involved#volunteer-signup',
  },
]

export function getInvolvedContent(settingsMap: Record<string, string>): GetInvolvedContent {
  const title = settingsMap.org_get_involved_title ?? 'Get Involved'

  const cards = cardIds.map((id, index) => {
    const defaults = defaultCards[index]!
    const prefix = `org_get_involved_${id}`

    return {
      id,
      title: settingsMap[`${prefix}_title`] ?? defaults.title,
      description: settingsMap[`${prefix}_description`] ?? defaults.description,
      buttonLabel: settingsMap[`${prefix}_cta_label`] ?? defaults.buttonLabel,
      buttonUrl: settingsMap[`${prefix}_cta_url`] ?? defaults.buttonUrl,
    }
  })

  return { title, cards }
}
