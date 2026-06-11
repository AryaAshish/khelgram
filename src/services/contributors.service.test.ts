import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addContributor,
  deleteContributor,
  getContributors,
  reorderContributors,
} from './contributors.service'

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
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('contributors.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped contributors', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'contributor-1',
          name: 'Local Schools',
          contribution: 'Venue support',
          photo_url: null,
          sort_order: 0,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getContributors()).resolves.toEqual([
      {
        id: 'contributor-1',
        name: 'Local Schools',
        contribution: 'Venue support',
        photoUrl: undefined,
        sortOrder: 0,
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getContributors()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'contributors failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getContributors()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds a contributor', async () => {
    mockGetNextSortOrder.mockResolvedValue(1)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        name: 'Partner Org',
        contribution: 'Equipment',
        photo_url: 'https://example.com/logo.png',
        sort_order: 1,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addContributor({
        name: 'Partner Org',
        contribution: 'Equipment',
        photoUrl: 'https://example.com/logo.png',
      }),
    ).resolves.toEqual({
      id: 'test-id',
      name: 'Partner Org',
      contribution: 'Equipment',
      photoUrl: 'https://example.com/logo.png',
      sortOrder: 1,
    })
  })

  it('throws SettingsError when add fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    mockFrom.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: 'insert failed' } }),
    )

    await expect(
      addContributor({ name: 'Partner', contribution: 'Support' }),
    ).rejects.toBeInstanceOf(SettingsError)
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteContributor('contributor-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('contributors', 'contributor-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderContributors(['c-2', 'c-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('contributors', ['c-2', 'c-1'])
  })
})
