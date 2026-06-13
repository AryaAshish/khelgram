import type { OrgRegion } from '@/lib/orgRegions'

export type ReachSectionProps = {
  title: string
  regions: OrgRegion[]
}

export function ReachSection({ title, regions }: ReachSectionProps) {
  return (
    <section className="reach-section" id="reach" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {regions.map((region) => (
            <article
              key={region.name}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.125rem' }}>{region.name}</h3>
              <p style={{ margin: '0 0 0.5rem', color: '#059669', fontWeight: 600 }}>
                {region.states.join(', ')}
              </p>
              <p style={{ margin: 0, color: '#6b7280' }}>{region.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
