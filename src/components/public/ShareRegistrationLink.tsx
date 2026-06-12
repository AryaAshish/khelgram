import { Link2, Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { copyTextToClipboard, getRegistrationShareUrl, shareRegistrationUrl } from '@/lib/shareUrl'

export type ShareRegistrationLinkProps = {
  formTitle: string
  shareUrl?: string
}

export function ShareRegistrationLink({
  formTitle,
  shareUrl = getRegistrationShareUrl(),
}: ShareRegistrationLinkProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(shareUrl)
    if (copied) {
      toast.success('Registration link copied')
    } else {
      toast.error('Unable to copy link')
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const result = await shareRegistrationUrl(formTitle, new URL(shareUrl).origin)
      if (result === 'shared') {
        toast.success('Share dialog opened')
      } else if (result === 'copied') {
        toast.success('Registration link copied')
      } else if (result === 'failed') {
        toast.error('Unable to share registration link')
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center',
        marginBottom: '1rem',
      }}
    >
      <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Share this form:</span>
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleCopy()}
        aria-label="Copy registration link"
      >
        <Link2 aria-hidden size={16} style={{ marginRight: '0.35rem' }} />
        Copy link
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleShare()}
        disabled={isSharing}
        aria-label="Share registration form"
      >
        <Share2 aria-hidden size={16} style={{ marginRight: '0.35rem' }} />
        {isSharing ? 'Sharing...' : 'Share'}
      </Button>
    </div>
  )
}
