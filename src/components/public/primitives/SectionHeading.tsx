export type SectionHeadingProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = 'left',
  as = 'h2',
}: SectionHeadingProps) {
  const TitleTag = as
  return (
    <header
      className={align === 'center' ? 'section-heading section-heading--center' : 'section-heading'}
    >
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <TitleTag className={as === 'h1' ? 'heading-display' : 'section-heading__title'}>
        {title}
      </TitleTag>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </header>
  )
}
