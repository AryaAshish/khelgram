import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegistrationError } from '@/lib/errors'
import {
  assertCapacity,
  checkDuplicate,
  createRegistration,
  getRegistrationCount,
} from './registrations.service'

const mockFrom = vi.fn()
const mockRpc = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    rpc: (...args: unknown[]) => mockRpc(...args),
  },
}))

function createInsertBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('registrations.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockRpc.mockReset()
  })

  it('checkDuplicate returns true when RPC reports duplicate', async () => {
    mockRpc.mockResolvedValue({ data: true, error: null })

    await expect(checkDuplicate('parent@example.com', 'game-id')).resolves.toBe(true)
    expect(mockRpc).toHaveBeenCalledWith('check_registration_duplicate', {
      p_email: 'parent@example.com',
      p_game_id: 'game-id',
    })
  })

  it('checkDuplicate returns false when RPC reports no duplicate', async () => {
    mockRpc.mockResolvedValue({ data: false, error: null })

    await expect(checkDuplicate('parent@example.com', 'game-id')).resolves.toBe(false)
  })

  it('checkDuplicate throws RegistrationError on RPC failure', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'rpc failed' } })

    await expect(checkDuplicate('parent@example.com', 'game-id')).rejects.toBeInstanceOf(
      RegistrationError,
    )
  })

  it('getRegistrationCount returns count from RPC', async () => {
    mockRpc.mockResolvedValue({ data: 12, error: null })

    await expect(getRegistrationCount()).resolves.toBe(12)
  })

  it('getRegistrationCount returns zero when RPC data is not numeric', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null })

    await expect(getRegistrationCount()).resolves.toBe(0)
  })

  it('getRegistrationCount throws RegistrationError on RPC failure', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'count failed' } })

    await expect(getRegistrationCount()).rejects.toBeInstanceOf(RegistrationError)
  })

  it('assertCapacity passes when capacity is not configured', () => {
    expect(() =>
      assertCapacity(
        [
          {
            id: 'game-1',
            name: 'Sack Race',
            description: 'Hop',
            ageGroup: 'Ages 6-10',
            startTime: '10:00 AM',
            registeredCount: 99,
          },
        ],
        ['game-1'],
      ),
    ).not.toThrow()
  })

  it('assertCapacity throws when game is full', () => {
    expect(() =>
      assertCapacity(
        [
          {
            id: 'game-1',
            name: 'Sack Race',
            description: 'Hop',
            ageGroup: 'Ages 6-10',
            startTime: '10:00 AM',
            capacity: 1,
            registeredCount: 1,
          },
        ],
        ['game-1'],
      ),
    ).toThrow(RegistrationError)
  })

  it('assertCapacity throws when game is missing', () => {
    expect(() => assertCapacity([], ['missing-game'])).toThrow(RegistrationError)
  })

  it('createRegistration inserts registration and games', async () => {
    const registrationBuilder = createInsertBuilder({
      data: { id: 'reg-1', code: 'KG-2026-12345' },
      error: null,
    })
    const gamesBuilder = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    }

    mockFrom.mockImplementation((table: string) => {
      if (table === 'registrations') {
        return registrationBuilder
      }
      if (table === 'registration_games') {
        return gamesBuilder
      }
      throw new Error(`Unexpected table ${table}`)
    })

    const result = await createRegistration({
      childName: 'Aarav',
      age: '9',
      parentName: 'Neha',
      email: 'Neha@Example.com',
      phone: '9999999999',
      selectedEvents: ['Sack Race'],
      gameIds: ['game-1'],
    })

    expect(result).toEqual({ id: 'reg-1', code: 'KG-2026-12345' })
    expect(registrationBuilder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        child_name: 'Aarav',
        email: 'neha@example.com',
      }),
    )
    expect(gamesBuilder.insert).toHaveBeenCalledWith([
      { registration_id: 'reg-1', game_id: 'game-1', status: 'confirmed' },
    ])
  })

  it('createRegistration throws RegistrationError when registration insert fails', async () => {
    const registrationBuilder = createInsertBuilder({
      data: null,
      error: { message: 'insert failed' },
    })
    mockFrom.mockReturnValue(registrationBuilder)

    await expect(
      createRegistration({
        childName: 'Aarav',
        age: '9',
        parentName: 'Neha',
        email: 'neha@example.com',
        phone: '9999999999',
        selectedEvents: ['Sack Race'],
        gameIds: ['game-1'],
      }),
    ).rejects.toBeInstanceOf(RegistrationError)
  })

  it('createRegistration throws RegistrationError when registration row is missing', async () => {
    const registrationBuilder = createInsertBuilder({
      data: null,
      error: null,
    })
    mockFrom.mockReturnValue(registrationBuilder)

    await expect(
      createRegistration({
        childName: 'Aarav',
        age: '9',
        parentName: 'Neha',
        email: 'neha@example.com',
        phone: '9999999999',
        selectedEvents: ['Sack Race'],
        gameIds: ['game-1'],
      }),
    ).rejects.toThrow('Registration failed')
  })

  it('createRegistration throws RegistrationError when game links fail', async () => {
    const registrationBuilder = createInsertBuilder({
      data: { id: 'reg-1', code: 'KG-2026-12345' },
      error: null,
    })
    const gamesBuilder = {
      insert: vi.fn().mockResolvedValue({ error: { message: 'games failed' } }),
    }

    mockFrom.mockImplementation((table: string) => {
      if (table === 'registrations') {
        return registrationBuilder
      }
      return gamesBuilder
    })

    await expect(
      createRegistration({
        childName: 'Aarav',
        age: '9',
        parentName: 'Neha',
        email: 'neha@example.com',
        phone: '9999999999',
        selectedEvents: ['Sack Race'],
        gameIds: ['game-1'],
      }),
    ).rejects.toBeInstanceOf(RegistrationError)
  })
})
