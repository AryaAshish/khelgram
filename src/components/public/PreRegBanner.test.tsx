import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreRegBanner } from './PreRegBanner'

describe('PreRegBanner', () => {
  it('renders pre-registration message', () => {
    render(<PreRegBanner message="Pre-registration is open now." />)
    expect(screen.getByRole('status')).toHaveTextContent('Pre-registration is open now.')
  })
})
