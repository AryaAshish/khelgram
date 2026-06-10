import type { CSSProperties } from 'react'

export type SectionSkeletonProps = {
  title: string
}

const skeletonStyle: CSSProperties = {
  background: '#e5e7eb',
  borderRadius: '0.5rem',
  animation: 'pulse 1.5s ease-in-out infinite',
}

export function SectionSkeleton({ title }: SectionSkeletonProps) {
  const pulseDuration = title.length > 20 ? '1.6s' : '1.5s'

  return (
    <section aria-label={`${title} loading`} style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <div
          style={{
            ...skeletonStyle,
            width: '280px',
            height: '36px',
            marginBottom: '1rem',
            animationDuration: pulseDuration,
          }}
        />
        <div style={{ ...skeletonStyle, width: '100%', height: '16px', marginBottom: '0.75rem' }} />
        <div style={{ ...skeletonStyle, width: '90%', height: '16px', marginBottom: '1.5rem' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div style={{ ...skeletonStyle, height: '140px' }} />
          <div style={{ ...skeletonStyle, height: '140px' }} />
          <div style={{ ...skeletonStyle, height: '140px' }} />
        </div>
      </div>
    </section>
  )
}
