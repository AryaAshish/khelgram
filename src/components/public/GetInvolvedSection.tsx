import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { GetInvolvedContent } from '@/lib/getInvolvedContent'

export type GetInvolvedSectionProps = {
  content: GetInvolvedContent
  showExpandedLink?: boolean
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
    <section className="get-involved-section" id="get-involved" style={{ padding: '4rem 0' }}>
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
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{content.title}</h2>
          {showExpandedLink ? (
            <Link to="/get-involved" style={{ color: '#059669', fontWeight: 600 }}>
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
          {content.cards.map((card) => (
            <article
              key={card.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{card.title}</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>{card.description}</p>
              <InvolvedCardLink
                buttonLabel={localizedButtonLabel(card.id, card.buttonLabel)}
                buttonUrl={card.buttonUrl}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
