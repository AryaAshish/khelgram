import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageToggle } from './LanguageToggle'

describe('LanguageToggle', () => {
  it('renders language pills and switches to Hindi', async () => {
    const user = userEvent.setup()

    render(<LanguageToggle />)

    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'हिं' }))
    expect(screen.getByRole('button', { name: 'हिं' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
  })
})
