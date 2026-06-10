import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegistrationDetailPage } from './RegistrationDetailPage'

const mockMutate = vi.fn()

const mockUseRegistrationDetail = vi.fn()

vi.mock('@/hooks/useAdminRegistrations', () => ({
  useRegistrationDetail: () => mockUseRegistrationDetail(),
  useUpdateRegistrationStatus: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

const sampleDetail = {
  id: 'reg-1',
  code: 'KG-2026-00001',
  childName: 'Aarav',
  age: 9,
  parentName: 'Neha',
  email: 'neha@example.com',
  phone: '9999999999',
  status: 'confirmed' as const,
  createdAt: '2026-04-01T10:00:00.000Z',
  gameNames: ['Sack Race'],
  gameIds: ['game-1'],
}

describe('RegistrationDetailPage', () => {
  it('shows loading and not-found states', () => {
    mockUseRegistrationDetail.mockReturnValue({ data: null, isLoading: true })
    const { rerender } = render(
      <MemoryRouter initialEntries={['/admin/registrations/reg-1']}>
        <Routes>
          <Route path="/admin/registrations/:id" element={<RegistrationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Loading registration details...')).toBeInTheDocument()

    mockUseRegistrationDetail.mockReturnValue({ data: null, isLoading: false })
    rerender(
      <MemoryRouter initialEntries={['/admin/registrations/reg-1']}>
        <Routes>
          <Route path="/admin/registrations/:id" element={<RegistrationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Registration not found.')).toBeInTheDocument()
  })

  it('renders registration detail fields', () => {
    mockUseRegistrationDetail.mockReturnValue({ data: sampleDetail, isLoading: false })
    render(
      <MemoryRouter initialEntries={['/admin/registrations/reg-1']}>
        <Routes>
          <Route path="/admin/registrations/:id" element={<RegistrationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('KG-2026-00001')).toBeInTheDocument()
    expect(screen.getByText('neha@example.com')).toBeInTheDocument()
    expect(screen.getByText('Sack Race')).toBeInTheDocument()
  })

  it('updates status from detail page controls', async () => {
    const user = userEvent.setup()
    mockUseRegistrationDetail.mockReturnValue({ data: sampleDetail, isLoading: false })

    render(
      <MemoryRouter initialEntries={['/admin/registrations/reg-1']}>
        <Routes>
          <Route path="/admin/registrations/:id" element={<RegistrationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.selectOptions(screen.getByLabelText('Status'), 'waitlisted')
    expect(mockMutate).toHaveBeenCalledWith({ id: 'reg-1', status: 'waitlisted' })

    await user.click(screen.getByRole('button', { name: 'Refresh Status' }))
    expect(mockMutate).toHaveBeenCalledWith({ id: 'reg-1', status: 'confirmed' })
  })
})
