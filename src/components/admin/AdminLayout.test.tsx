import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLayout } from './AdminLayout'

const mockMutate = vi.fn()
const mockUseSignOut = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useSignOut: () => mockUseSignOut(),
}))

vi.mock('@/hooks/useRegistration', () => ({
  useRegistrationCount: () => ({ data: 7 }),
}))

describe('AdminLayout', () => {
  beforeEach(() => {
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

  it('renders sidebar links and triggers logout', async () => {
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

    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Registrations (7)' })).toHaveAttribute(
      'href',
      '/admin/registrations',
    )
    expect(screen.getByRole('link', { name: 'Content' })).toHaveAttribute('href', '/admin/content')
    expect(screen.getByRole('link', { name: 'Media' })).toHaveAttribute('href', '/admin/media')
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '/admin/gallery')
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/admin/team')
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/admin/faq')

    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(mockMutate).toHaveBeenCalled()
  })
})
