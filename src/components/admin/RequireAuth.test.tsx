import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireAuth } from './RequireAuth'

const mockUseSession = vi.fn()
const mockUseAdminRole = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useSession: () => mockUseSession(),
  useAdminRole: (userId: string | undefined) => mockUseAdminRole(userId),
}))

function renderWithRoutes(initialEntry = '/admin') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login Page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  it('shows loading state while session is being resolved', () => {
    mockUseSession.mockReturnValue({ data: null, isLoading: true })
    mockUseAdminRole.mockReturnValue({ data: null, isLoading: false })

    renderWithRoutes()

    expect(screen.getByText('Checking admin access...')).toBeInTheDocument()
  })

  it('redirects to login when there is no session', () => {
    mockUseSession.mockReturnValue({ data: null, isLoading: false })
    mockUseAdminRole.mockReturnValue({ data: null, isLoading: false })

    renderWithRoutes()

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders forbidden page when session exists without admin role', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user-1' } },
      isLoading: false,
    })
    mockUseAdminRole.mockReturnValue({ data: null, isLoading: false })

    renderWithRoutes()

    expect(screen.getByText('403 — Access Denied')).toBeInTheDocument()
  })

  it('renders protected content for authenticated admins', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'user-1' } },
      isLoading: false,
    })
    mockUseAdminRole.mockReturnValue({
      data: { userId: 'user-1', role: 'admin' },
      isLoading: false,
    })

    renderWithRoutes()

    expect(screen.getByText('Protected Dashboard')).toBeInTheDocument()
  })
})
