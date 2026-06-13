import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { OrgRegion } from '@/lib/orgRegions'

export type ReachSectionProps = {
  title: string
  regions: OrgRegion[]
}

export function ReachSection({ title, regions }: ReachSectionProps) {
  return (
    <SectionShell id="reach" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {regions.map((region) => (
            <article key={region.name} className="card-elevated" style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.125rem' }}>{region.name}</h3>
              <p className="reach-badge">{region.states.join(', ')}</p>
              <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{region.description}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
