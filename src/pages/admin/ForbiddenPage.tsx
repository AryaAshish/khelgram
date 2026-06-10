export function ForbiddenPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>403 — Access Denied</h1>
        <p style={{ color: '#6b7280' }}>
          Your account is signed in but does not have admin permissions for Khelgram Foundation.
        </p>
      </div>
    </div>
  )
}
