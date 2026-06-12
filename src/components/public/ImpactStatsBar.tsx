import type { ImpactStat } from '@/types/app.types'

export type ImpactStatsBarProps = {
  title?: string
  stats: ImpactStat[]
}

export function ImpactStatsBar({ title = 'Impact', stats }: ImpactStatsBarProps) {
  return (
    <section className="impact-stats-bar" id="impact" style={{ padding: '3rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {stats.map((stat) => (
            <article
              key={stat.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  margin: 0,
                  animation: 'fadeIn 0.6s ease',
                }}
              >
                {stat.value}
              </p>
              <p style={{ margin: 0, color: '#6b7280' }}>{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
