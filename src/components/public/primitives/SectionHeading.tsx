export type SectionHeadingProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ title, subtitle, eyebrow, align = 'left' }: SectionHeadingProps) {
  return (
    <header
      className={align === 'center' ? 'section-heading section-heading--center' : 'section-heading'}
    >
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </header>
  )
}
