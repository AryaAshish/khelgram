import { visualAssets } from '@/fixtures/visualAssets'

const benefits = [
  'Free grassroots sports day for children aged 6–14',
  'Coached activities, medals, and community celebration',
  'Safe, inclusive environment backed by Khelgram volunteers',
]

export function RegisterBenefitsPanel() {
  return (
    <aside className="register-benefits" aria-label="Why join Khel 2026">
      <div className="register-benefits__media">
        <img
          src={visualAssets.festivalAction.url}
          alt={visualAssets.festivalAction.alt}
          loading="lazy"
          className="register-benefits__image"
        />
      </div>
      <h3 className="register-benefits__title">Why join Khel 2026</h3>
      <ul className="register-benefits__list">
        {benefits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <blockquote className="register-benefits__quote">
        <p>&ldquo;My daughter found confidence and friends through Khelgram.&rdquo;</p>
        <footer>— Meera, parent volunteer</footer>
      </blockquote>
    </aside>
  )
}
