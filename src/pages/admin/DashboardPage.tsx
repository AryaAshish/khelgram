import { useAdminPrograms } from '@/hooks/usePrograms'
import { useAdminLeads } from '@/hooks/useLeads'
import { useRegistrationCount } from '@/hooks/useRegistration'
import { useGames } from '@/hooks/useGames'

function SummaryCard({ title, value, detail }: { title: string; value: string; detail?: string }) {
  return (
    <article
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1rem',
        background: '#fff',
      }}
    >
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{title}</p>
      <p style={{ margin: '0.35rem 0 0', fontSize: '1.75rem', fontWeight: 700 }}>{value}</p>
      {detail ? <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>{detail}</p> : null}
    </article>
  )
}

export function DashboardPage() {
  const { data: programs = [] } = useAdminPrograms()
  const { leads: openLeads } = useAdminLeads({ status: 'new' })
  const { data: registrationCount = 0 } = useRegistrationCount()
  const { games } = useGames()

  const publishedPrograms = programs.filter((program) => program.published).length
  const totalCapacity = games.reduce((sum, game) => sum + (game.capacity ?? 0), 0)
  const totalRegistered = games.reduce((sum, game) => sum + (game.registeredCount ?? 0), 0)

  return (
    <section aria-label="Admin dashboard">
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Dashboard</h2>
      <p style={{ color: '#6b7280', margin: '0 0 1.5rem' }}>
        Organization and Khel 2026 activity at a glance.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Organization</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <SummaryCard
              title="Published programs"
              value={String(publishedPrograms)}
              detail={`${programs.length} total programs`}
            />
            <SummaryCard
              title="Open leads"
              value={String(openLeads.length)}
              detail="Partner and volunteer inquiries"
            />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Khel 2026</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <SummaryCard
              title="Registrations"
              value={String(registrationCount)}
              detail="Confirmed and waitlisted entries"
            />
            <SummaryCard
              title="Game capacity"
              value={
                totalCapacity > 0 ? `${totalRegistered}/${totalCapacity}` : String(totalRegistered)
              }
              detail={`${games.length} games configured`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
