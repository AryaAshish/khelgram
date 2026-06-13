export type StatCardProps = {
  value: string
  label: string
  variant?: 'default' | 'festival' | 'impact'
}

export function StatCard({ value, label, variant = 'default' }: StatCardProps) {
  return (
    <article className="stat-card" data-variant={variant}>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </article>
  )
}
