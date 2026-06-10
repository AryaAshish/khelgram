import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders all main sections', () => {
    render(<HomePage />)

    expect(
      screen.getByText("Khelgram Foundation Children's Sports Festival 2026"),
    ).toBeInTheDocument()
    expect(screen.getByText('Countdown to Festival Day')).toBeInTheDocument()
    expect(screen.getByText('About Khelgram Foundation')).toBeInTheDocument()
    expect(screen.getByText('Festival Events')).toBeInTheDocument()
    expect(screen.getByText('Register Your Child')).toBeInTheDocument()
  })

  it('contains CTA buttons', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByRole('button', { name: 'Register Now' }))
    await user.click(screen.getByRole('button', { name: 'Explore Events' }))

    expect(screen.getByRole('button', { name: 'Register Now' })).toBeInTheDocument()
  })

  it('scrolls to section when register anchor exists', () => {
    const scrollIntoView = vi.fn()
    const element = document.createElement('div')
    element.id = 'register'
    element.scrollIntoView = scrollIntoView
    document.body.appendChild(element)

    render(<HomePage />)
    screen.getByRole('button', { name: 'Register Now' }).click()

    expect(scrollIntoView).toHaveBeenCalled()
    element.remove()
  })
})
