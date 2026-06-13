import { describe, expect, it } from 'vitest'
import { programPillarLabel, programPillarVisuals } from './programPillars'

describe('programPillars', () => {
  it('maps each pillar to icon and label', () => {
    expect(programPillarVisuals.training.label).toBe('Training')
    expect(programPillarLabel('girls_inclusion')).toBe('Girls & Inclusion')
  })

  it('falls back to raw pillar id for unknown values', () => {
    expect(programPillarLabel('unknown' as never)).toBe('unknown')
  })
})
