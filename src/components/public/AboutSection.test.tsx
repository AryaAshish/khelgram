import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutSection } from './AboutSection'

describe('AboutSection', () => {
  it('renders mission and stats', () => {
    render(
      <AboutSection
        title="About Khelgram Foundation"
        content={{ mission: 'Mission text', vision: 'Vision text', values: ['Value One'] }}
        impactStats={[{ id: 'one', value: '100+', label: 'Kids' }]}
      />,
    )

    expect(screen.getByText('Mission text')).toBeInTheDocument()
    expect(screen.getByText('100+')).toBeInTheDocument()
  })
})
