import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { AnimatedStatValue } from '@/components/public/primitives/AnimatedStatValue'
import type { ImpactStat } from '@/types/app.types'

export type ImpactStatsBarProps = {
  title?: string
  subtitle?: string
  stats: ImpactStat[]
}

export function ImpactStatsBar({ title = 'Impact', subtitle, stats }: ImpactStatsBarProps) {
  return (
    <SectionShell id="impact" variant="impact-band" className="impact-stats-band">
      <div className="container-custom">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="impact-stats-grid">
          {stats.map((stat) => (
            <article key={stat.id} className="stat-card" data-variant="impact">
              <p className="stat-card__value">
                <AnimatedStatValue value={stat.value} />
              </p>
              <p className="stat-card__label">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
