import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'

export type ContactSectionProps = {
  title: string
  address: string
  phone: string
  email: string
}

export function ContactSection({ title, address, phone, email }: ContactSectionProps) {
  return (
    <SectionShell id="contact" variant="warm">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div className="card-elevated" style={{ padding: '1.25rem', maxWidth: '640px' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Address:</strong> {address}
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Phone:</strong>{' '}
            <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'var(--color-text)' }}>
              {phone}
            </a>
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${email}`} style={{ color: 'var(--color-text)' }}>
              {email}
            </a>
          </p>
        </div>
      </div>
    </SectionShell>
  )
}
