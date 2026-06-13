import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnimatedStatValue } from './AnimatedStatValue'

describe('AnimatedStatValue', () => {
  it('renders the stat value text', () => {
    render(<AnimatedStatValue value="120+" />)
    expect(screen.getByText('120+')).toBeInTheDocument()
  })
})
