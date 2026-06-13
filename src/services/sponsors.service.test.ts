import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addSponsor,
  deleteSponsor,
  getSponsors,
  reorderSponsors,
  sortSponsors,
  updateSponsor,
} from './sponsors.service'

const mockFrom = vi.fn()
const mockGetNextSortOrder = vi.fn()
const mockDeleteRow = vi.fn()
const mockReorderRows = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

vi.mock('@/services/credibility.helpers', () => ({
  getNextSortOrder: (...args: unknown[]) => mockGetNextSortOrder(...args),
  deleteRow: (...args: unknown[]) => mockDeleteRow(...args),
  reorderRows: (...args: unknown[]) => mockReorderRows(...args),
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('sortSponsors', () => {
  it('sorts by tier then sort order', () => {
    const sponsors = [
      { id: 's1', name: 'Silver A', tier: 'silver' as const, sortOrder: 1 },
      { id: 's2', name: 'Platinum', tier: 'platinum' as const, sortOrder: 0 },
      { id: 's3', name: 'Gold B', tier: 'gold' as const, sortOrder: 2 },
      { id: 's4', name: 'Gold A', tier: 'gold' as const, sortOrder: 0 },
    ]

    expect(sortSponsors(sponsors).map((sponsor) => sponsor.id)).toEqual(['s2', 's4', 's3', 's1'])
  })

  it('does not mutate the original array', () => {
    const sponsors = [{ id: 's1', name: 'A', tier: 'community' as const, sortOrder: 0 }]
    const original = [...sponsors]
    sortSponsors(sponsors)
    expect(sponsors).toEqual(original)
  })
})

describe('sponsors.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns sorted mapped sponsors', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'sponsor-silver',
          name: 'Silver Co',
          tier: 'silver',
          logo_url: null,
          website: null,
          sort_order: 0,
        },
        {
          id: 'sponsor-platinum',
          name: 'Platinum Co',
          tier: 'platinum',
          logo_url: 'https://example.com/logo.png',
          website: 'https://example.com',
          sort_order: 1,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getSponsors()).resolves.toEqual([
      {
        id: 'sponsor-platinum',
        name: 'Platinum Co',
        tier: 'platinum',
        logoUrl: 'https://example.com/logo.png',
        website: 'https://example.com',
        sortOrder: 1,
      },
      {
        id: 'sponsor-silver',
        name: 'Silver Co',
        tier: 'silver',
        logoUrl: undefined,
        website: undefined,
        sortOrder: 0,
      },
    ])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'sponsors failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getSponsors()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds a sponsor', async () => {
    mockGetNextSortOrder.mockResolvedValue(3)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        name: 'New Sponsor',
        tier: 'gold',
        logo_url: null,
        website: 'https://sponsor.example',
        sort_order: 3,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addSponsor({ name: 'New Sponsor', tier: 'gold', website: 'https://sponsor.example' }),
    ).resolves.toEqual({
      id: 'test-id',
      name: 'New Sponsor',
      tier: 'gold',
      logoUrl: undefined,
      website: 'https://sponsor.example',
      sortOrder: 3,
    })
  })

  it('throws SettingsError when add fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    mockFrom.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: 'insert failed' } }),
    )

    await expect(addSponsor({ name: 'Sponsor', tier: 'gold' })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('updates a sponsor', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'sponsor-1',
        name: 'Updated Sponsor',
        tier: 'platinum',
        logo_url: null,
        website: 'https://updated.example',
        sort_order: 0,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      updateSponsor('sponsor-1', { name: 'Updated Sponsor', website: 'https://updated.example' }),
    ).resolves.toEqual({
      id: 'sponsor-1',
      name: 'Updated Sponsor',
      tier: 'platinum',
      logoUrl: undefined,
      website: 'https://updated.example',
      sortOrder: 0,
    })
  })

  it('throws SettingsError when update fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'update failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(updateSponsor('sponsor-1', { name: 'Fail' })).rejects.toBeInstanceOf(SettingsError)
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteSponsor('sponsor-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('sponsors', 'sponsor-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderSponsors(['s-2', 's-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('sponsors', ['s-2', 's-1'])
  })
})
