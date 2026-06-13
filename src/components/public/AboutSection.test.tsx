import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutSection } from './AboutSection'

describe('AboutSection', () => {
  it('renders mission, vision, and values', () => {
    render(
      <AboutSection
        title="About Khelgram Foundation"
        content={{ mission: 'Mission text', vision: 'Vision text', values: ['Value One'] }}
      />,
    )

    expect(screen.getByText('Mission text')).toBeInTheDocument()
    expect(screen.getByText('Vision text')).toBeInTheDocument()
    expect(screen.getByText('Value One')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Indian coach guiding children during football/i }),
    ).toBeInTheDocument()
    expect(document.getElementById('about')).toHaveAttribute('data-variant', 'warm')
  })
})
