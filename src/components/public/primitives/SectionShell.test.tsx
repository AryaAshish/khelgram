import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionShell } from './SectionShell'

describe('SectionShell', () => {
  it('renders children with default variant', () => {
    render(
      <SectionShell id="about">
        <p>Section content</p>
      </SectionShell>,
    )

    const shell = screen.getByText('Section content').closest('section')
    expect(shell).toHaveAttribute('data-variant', 'default')
    expect(shell).toHaveClass('section-shell')
    expect(shell).toHaveAttribute('id', 'about')
  })

  it('applies warm and festival variants', () => {
    const { rerender } = render(
      <SectionShell variant="warm">
        <p>Warm</p>
      </SectionShell>,
    )
    expect(screen.getByText('Warm').closest('section')).toHaveClass('section-shell--warm')

    rerender(
      <SectionShell variant="festival">
        <p>Festival</p>
      </SectionShell>,
    )
    expect(screen.getByText('Festival').closest('section')).toHaveClass('section-shell--festival')
  })

  it('applies hero offset class when requested', () => {
    render(
      <SectionShell heroOffset id="hero">
        <p>Hero</p>
      </SectionShell>,
    )
    expect(screen.getByText('Hero').closest('section')).toHaveClass('section-shell--hero-offset')
  })
})
