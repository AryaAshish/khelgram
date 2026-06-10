import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CountdownSection } from './CountdownSection'

describe('CountdownSection', () => {
  it('renders heading', () => {
    render(<CountdownSection targetDate="2026-03-20T09:00:00+05:30" />)
    expect(screen.getByText('Countdown to Festival Day')).toBeInTheDocument()
  })
})
