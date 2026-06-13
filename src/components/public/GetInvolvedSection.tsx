import { Handshake, Heart, School, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'
import type { GetInvolvedContent } from '@/lib/getInvolvedContent'

export type GetInvolvedSectionProps = {
  content: GetInvolvedContent
  showExpandedLink?: boolean
}

const cardVisuals: Record<string, { icon: typeof Users; accent: string }> = {
  parents: { icon: Users, accent: '#166534' },
  schools: { icon: School, accent: '#1d4ed8' },
  partners: { icon: Handshake, accent: '#b45309' },
  volunteers: { icon: Heart, accent: '#be185d' },
}

function InvolvedCardLink({ buttonLabel, buttonUrl }: { buttonLabel: string; buttonUrl: string }) {
  if (buttonUrl.startsWith('/')) {
    return (
      <Link to={buttonUrl}>
        <Button>{buttonLabel}</Button>
      </Link>
    )
  }

  return (
    <a href={buttonUrl}>
      <Button>{buttonLabel}</Button>
    </a>
  )
}

export function GetInvolvedSection({ content, showExpandedLink = false }: GetInvolvedSectionProps) {
  const { t } = useTranslation()

  const localizedButtonLabel = (cardId: string, label: string) => {
    const keyMap: Record<string, string> = {
      parents: 'getInvolved.parentsCta',
      schools: 'getInvolved.schoolsCta',
      partners: 'getInvolved.partnerCta',
      volunteers: 'getInvolved.volunteerCta',
    }
    const key = keyMap[cardId]
    return key ? t(key) : label
  }

  return (
    <SectionShell id="get-involved" variant="warm">
      <div className="container-custom">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <SectionHeading title={content.title} />
          {showExpandedLink ? (
            <Link to="/get-involved" style={{ color: 'var(--color-earth)', fontWeight: 600 }}>
              View all ways to help
            </Link>
          ) : null}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {content.cards.map((card) => {
            const visual = cardVisuals[card.id] ?? cardVisuals.parents!
            const Icon = visual.icon

            return (
              <article
                key={card.id}
                className="involved-card"
                style={{ '--involved-accent': visual.accent } as React.CSSProperties}
              >
                <Icon className="involved-card__icon" size={24} aria-hidden />
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{card.title}</h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{card.description}</p>
                <InvolvedCardLink
                  buttonLabel={localizedButtonLabel(card.id, card.buttonLabel)}
                  buttonUrl={card.buttonUrl}
                />
              </article>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
