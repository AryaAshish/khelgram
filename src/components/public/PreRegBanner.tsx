export type PreRegBannerProps = {
  message: string
}

export function PreRegBanner({ message }: PreRegBannerProps) {
  return (
    <div
      role="status"
      style={{
        background: '#ecfdf5',
        borderBottom: '1px solid #a7f3d0',
        color: '#065f46',
        padding: '0.75rem 1rem',
        textAlign: 'center',
        fontWeight: 600,
      }}
    >
      {message}
    </div>
  )
}
