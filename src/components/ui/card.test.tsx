import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './card'

describe('Card', () => {
  it('renders default and elevated styles', () => {
    const { rerender } = render(<Card>Default</Card>)
    expect(screen.getByText('Default')).toHaveClass('border-gray-200')

    rerender(<Card elevated>Elevated</Card>)
    expect(screen.getByText('Elevated')).toHaveClass('card-elevated')
  })
})
