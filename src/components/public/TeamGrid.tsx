import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { TeamMember } from '@/types/app.types'

export type TeamGridProps = {
  title: string
  members: TeamMember[]
}

export function TeamGrid({ title, members }: TeamGridProps) {
  return (
    <SectionShell id="team" variant="warm">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {members.map((member) => (
            <article key={member.id} className="card-elevated" style={{ padding: '1rem' }}>
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.75rem',
                  }}
                />
              ) : null}
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem' }}>{member.name}</h3>
              <p style={{ margin: '0 0 0.5rem', color: 'var(--color-earth)', fontWeight: 600 }}>
                {member.role}
              </p>
              {member.bio ? (
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  {member.bio}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
