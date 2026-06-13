import { describe, expect, it } from 'vitest'
import { buildAdminNavGroups } from './adminNavGroups'

describe('adminNavGroups', () => {
  it('builds grouped navigation with badges', () => {
    const groups = buildAdminNavGroups({ registrationCount: 12, openLeadsCount: 3 })

    expect(groups.map((group) => group.label)).toEqual(['Organization', 'Khel 2026', 'Shared'])
    expect(groups[1]?.items[0]).toMatchObject({
      label: 'Khel 2026 Registrations',
      badge: 12,
    })
    expect(groups[0]?.items.find((item) => item.label === 'Leads')).toMatchObject({ badge: 3 })
  })
})
