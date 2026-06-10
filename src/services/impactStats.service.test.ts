import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { getImpactStats } from './impactStats.service'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
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
})
