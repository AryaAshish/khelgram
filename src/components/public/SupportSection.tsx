import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'
import type { SupportContent } from '@/lib/supportContent'

export type SupportSectionProps = {
  content: SupportContent
}

function DonateButton({ href }: { href: string }) {
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        <Button>Donate now</Button>
      </a>
    )
  }

  if (href.startsWith('/') && !href.includes('#')) {
    return (
      <Link to={href}>
        <Button>Donate now</Button>
      </Link>
    )
  }

  return (
    <a href={href}>
      <Button>Donate now</Button>
    </a>
  )
}

export function SupportSection({ content }: SupportSectionProps) {
  return (
    <SectionShell id="support" variant="warm">
      <div className="container-custom">
        <SectionHeading title={content.title} subtitle={content.description} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            alignItems: 'start',
          }}
        >
          <div className="card-elevated" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>How funds are used</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--color-text-subtle)' }}>
              {content.fundsUsage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <DonateButton href={content.donateUrl} />
            </div>
          </div>
          {content.donateQrImage ? (
            <div className="card-elevated" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Scan to donate</h3>
              <img
                src={content.donateQrImage}
                alt="Donation QR code"
                style={{ maxWidth: '220px', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  )
}
