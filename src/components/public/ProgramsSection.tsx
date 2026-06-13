import { programPillarLabel, programPillarVisuals } from '@/lib/programPillars'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { Program } from '@/types/app.types'

export type ProgramsSectionProps = {
  title: string
  programs: Program[]
}

export function ProgramsSection({ title, programs }: ProgramsSectionProps) {
  return (
    <SectionShell id="programs" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {programs.map((program) => {
            const visual = programPillarVisuals[program.pillar]
            const Icon = visual.icon

            return (
              <article
                key={program.id}
                className="program-card"
                style={
                  {
                    '--pillar-accent': visual.accent,
                    '--pillar-border': visual.border,
                  } as React.CSSProperties
                }
              >
                <div className="program-card__header">
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{program.title}</h3>
                  <Icon className="program-card__icon" size={22} aria-hidden />
                </div>
                <p className="program-card__pillar">{programPillarLabel(program.pillar)}</p>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  {program.description}
                </p>
                {program.ctaLabel && program.ctaUrl ? (
                  <a
                    href={program.ctaUrl}
                    style={{ color: visual.accent, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {program.ctaLabel}
                  </a>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
