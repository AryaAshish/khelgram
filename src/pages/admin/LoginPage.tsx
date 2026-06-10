import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession, useSignIn } from '@/hooks/useAuth'
import { AuthError } from '@/lib/errors'

export function LoginPage() {
  const { data: session } = useSession()
  const signIn = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  if (session) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await signIn.mutateAsync({ email, password })
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Unable to sign in. Please try again.'
      setErrorMessage(message)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        background: '#f9fafb',
      }}
    >
      <form
        onSubmit={handleSubmit}
        aria-label="Admin login form"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Login</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>
          Sign in to manage registrations and site content.
        </p>
        <div style={{ marginBottom: '0.75rem' }}>
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {errorMessage ? (
          <p role="alert" style={{ color: '#dc2626', marginBottom: '1rem' }}>
            {errorMessage}
          </p>
        ) : null}
        <Button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
