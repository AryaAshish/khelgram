import { describe, expect, it } from 'vitest'
import { parseOrgRegions } from './orgRegions'

describe('parseOrgRegions', () => {
  it('returns default regions when input is missing', () => {
    const regions = parseOrgRegions(undefined)

    expect(regions).toHaveLength(3)
    expect(regions[0]?.name).toBe('Uttar Pradesh')
  })

  it('parses valid JSON regions', () => {
    const regions = parseOrgRegions(
      JSON.stringify([{ name: 'Kerala', states: ['KL'], description: 'Coastal outreach.' }]),
    )

    expect(regions).toEqual([{ name: 'Kerala', states: ['KL'], description: 'Coastal outreach.' }])
  })

  it('falls back when JSON is invalid or empty', () => {
    expect(parseOrgRegions('not-json')).toHaveLength(3)
    expect(parseOrgRegions('[]')).toHaveLength(3)
  })
})
