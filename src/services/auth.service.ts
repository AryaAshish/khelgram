import type { Session, User } from '@supabase/supabase-js'
import { AuthError } from '@/lib/errors'
import { supabase } from '@/lib/supabase'

export type AdminRole = {
  userId: string
  role: string
}

function mapAuthError(message: string): AuthError {
  const normalized = message.toLowerCase()
  if (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid email or password')
  ) {
    return new AuthError('Invalid email or password')
  }

  return new AuthError(message)
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    throw mapAuthError(error?.message ?? 'Sign in failed')
  }

  return data.session
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw mapAuthError(error.message)
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw mapAuthError(error.message)
  }

  return data.session
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function getAdminRole(userId: string): Promise<AdminRole | null> {
  const { data, error } = await supabase
    .from('admin_roles')
    .select('user_id, role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw mapAuthError(error.message)
  }

  if (!data) {
    return null
  }

  return {
    userId: data.user_id,
    role: data.role,
  }
}
