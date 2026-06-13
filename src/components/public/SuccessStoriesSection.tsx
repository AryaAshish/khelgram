import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { SuccessStory } from '@/types/app.types'
import { visualAssets } from '@/fixtures/visualAssets'

export type SuccessStoriesSectionProps = {
  title: string
  stories: SuccessStory[]
}

export function SuccessStoriesSection({ title, stories }: SuccessStoriesSectionProps) {
  if (stories.length === 0) {
    return null
  }

  const [featured, ...rest] = stories
  const featuredImage = featured.imageUrl ?? visualAssets.girlsSports.url

  return (
    <SectionShell id="success-stories" variant="default">
      <div className="container-custom stories-layout">
        <SectionHeading title={title} />
        <article className="story-featured">
          <img
            src={featuredImage}
            alt={featured.title}
            className="story-featured__image"
            loading="lazy"
          />
          <div className="story-featured__body">
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{featured.title}</h3>
            <p className="story-quote">&ldquo;{featured.summary}&rdquo;</p>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{featured.story}</p>
          </div>
        </article>
        {rest.length > 0 ? (
          <div className="stories-grid">
            {rest.map((story) => (
              <article key={story.id} className="card-elevated" style={{ padding: '1.25rem' }}>
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.75rem',
                    }}
                    loading="lazy"
                  />
                ) : null}
                <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.125rem' }}>{story.title}</h3>
                <p style={{ margin: 0, color: 'var(--color-earth)', fontWeight: 600 }}>
                  {story.summary}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </SectionShell>
  )
}
