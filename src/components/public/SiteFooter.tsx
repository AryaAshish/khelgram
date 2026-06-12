import { Link } from 'react-router-dom'

export type SiteFooterProps = {
  description: string
  copyright: string
}

export function SiteFooter({ description, copyright }: SiteFooterProps) {
  return (
    <footer className="site-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '2rem 0' }}>
      <div className="container-custom">
        <p style={{ marginTop: 0 }}>{description}</p>
        <p style={{ marginBottom: 0, color: '#6b7280' }}>
          {copyright}{' '}
          <Link
            to="/admin"
            style={{ color: '#6b7280', marginLeft: '0.5rem' }}
            aria-label="Admin sign in"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  )
}
