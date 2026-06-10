import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminRole, useSession, useSignIn, useSignOut } from './useAuth'
import * as authService from '@/services/auth.service'

vi.mock('@/services/auth.service', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  getAdminRole: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useSession returns unauthenticated state', async () => {
    vi.mocked(authService.getSession).mockResolvedValue(null)

    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeNull()
  })

  it('useSession returns authenticated session', async () => {
    vi.mocked(authService.getSession).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.getSession>>)

    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.user.id).toBe('user-1')
  })

  it('useAdminRole stays disabled without user id', async () => {
    const { result } = renderHook(() => useAdminRole(undefined), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(authService.getAdminRole).not.toHaveBeenCalled()
  })

  it('useAdminRole returns role for authenticated user', async () => {
    vi.mocked(authService.getAdminRole).mockResolvedValue({ userId: 'user-1', role: 'admin' })

    const { result } = renderHook(() => useAdminRole('user-1'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.role).toBe('admin')
  })

  it('useSignIn invalidates auth queries on success', async () => {
    vi.mocked(authService.signIn).mockResolvedValue({
      user: { id: 'user-1' },
    } as Awaited<ReturnType<typeof authService.signIn>>)

    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() })
    await result.current.mutateAsync({ email: 'admin@example.com', password: 'secret' })

    expect(authService.signIn).toHaveBeenCalled()
  })

  it('useSignOut clears session cache', async () => {
    vi.mocked(authService.signOut).mockResolvedValue()

    const { result } = renderHook(() => useSignOut(), { wrapper: createWrapper() })
    await result.current.mutateAsync()

    expect(authService.signOut).toHaveBeenCalled()
  })
})
