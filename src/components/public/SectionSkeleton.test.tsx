import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SectionSkeleton } from './SectionSkeleton'

describe('SectionSkeleton', () => {
  it('renders loading label and title skeleton', () => {
    render(<SectionSkeleton title="Festival Events" />)

    expect(screen.getByLabelText('Festival Events loading')).toBeInTheDocument()
  })

  it('uses slower pulse for long titles', () => {
    const { container } = render(<SectionSkeleton title="About Khelgram Foundation" />)
    const animated = container.querySelector('[style*="animation-duration: 1.6s"]')

    expect(animated).toBeTruthy()
  })
})
