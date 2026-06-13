import { Button } from '@/components/ui/button'
import type { SupportContent } from '@/lib/supportContent'

export type SupportSectionProps = {
  content: SupportContent
}

export function SupportSection({ content }: SupportSectionProps) {
  return (
    <section className="support-section" id="support" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{content.title}</h2>
        <p style={{ color: '#6b7280', maxWidth: '720px', marginBottom: '1.25rem' }}>
          {content.description}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            alignItems: 'start',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>How funds are used</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151' }}>
              {content.fundsUsage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <a href={content.donateUrl} target="_blank" rel="noreferrer">
                <Button>Donate now</Button>
              </a>
            </div>
          </div>
          {content.donateQrImage ? (
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Scan to donate</h3>
              <img
                src={content.donateQrImage}
                alt="Donation QR code"
                style={{ maxWidth: '220px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
