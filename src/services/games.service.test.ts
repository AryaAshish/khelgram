import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  closeGame,
  deleteGame,
  getAllGames,
  getGameWithCapacity,
  getGames,
  openGame,
  upsertGame,
} from './games.service'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
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
          pre_registration_allowed: true,
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
        preRegistrationAllowed: true,
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
          pre_registration_allowed: false,
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
        preRegistrationAllowed: false,
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

  it('throws SettingsError when getAllGames fails', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'all games failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllGames()).rejects.toBeInstanceOf(SettingsError)
  })

  it('returns all games including closed', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'relay-race',
          slug: 'relay-race',
          name: 'Relay Race',
          description: 'Pass baton',
          icon: null,
          age_group: 'Ages 8-12',
          start_time: '1:00 PM',
          status: 'closed',
          capacity: 20,
          registered_count: 20,
          pre_registration_allowed: true,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllGames()).resolves.toEqual([
      expect.objectContaining({
        id: 'relay-race',
        status: 'closed',
      }),
    ])
  })

  it('upserts game and maps generated id/slug defaults', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'sack-race',
        slug: 'sack-race',
        name: 'Sack Race',
        description: 'Hop to finish line',
        icon: null,
        age_group: 'Ages 6-10',
        start_time: '10:00 AM',
        status: 'active',
        capacity: null,
        registered_count: 0,
        pre_registration_allowed: true,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const result = await upsertGame({
      name: 'Sack Race',
      description: 'Hop to finish line',
      ageGroup: 'Ages 6-10',
      startTime: '10:00 AM',
    })

    expect(result.id).toBe('sack-race')
    expect(builder.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sack-race',
        slug: 'sack-race',
        pre_registration_allowed: true,
      }),
    )
  })

  it('throws SettingsError when upsert fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'upsert failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(
      upsertGame({
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
      }),
    ).rejects.toBeInstanceOf(SettingsError)
  })

  it('throws SettingsError when upsert returns no row', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(
      upsertGame({
        id: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        ageGroup: 'Ages 6-10',
        startTime: '10:00 AM',
      }),
    ).rejects.toBeInstanceOf(SettingsError)
  })

  it('throws SettingsError when open returns no row without message', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: null }))
    await expect(openGame('game-1')).rejects.toBeInstanceOf(SettingsError)
  })

  it('throws SettingsError when close returns no row without message', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: null }))
    await expect(closeGame('game-1')).rejects.toBeInstanceOf(SettingsError)
  })

  it('deletes game row', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(deleteGame('game-1')).resolves.toBeUndefined()
    expect(builder.delete).toHaveBeenCalled()
    expect(builder.eq).toHaveBeenCalledWith('id', 'game-1')
  })

  it('throws SettingsError when delete fails', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    builder.eq.mockResolvedValue({ error: { message: 'delete failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(deleteGame('game-1')).rejects.toBeInstanceOf(SettingsError)
  })

  it('opens and closes games', async () => {
    const openBuilder = createQueryBuilder({
      data: {
        id: 'game-1',
        slug: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        icon: null,
        age_group: 'Ages 6-10',
        start_time: '10:00 AM',
        status: 'active',
        capacity: 10,
        registered_count: 1,
        pre_registration_allowed: true,
      },
      error: null,
    })
    const closeBuilder = createQueryBuilder({
      data: {
        id: 'game-1',
        slug: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        icon: null,
        age_group: 'Ages 6-10',
        start_time: '10:00 AM',
        status: 'closed',
        capacity: 10,
        registered_count: 1,
        pre_registration_allowed: true,
      },
      error: null,
    })

    mockFrom.mockReturnValueOnce(openBuilder).mockReturnValueOnce(closeBuilder)

    await expect(openGame('game-1')).resolves.toEqual(expect.objectContaining({ status: 'active' }))
    await expect(closeGame('game-1')).resolves.toEqual(
      expect.objectContaining({ status: 'closed' }),
    )
    expect(openBuilder.update).toHaveBeenCalledWith({ status: 'active' })
    expect(closeBuilder.update).toHaveBeenCalledWith({ status: 'closed' })
  })

  it('throws SettingsError when open/close fails', async () => {
    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: { message: 'open failed' } }))
    await expect(openGame('game-1')).rejects.toBeInstanceOf(SettingsError)

    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: { message: 'close failed' } }))
    await expect(closeGame('game-1')).rejects.toBeInstanceOf(SettingsError)
  })

  it('returns game with capacity or null', async () => {
    const foundBuilder = createQueryBuilder({
      data: {
        id: 'game-1',
        slug: 'game-1',
        name: 'Sack Race',
        description: 'Hop',
        icon: null,
        age_group: 'Ages 6-10',
        start_time: '10:00 AM',
        status: 'active',
        capacity: 3,
        registered_count: 2,
        pre_registration_allowed: true,
      },
      error: null,
    })
    mockFrom.mockReturnValue(foundBuilder)
    await expect(getGameWithCapacity('game-1')).resolves.toEqual(
      expect.objectContaining({ id: 'game-1', capacity: 3 }),
    )

    mockFrom.mockReturnValue(createQueryBuilder({ data: null, error: null }))
    await expect(getGameWithCapacity('missing')).resolves.toBeNull()

    mockFrom.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: 'lookup failed' } }),
    )
    await expect(getGameWithCapacity('game-1')).rejects.toBeInstanceOf(SettingsError)
  })
})
