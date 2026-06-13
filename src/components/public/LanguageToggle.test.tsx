import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageToggle } from './LanguageToggle'

describe('LanguageToggle', () => {
  it('renders language buttons and switches to Hindi', async () => {
    const user = userEvent.setup()

    render(<LanguageToggle />)

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'हिंदी' }))
    expect(screen.getByRole('button', { name: 'हिंदी' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
  })
})
