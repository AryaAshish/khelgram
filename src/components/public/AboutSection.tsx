import type { AboutContent } from '@/types/app.types'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { visualAssets } from '@/fixtures/visualAssets'

export type AboutSectionProps = {
  title: string
  content: AboutContent
}

export function AboutSection({ title, content }: AboutSectionProps) {
  return (
    <SectionShell id="about" variant="warm">
      <div className="container-custom about-grid">
        <div>
          <SectionHeading title={title} />
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Mission:</strong> {content.mission}
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Vision:</strong> {content.vision}
          </p>
        </div>
        <div>
          <img
            src={visualAssets.aboutCommunity.url}
            alt={visualAssets.aboutCommunity.alt}
            className="about-image"
            loading="lazy"
          />
          <p style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }}>Values</p>
          <ul className="about-values" aria-label="Organization values">
            {content.values.map((value) => (
              <li key={value} className="about-value-chip">
                {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
