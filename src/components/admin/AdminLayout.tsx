import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSignOut } from '@/hooks/useAuth'
import { useAdminLeads } from '@/hooks/useLeads'
import { useRegistrationCount } from '@/hooks/useRegistration'
import { buildAdminNavGroups } from '@/lib/adminNavGroups'

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
  const { leads: openLeads } = useAdminLeads({ status: 'new' })
  const navGroups = buildAdminNavGroups({
    registrationCount,
    openLeadsCount: openLeads.length,
  })

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
        <nav aria-label="Admin navigation" style={{ display: 'grid', gap: '1rem' }}>
          <NavLink to="/admin" end style={navLinkStyle}>
            Dashboard
          </NavLink>
          {navGroups.map((group) => (
            <div key={group.id}>
              <p
                style={{
                  margin: '0 0 0.35rem',
                  padding: '0 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                }}
              >
                {group.label}
              </p>
              <div style={{ display: 'grid', gap: '0.25rem' }}>
                {group.items.map((item) => (
                  <NavLink key={item.to} to={item.to} style={navLinkStyle}>
                    {item.badge !== undefined ? `${item.label} (${item.badge})` : item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
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
