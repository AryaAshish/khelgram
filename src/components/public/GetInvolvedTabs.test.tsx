import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GetInvolvedTabs } from './GetInvolvedTabs'

describe('GetInvolvedTabs', () => {
  it('renders stakeholder tabs and scrolls on select', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    const target = document.createElement('section')
    target.id = 'partner-inquiry'
    target.scrollIntoView = scrollIntoView
    document.body.appendChild(target)

    render(<GetInvolvedTabs />)

    expect(screen.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: 'Partners' }))
    expect(screen.getByRole('tab', { name: 'Partners' })).toHaveAttribute('aria-selected', 'true')
    expect(scrollIntoView).toHaveBeenCalled()

    target.remove()
  })
})
