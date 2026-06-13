import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders title with optional eyebrow and subtitle', () => {
    render(
      <SectionHeading
        eyebrow="120+ villages"
        title="Our Impact"
        subtitle="Grassroots outcomes across rural India."
      />,
    )

    expect(screen.getByText('120+ villages')).toHaveClass('section-heading__eyebrow')
    expect(screen.getByRole('heading', { name: 'Our Impact' })).toHaveClass(
      'section-heading__title',
    )
    expect(screen.getByText('Grassroots outcomes across rural India.')).toHaveClass(
      'section-heading__subtitle',
    )
  })

  it('supports centered alignment', () => {
    render(<SectionHeading title="Programs" align="center" />)
    expect(screen.getByRole('heading', { name: 'Programs' }).parentElement).toHaveClass(
      'section-heading--center',
    )
  })
})
