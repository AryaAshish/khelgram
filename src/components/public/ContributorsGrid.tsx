import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { Contributor } from '@/types/app.types'

export type ContributorsGridProps = {
  title: string
  contributors: Contributor[]
}

export function ContributorsGrid({ title, contributors }: ContributorsGridProps) {
  return (
    <SectionShell id="contributors" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {contributors.map((contributor) => (
            <article key={contributor.id} className="card-elevated" style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.125rem' }}>{contributor.name}</h3>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                {contributor.contribution}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
