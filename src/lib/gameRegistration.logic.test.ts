import { describe, expect, it } from 'vitest'
import {
  getCapacityPercent,
  getOverallRegistrationStatus,
  isGameFull,
  resolveGameRegistrationStatuses,
} from './gameRegistration.logic'
import type { Game } from '@/types/app.types'

const baseGame: Game = {
  id: 'game-1',
  name: 'Sack Race',
  description: 'Hop',
  ageGroup: 'Ages 6-10',
  startTime: '10:00 AM',
  status: 'active',
}

describe('gameRegistration.logic', () => {
  it('resolves confirmed statuses for available games', () => {
    const statuses = resolveGameRegistrationStatuses(
      [{ ...baseGame, capacity: 10, registeredCount: 4 }],
      ['game-1'],
    )
    expect(statuses).toEqual({ 'game-1': 'confirmed' })
  })

  it('resolves waitlisted statuses for full games', () => {
    const statuses = resolveGameRegistrationStatuses(
      [{ ...baseGame, capacity: 2, registeredCount: 2 }],
      ['game-1'],
    )
    expect(statuses).toEqual({ 'game-1': 'waitlisted' })
  })

  it('throws for missing games and closed games', () => {
    expect(() => resolveGameRegistrationStatuses([], ['game-1'])).toThrow(
      'One or more selected events are no longer available.',
    )
    expect(() =>
      resolveGameRegistrationStatuses([{ ...baseGame, status: 'closed' }], ['game-1']),
    ).toThrow('Sack Race is not open for registration.')
  })

  it('computes overall status from game statuses', () => {
    expect(getOverallRegistrationStatus({ 'game-1': 'confirmed' })).toBe('confirmed')
    expect(getOverallRegistrationStatus({ 'game-1': 'waitlisted', 'game-2': 'confirmed' })).toBe(
      'waitlisted',
    )
  })

  it('computes capacity percent and caps at 100', () => {
    expect(getCapacityPercent({ ...baseGame, capacity: 20, registeredCount: 5 })).toBe(25)
    expect(getCapacityPercent({ ...baseGame, capacity: 10, registeredCount: 20 })).toBe(100)
    expect(getCapacityPercent({ ...baseGame })).toBeNull()
    expect(getCapacityPercent({ ...baseGame, capacity: 0, registeredCount: 0 })).toBeNull()
  })

  it('evaluates whether game is full', () => {
    expect(isGameFull({ ...baseGame, capacity: 5, registeredCount: 5 })).toBe(true)
    expect(isGameFull({ ...baseGame, capacity: 5, registeredCount: 4 })).toBe(false)
    expect(isGameFull({ ...baseGame })).toBe(false)
  })
})
