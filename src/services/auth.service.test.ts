import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthError } from '@/lib/errors'
import { getAdminRole, getCurrentUser, getSession, signIn, signOut } from './auth.service'

const mockSignInWithPassword = vi.fn()
const mockSignOut = vi.fn()
const mockGetSession = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

describe('auth.service', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    mockSignOut.mockReset()
    mockGetSession.mockReset()
    mockFrom.mockReset()
  })

  it('signIn returns session on success', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })

    const session = await signIn('admin@example.com', 'secret')

    expect(session.user.id).toBe('user-1')
  })

  it('signIn maps invalid credentials to readable error', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    })

    await expect(signIn('admin@example.com', 'wrong')).rejects.toThrow('Invalid email or password')
  })

  it('signOut completes when Supabase returns no error', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    await expect(signOut()).resolves.toBeUndefined()
  })

  it('signOut throws AuthError on failure', async () => {
    mockSignOut.mockResolvedValue({ error: { message: 'sign out failed' } })

    await expect(signOut()).rejects.toBeInstanceOf(AuthError)
  })

  it('getSession returns null when no session exists', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getSession()).resolves.toBeNull()
  })

  it('getSession throws AuthError on failure', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'session failed' },
    })

    await expect(getSession()).rejects.toBeInstanceOf(AuthError)
  })

  it('getCurrentUser returns user from active session', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })

    await expect(getCurrentUser()).resolves.toEqual({ id: 'user-1' })
  })

  it('getCurrentUser returns null without an active session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    await expect(getCurrentUser()).resolves.toBeNull()
  })

  it('signIn throws when session is missing without explicit auth error', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    await expect(signIn('admin@example.com', 'secret')).rejects.toBeInstanceOf(AuthError)
  })

  it('getAdminRole maps admin role row', async () => {
    const builder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: { user_id: 'user-1', role: 'admin' },
        error: null,
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(getAdminRole('user-1')).resolves.toEqual({
      userId: 'user-1',
      role: 'admin',
    })
  })

  it('getAdminRole throws AuthError on query failure', async () => {
    const builder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'role failed' } }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(getAdminRole('user-1')).rejects.toBeInstanceOf(AuthError)
  })

  it('getAdminRole returns null when role row is missing', async () => {
    const builder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(getAdminRole('user-1')).resolves.toBeNull()
  })
})
