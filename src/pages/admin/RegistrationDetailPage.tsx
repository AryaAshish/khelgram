import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRegistrationDetail, useUpdateRegistrationStatus } from '@/hooks/useAdminRegistrations'
import type { RegistrationStatus } from '@/types/app.types'

const statusOptions: RegistrationStatus[] = ['confirmed', 'waitlisted', 'cancelled']

export function RegistrationDetailPage() {
  const { id = '' } = useParams()
  const { data: registration, isLoading } = useRegistrationDetail(id)
  const updateStatus = useUpdateRegistrationStatus()

  if (isLoading) {
    return <p>Loading registration details...</p>
  }

  if (!registration) {
    return (
      <section>
        <p>Registration not found.</p>
        <Link to="/admin/registrations">Back to registrations</Link>
      </section>
    )
  }

  return (
    <section aria-label="Registration detail">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/registrations">← Back to registrations</Link>
      </div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{registration.code}</h2>
      <dl style={{ display: 'grid', gap: '0.75rem', maxWidth: '640px' }}>
        <div>
          <dt style={{ fontWeight: 700 }}>Child Name</dt>
          <dd style={{ margin: 0 }}>{registration.childName}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Age</dt>
          <dd style={{ margin: 0 }}>{registration.age}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Parent Name</dt>
          <dd style={{ margin: 0 }}>{registration.parentName}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Email</dt>
          <dd style={{ margin: 0 }}>{registration.email}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Phone</dt>
          <dd style={{ margin: 0 }}>{registration.phone}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Games</dt>
          <dd style={{ margin: 0 }}>{registration.gameNames.join(', ')}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 700 }}>Registered At</dt>
          <dd style={{ margin: 0 }}>{new Date(registration.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      <div style={{ marginTop: '1.5rem', maxWidth: '240px' }}>
        <Label htmlFor="registration-status">Status</Label>
        <select
          id="registration-status"
          value={registration.status}
          onChange={(event) =>
            updateStatus.mutate({
              id: registration.id,
              status: event.target.value as RegistrationStatus,
            })
          }
          disabled={updateStatus.isPending}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
          }}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="outline"
        style={{ marginTop: '1rem' }}
        onClick={() =>
          updateStatus.mutate({
            id: registration.id,
            status: registration.status,
          })
        }
        disabled={updateStatus.isPending}
      >
        Refresh Status
      </Button>
    </section>
  )
}
