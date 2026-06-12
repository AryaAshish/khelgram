import { programPillarLabel } from '@/lib/programPillars'
import type { Program } from '@/types/app.types'

export type ProgramsSectionProps = {
  title: string
  programs: Program[]
}

export function ProgramsSection({ title, programs }: ProgramsSectionProps) {
  return (
    <section className="programs-section" id="programs" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {programs.map((program) => (
            <article
              key={program.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{program.title}</h3>
                {program.icon ? (
                  <span aria-hidden="true" style={{ color: '#059669', fontWeight: 700 }}>
                    {program.icon}
                  </span>
                ) : null}
              </div>
              <p
                style={{
                  margin: 0,
                  color: '#059669',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {programPillarLabel(program.pillar)}
              </p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
                {program.description}
              </p>
              {program.ctaLabel && program.ctaUrl ? (
                <a
                  href={program.ctaUrl}
                  style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}
                >
                  {program.ctaLabel}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
