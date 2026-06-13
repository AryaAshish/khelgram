import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
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
    <SectionShell id="sponsors" variant="warm">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {grouped.map((group) => (
            <div key={group.tier}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                {tierLabels[group.tier]}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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

                  const shell = (
                    <div className="card-elevated" style={{ padding: '0.75rem 1rem' }}>
                      {content}
                    </div>
                  )

                  return sponsor.website ? (
                    <a
                      key={sponsor.id}
                      href={sponsor.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {shell}
                    </a>
                  ) : (
                    <div key={sponsor.id}>{shell}</div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
