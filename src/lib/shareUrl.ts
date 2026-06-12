export const REGISTRATION_PATH = '/register'

export function getRegistrationShareUrl(
  origin = typeof window !== 'undefined' ? window.location.origin : '',
) {
  return `${origin}${REGISTRATION_PATH}`
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export type ShareRegistrationResult = 'shared' | 'copied' | 'cancelled' | 'failed'

export async function shareRegistrationUrl(
  title: string,
  origin = typeof window !== 'undefined' ? window.location.origin : '',
): Promise<ShareRegistrationResult> {
  const url = getRegistrationShareUrl(origin)
  const shareText = `Register for ${title}`

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: shareText, text: shareText, url })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  return (await copyTextToClipboard(url)) ? 'copied' : 'failed'
}
