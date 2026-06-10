import type React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SectionErrorBoundary } from './SectionErrorBoundary'

function Thrower(): React.ReactNode {
  throw new Error('boom')
}

describe('SectionErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <SectionErrorBoundary title="Section title">
        <div>Loaded content</div>
      </SectionErrorBoundary>,
    )

    expect(screen.getByText('Loaded content')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <SectionErrorBoundary title="Section title">
        <Thrower />
      </SectionErrorBoundary>,
    )

    expect(screen.getByLabelText('Section title error')).toBeInTheDocument()
    consoleError.mockRestore()
  })

  it('bypasses fallback guard when title is blank', () => {
    render(
      <SectionErrorBoundary title="   ">
        <div>Blank title section</div>
      </SectionErrorBoundary>,
    )

    expect(screen.getByText('Blank title section')).toBeInTheDocument()
  })
})
