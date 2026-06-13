import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders default and outline variants', () => {
    render(
      <>
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Primary' })).toHaveAttribute(
      'data-variant',
      'default',
    )
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveAttribute(
      'data-variant',
      'outline',
    )
  })

  it('renders festival and ghost variants', () => {
    render(
      <>
        <Button variant="festival">Register</Button>
        <Button variant="ghost">Learn more</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Register' })).toHaveAttribute(
      'data-variant',
      'festival',
    )
    expect(screen.getByRole('button', { name: 'Learn more' })).toHaveAttribute(
      'data-variant',
      'ghost',
    )
  })
})
