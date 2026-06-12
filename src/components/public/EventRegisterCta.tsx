import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export type EventRegisterCtaProps = {
  title: string
  description: string
  buttonLabel: string
  registerPath?: string
}

export function EventRegisterCta({
  title,
  description,
  buttonLabel,
  registerPath = '/register',
}: EventRegisterCtaProps) {
  return (
    <section className="event-register-cta" id="register" style={{ padding: '4rem 0' }}>
      <div className="container-custom" style={{ maxWidth: '720px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ color: '#374151', marginBottom: '1.5rem' }}>{description}</p>
        <Link to={registerPath}>
          <Button>{buttonLabel}</Button>
        </Link>
      </div>
    </section>
  )
}
