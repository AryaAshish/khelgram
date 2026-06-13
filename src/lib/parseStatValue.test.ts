import { describe, expect, it } from 'vitest'
import { parseNumericValue } from './parseStatValue'

describe('parseNumericValue', () => {
  it('parses prefixed and suffixed numbers', () => {
    expect(parseNumericValue('120+')).toEqual({ prefix: '', number: 120, suffix: '+' })
    expect(parseNumericValue('2,500+')).toEqual({ prefix: '', number: 2500, suffix: '+' })
    expect(parseNumericValue('~45%')).toEqual({ prefix: '~', number: 45, suffix: '%' })
  })

  it('returns null for non-numeric values', () => {
    expect(parseNumericValue('abc')).toBeNull()
    expect(parseNumericValue('')).toBeNull()
  })
})
