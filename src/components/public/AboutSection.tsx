import type { AboutContent } from '@/types/app.types'

export type AboutSectionProps = {
  title: string
  content: AboutContent
}

export function AboutSection({ title, content }: AboutSectionProps) {
  return (
    <section className="about-section" id="about" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
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
      </div>
    </section>
  )
}
