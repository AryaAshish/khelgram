export type AdminNavItem = {
  label: string
  to: string
  badge?: number
}

export type AdminNavGroup = {
  id: 'organization' | 'khel2026' | 'shared'
  label: string
  items: AdminNavItem[]
}

export function buildAdminNavGroups(input: {
  registrationCount: number
  openLeadsCount?: number
}): AdminNavGroup[] {
  return [
    {
      id: 'organization',
      label: 'Organization',
      items: [
        { label: 'Programs', to: '/admin/programs' },
        { label: 'Leads', to: '/admin/leads', badge: input.openLeadsCount },
        { label: 'Stories', to: '/admin/stories' },
        { label: 'Team', to: '/admin/team' },
        { label: 'Contributors', to: '/admin/contributors' },
        { label: 'Sponsors', to: '/admin/sponsors' },
        { label: 'Impact stats', to: '/admin/impact-stats' },
      ],
    },
    {
      id: 'khel2026',
      label: 'Khel 2026',
      items: [
        {
          label: 'Khel 2026 Registrations',
          to: '/admin/registrations',
          badge: input.registrationCount,
        },
        { label: 'Games', to: '/admin/games' },
        { label: 'Gallery', to: '/admin/gallery' },
      ],
    },
    {
      id: 'shared',
      label: 'Shared',
      items: [
        { label: 'Content', to: '/admin/content' },
        { label: 'Media', to: '/admin/media' },
        { label: 'Testimonials', to: '/admin/testimonials' },
        { label: 'FAQ', to: '/admin/faq' },
      ],
    },
  ]
}
