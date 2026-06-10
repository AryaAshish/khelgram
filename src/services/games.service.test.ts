import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { getGames } from './games.service'

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

describe('games.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('returns mapped games', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'sack-race',
          slug: 'sack-race',
          name: 'Sack Race',
          description: 'Hop to finish line',
          icon: null,
          age_group: 'Ages 6-10',
          start_time: '10:00 AM',
          status: 'active',
          capacity: 80,
          registered_count: 12,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getGames()).resolves.toEqual([
      {
        id: 'sack-race',
        slug: 'sack-race',
        name: 'Sack Race',
        description: 'Hop to finish line',
        icon: undefined,
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
        status: 'active',
        capacity: 80,
        registeredCount: 12,
      },
    ])
  })

  it('maps optional icon and capacity values when present', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'relay-race',
          slug: 'relay-race',
          name: 'Relay Race',
          description: 'Pass the baton',
          icon: 'relay-icon',
          age_group: 'Ages 8-14',
          start_time: '1:00 PM',
          status: 'active',
          capacity: null,
          registered_count: 5,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getGames()).resolves.toEqual([
      {
        id: 'relay-race',
        slug: 'relay-race',
        name: 'Relay Race',
        description: 'Pass the baton',
        icon: 'relay-icon',
        ageGroup: 'Ages 8-14',
        startTime: '1:00 PM',
        status: 'active',
        capacity: undefined,
        registeredCount: 5,
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getGames()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'games failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getGames()).rejects.toBeInstanceOf(SettingsError)
  })
})
