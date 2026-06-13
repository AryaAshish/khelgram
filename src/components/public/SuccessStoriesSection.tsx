import type { SuccessStory } from '@/types/app.types'

export type SuccessStoriesSectionProps = {
  title: string
  stories: SuccessStory[]
}

export function SuccessStoriesSection({ title, stories }: SuccessStoriesSectionProps) {
  return (
    <section className="success-stories-section" id="success-stories" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {stories.map((story) => (
            <article
              key={story.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              {story.imageUrl ? (
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  style={{ width: '100%', borderRadius: '0.5rem', objectFit: 'cover' }}
                />
              ) : null}
              <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{story.title}</h3>
              <p style={{ margin: 0, color: '#059669', fontWeight: 600 }}>{story.summary}</p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>{story.story}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
