import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'

export type EventRegisterCtaProps = {
  title: string
  description: string
  buttonLabel: string
  registerPath?: string
  urgencyCopy?: string
}

export function EventRegisterCta({
  title,
  description,
  buttonLabel,
  registerPath = '/register',
  urgencyCopy = 'Spots fill quickly — register your child today.',
}: EventRegisterCtaProps) {
  return (
    <SectionShell id="register" variant="festival" className="event-register-cta">
      <div className="container-custom event-register-cta__inner">
        <SectionHeading eyebrow={urgencyCopy} title={title} subtitle={description} />
        <Link to={registerPath}>
          <Button variant="festival">{buttonLabel}</Button>
        </Link>
      </div>
    </SectionShell>
  )
}
