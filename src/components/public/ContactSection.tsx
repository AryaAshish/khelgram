export type ContactSectionProps = {
  title: string
  address: string
  phone: string
  email: string
}

export function ContactSection({ title, address, phone, email }: ContactSectionProps) {
  return (
    <section className="contact-section" id="contact" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Address:</strong> {address}
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Phone:</strong>{' '}
          <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: '#1f2937' }}>
            {phone}
          </a>
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${email}`} style={{ color: '#1f2937' }}>
            {email}
          </a>
        </p>
      </div>
    </section>
  )
}
