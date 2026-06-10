import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from './LoginPage'
import { AuthError } from '@/lib/errors'

const mockUseSession = vi.fn()
const mockMutateAsync = vi.fn()
const mockUseSignIn = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useSession: () => mockUseSession(),
  useSignIn: () => mockUseSignIn(),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockUseSignIn.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('redirects authenticated users to admin dashboard', () => {
    mockUseSession.mockReturnValue({ data: { user: { id: 'user-1' } } })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })

  it('renders login form and shows mapped auth error', async () => {
    mockUseSession.mockReturnValue({ data: null })
    mockMutateAsync.mockRejectedValue(new AuthError('Invalid email or password'))

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
  })

  it('shows generic error message for unexpected failures', async () => {
    mockUseSession.mockReturnValue({ data: null })
    mockMutateAsync.mockRejectedValue(new Error('network'))

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to sign in. Please try again.')
  })

  it('shows signing in label while request is pending', () => {
    mockUseSession.mockReturnValue({ data: null })
    mockUseSignIn.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
  })
})
