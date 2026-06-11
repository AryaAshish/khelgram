import type { TeamMember } from '@/types/app.types'

export type TeamGridProps = {
  title: string
  members: TeamMember[]
}

export function TeamGrid({ title, members }: TeamGridProps) {
  return (
    <section className="team-section" id="team" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {members.map((member) => (
            <article
              key={member.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem',
                    marginBottom: '0.75rem',
                  }}
                />
              ) : null}
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem' }}>{member.name}</h3>
              <p style={{ margin: '0 0 0.5rem', color: '#059669', fontWeight: 600 }}>
                {member.role}
              </p>
              {member.bio ? (
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>{member.bio}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
