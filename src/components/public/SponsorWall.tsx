import type { Sponsor, SponsorTier } from '@/types/app.types'

export type SponsorWallProps = {
  title: string
  sponsors: Sponsor[]
}

const tierLabels: Record<SponsorTier, string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  community: 'Community',
}

const tierOrder: SponsorTier[] = ['platinum', 'gold', 'silver', 'community']

export function SponsorWall({ title, sponsors }: SponsorWallProps) {
  const grouped = tierOrder
    .map((tier) => ({
      tier,
      items: sponsors.filter((sponsor) => sponsor.tier === tier),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <section className="sponsors-section" id="sponsors" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {grouped.map((group) => (
            <div key={group.tier}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                {tierLabels[group.tier]}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {group.items.map((sponsor) => {
                  const content = sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      style={{ maxHeight: '48px', maxWidth: '140px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 600 }}>{sponsor.name}</span>
                  )

                  return sponsor.website ? (
                    <a
                      key={sponsor.id}
                      href={sponsor.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={sponsor.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                      }}
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
