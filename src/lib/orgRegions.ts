export type OrgRegion = {
  name: string
  states: string[]
  description: string
}

const defaultRegions: OrgRegion[] = [
  {
    name: 'Uttar Pradesh',
    states: ['UP'],
    description: 'Grassroots discovery camps across eastern UP districts.',
  },
  {
    name: 'Bihar',
    states: ['BR'],
    description: 'School partnerships and girls inclusion programs.',
  },
  {
    name: 'Rajasthan',
    states: ['RJ'],
    description: 'Traditional sports revival and village tournaments.',
  },
]

export function parseOrgRegions(raw: string | undefined): OrgRegion[] {
  if (!raw) {
    return defaultRegions
  }

  try {
    const parsed = JSON.parse(raw) as OrgRegion[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return defaultRegions
    }

    return parsed.filter((region) => region.name && region.description)
  } catch {
    return defaultRegions
  }
}
