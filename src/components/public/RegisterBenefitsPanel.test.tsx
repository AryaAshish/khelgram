import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RegisterBenefitsPanel } from './RegisterBenefitsPanel'

describe('RegisterBenefitsPanel', () => {
  it('renders benefits panel with photo and quote', () => {
    render(<RegisterBenefitsPanel />)

    expect(screen.getByText('Why join Khel 2026')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText(/My daughter found confidence/)).toBeInTheDocument()
  })
})
