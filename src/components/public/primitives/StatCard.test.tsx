import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders value and label with variant attribute', () => {
    render(<StatCard value="120+" label="Villages Reached" variant="impact" />)

    const card = screen.getByText('120+').closest('article')
    expect(card).toHaveAttribute('data-variant', 'impact')
    expect(screen.getByText('Villages Reached')).toHaveClass('stat-card__label')
  })
})
