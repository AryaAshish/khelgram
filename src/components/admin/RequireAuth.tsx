import { Navigate, Outlet } from 'react-router-dom'
import { useAdminRole, useSession } from '@/hooks/useAuth'
import { ForbiddenPage } from '@/pages/admin/ForbiddenPage'

export function RequireAuth() {
  const { data: session, isLoading: sessionLoading } = useSession()
  const userId = session?.user.id
  const { data: adminRole, isLoading: roleLoading } = useAdminRole(userId)

  if (sessionLoading || (userId && roleLoading)) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Checking admin access...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!adminRole) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
