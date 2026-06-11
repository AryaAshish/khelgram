import type { Contributor } from '@/types/app.types'

export type ContributorsGridProps = {
  title: string
  contributors: Contributor[]
}

export function ContributorsGrid({ title, contributors }: ContributorsGridProps) {
  return (
    <section className="contributors-section" id="contributors" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {contributors.map((contributor) => (
            <article
              key={contributor.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}
            >
              <p style={{ margin: '0 0 0.25rem', fontWeight: 700 }}>{contributor.name}</p>
              <p style={{ margin: 0, color: '#6b7280' }}>{contributor.contribution}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
