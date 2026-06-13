import { CircleDot, Flag, Timer, Trophy } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { resolveGameEventIcon } from './gameEventIcons'

describe('resolveGameEventIcon', () => {
  it('uses explicit game icon when set', () => {
    expect(resolveGameEventIcon({ name: 'Sack Race', icon: 'flag' })).toBe(Flag)
  })

  it('infers icon from slug when icon is missing', () => {
    expect(resolveGameEventIcon({ name: 'Relay', slug: 'relay-race' })).toBe(Timer)
  })

  it('falls back to trophy', () => {
    expect(resolveGameEventIcon({ name: 'Fun Games' })).toBe(Trophy)
  })

  it('matches football slug hints', () => {
    expect(resolveGameEventIcon({ name: 'Football', slug: 'football-finals' })).toBe(CircleDot)
  })
})
