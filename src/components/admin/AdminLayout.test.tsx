import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLayout } from './AdminLayout'

const mockMutate = vi.fn()
const mockUseSignOut = vi.fn()
const mockUseAdminLeads = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useSignOut: () => mockUseSignOut(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useRegistrationCount: () => ({ data: 7 }),
}))

vi.mock('@/hooks/useLeads', () => ({
  useAdminLeads: () => mockUseAdminLeads(),
}))

describe('AdminLayout', () => {
  beforeEach(() => {
    mockUseAdminLeads.mockReturnValue({ leads: [{ id: 'lead-1' }] })
    mockUseSignOut.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    })
  })

  it('shows signing out label while logout is pending', () => {
    mockUseSignOut.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Signing out...' })).toBeDisabled()
  })

  it('renders grouped sidebar links and triggers logout', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<div>Dashboard content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Organization')).toBeInTheDocument()
    expect(screen.getByText('Khel 2026')).toBeInTheDocument()
    expect(screen.getByText('Shared')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Khel 2026 Registrations (7)' })).toHaveAttribute(
      'href',
      '/admin/registrations',
    )
    expect(screen.getByRole('link', { name: 'Leads (1)' })).toHaveAttribute('href', '/admin/leads')
    expect(screen.getByRole('link', { name: 'Stories' })).toHaveAttribute('href', '/admin/stories')

    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(mockMutate).toHaveBeenCalled()
  })
})
