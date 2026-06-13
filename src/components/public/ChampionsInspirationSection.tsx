import { championAthletes } from '@/fixtures/visualAssets'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'

export type ChampionsInspirationSectionProps = {
  title?: string
  subtitle?: string
}

export function ChampionsInspirationSection({
  title = 'Champions who inspire our villages',
  subtitle = 'Olympic and Commonwealth medallists remind every child that greatness can start on a village ground.',
}: ChampionsInspirationSectionProps) {
  return (
    <SectionShell id="champions" variant="default">
      <div className="container-custom">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="champions-grid">
          {championAthletes.map((athlete) => (
            <article key={athlete.name} className="champion-card card-elevated">
              <img
                src={athlete.url}
                alt={athlete.alt}
                loading="lazy"
                className="champion-card__image"
              />
              <div className="champion-card__body">
                <h3 className="champion-card__name">{athlete.name}</h3>
                <p className="champion-card__sport">{athlete.sport}</p>
                <p className="champion-card__credit">{athlete.credit}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
