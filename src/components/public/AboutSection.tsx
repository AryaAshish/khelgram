import type { AboutContent, ImpactStat } from '@/types/app.types'

export type AboutSectionProps = {
  content: AboutContent
  impactStats: ImpactStat[]
}

export function AboutSection({ content, impactStats }: AboutSectionProps) {
  return (
    <section className="about-section" id="about" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Khelgram Foundation</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>Mission:</strong> {content.mission}
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>Vision:</strong> {content.vision}
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Values:</strong>
        </p>
        <ul style={{ marginTop: 0, paddingLeft: '1.25rem' }}>
          {content.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            marginTop: '1.5rem',
          }}
        >
          {impactStats.map((stat) => (
            <article
              key={stat.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <p style={{ fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>{stat.value}</p>
              <p style={{ margin: 0, color: '#6b7280' }}>{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
