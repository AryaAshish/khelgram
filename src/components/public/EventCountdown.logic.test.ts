import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateTimeLeft } from './eventCountdown.logic'

describe('calculateTimeLeft', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T09:00:00+05:30'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns positive countdown for future dates', () => {
    expect(calculateTimeLeft('2026-03-20T09:00:00+05:30')).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })

  it('returns zeros when date has passed', () => {
    expect(calculateTimeLeft('2026-03-18T09:00:00+05:30')).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })
  })
})
