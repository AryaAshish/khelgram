import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addImpactStat,
  deleteImpactStat,
  getImpactStats,
  reorderImpactStats,
} from './impactStats.service'

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
  }
}

describe('impactStats.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped impact stats', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'children',
          stat_key: 'children_participating',
          value: '500+',
          label: 'Children Participating',
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getImpactStats()).resolves.toEqual([
      {
        id: 'children',
        statKey: 'children_participating',
        value: '500+',
        label: 'Children Participating',
      },
    ])
  })

  it('maps nullable stat key to undefined', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'schools',
          stat_key: null,
          value: '20+',
          label: 'Schools Represented',
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getImpactStats()).resolves.toEqual([
      {
        id: 'schools',
        statKey: undefined,
        value: '20+',
        label: 'Schools Represented',
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getImpactStats()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'impact stats failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getImpactStats()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds an impact stat', async () => {
    mockGetNextSortOrder.mockResolvedValue(1)
    const builder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'test-id',
          stat_key: 'schools',
          value: '20+',
          label: 'Schools',
          sort_order: 1,
        },
        error: null,
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(
      addImpactStat({ value: '20+', label: 'Schools', statKey: 'schools' }),
    ).resolves.toEqual({
      id: 'test-id',
      statKey: 'schools',
      value: '20+',
      label: 'Schools',
      sortOrder: 1,
    })
  })

  it('throws SettingsError when add fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    const builder = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'insert failed' },
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(addImpactStat({ value: '1', label: 'Stat' })).rejects.toBeInstanceOf(SettingsError)
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteImpactStat('stat-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('impact_stats', 'stat-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderImpactStats(['stat-2', 'stat-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('impact_stats', ['stat-2', 'stat-1'])
  })
})
