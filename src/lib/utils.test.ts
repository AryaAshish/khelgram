import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', undefined, null, false, 'c')).toBe('a b c')
  })

  it('returns empty string when no classes provided', () => {
    expect(cn()).toBe('')
  })
})
