import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSignOut } from '@/hooks/useAuth'
import { useRegistrationCount } from '@/hooks/useRegistration'

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.5rem',
  textDecoration: 'none',
  color: isActive ? '#111827' : '#4b5563',
  background: isActive ? '#e5e7eb' : 'transparent',
  fontWeight: isActive ? 700 : 500,
})

export function AdminLayout() {
  const signOut = useSignOut()
  const { data: registrationCount = 0 } = useRegistrationCount()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside
        style={{
          borderRight: '1px solid #e5e7eb',
          padding: '1.5rem 1rem',
          background: '#f9fafb',
        }}
      >
        <h1 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Khelgram Admin</h1>
        <nav aria-label="Admin navigation" style={{ display: 'grid', gap: '0.25rem' }}>
          <NavLink to="/admin" end style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/registrations" style={navLinkStyle}>
            Registrations ({registrationCount})
          </NavLink>
          <NavLink to="/admin/content" style={navLinkStyle}>
            Content
          </NavLink>
          <NavLink to="/admin/media" style={navLinkStyle}>
            Media
          </NavLink>
          <NavLink to="/admin/gallery" style={navLinkStyle}>
            Gallery
          </NavLink>
          <NavLink to="/admin/team" style={navLinkStyle}>
            Team
          </NavLink>
          <NavLink to="/admin/contributors" style={navLinkStyle}>
            Contributors
          </NavLink>
          <NavLink to="/admin/sponsors" style={navLinkStyle}>
            Sponsors
          </NavLink>
          <NavLink to="/admin/testimonials" style={navLinkStyle}>
            Testimonials
          </NavLink>
          <NavLink to="/admin/faq" style={navLinkStyle}>
            FAQ
          </NavLink>
          <NavLink to="/admin/impact-stats" style={navLinkStyle}>
            Impact stats
          </NavLink>
        </nav>
      </aside>
      <div>
        <header
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Button variant="outline" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
            {signOut.isPending ? 'Signing out...' : 'Logout'}
          </Button>
        </header>
        <main style={{ padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
