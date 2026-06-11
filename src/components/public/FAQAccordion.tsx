import { useState } from 'react'
import type { FaqItem } from '@/types/app.types'

export type FAQAccordionProps = {
  title: string
  items: FaqItem[]
}

export function FAQAccordion({ title, items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="faq-section" id="faq" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {items.map((item) => {
            const isOpen = openId === item.id

            return (
              <article
                key={item.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem',
                    background: '#f9fafb',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {item.question}
                </button>
                {isOpen ? (
                  <p style={{ margin: 0, padding: '1rem', color: '#374151' }}>{item.answer}</p>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
