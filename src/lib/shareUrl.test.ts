import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyTextToClipboard, getRegistrationShareUrl, shareRegistrationUrl } from './shareUrl'

describe('shareUrl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds registration share URL from origin', () => {
    expect(getRegistrationShareUrl('https://khelgram.example')).toBe(
      'https://khelgram.example/register',
    )
  })

  it('copies text to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await expect(copyTextToClipboard('https://example.com/register')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('https://example.com/register')
  })

  it('falls back to copy when Web Share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await expect(
      shareRegistrationUrl('Register Your Child', 'https://khelgram.example'),
    ).resolves.toBe('copied')
  })

  it('returns failed when clipboard copy fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('denied')),
      },
    })

    await expect(copyTextToClipboard('https://example.com/register')).resolves.toBe(false)
    await expect(shareRegistrationUrl('Register', 'https://khelgram.example')).resolves.toBe(
      'failed',
    )
  })

  it('falls back to copy when share throws a non-abort error', async () => {
    const share = vi.fn().mockRejectedValue(new Error('not supported'))
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      share,
      clipboard: { writeText },
    })

    await expect(shareRegistrationUrl('Register', 'https://khelgram.example')).resolves.toBe(
      'copied',
    )
  })

  it('returns cancelled when share dialog is dismissed', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'))
    vi.stubGlobal('navigator', {
      share,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    await expect(shareRegistrationUrl('Register', 'https://khelgram.example')).resolves.toBe(
      'cancelled',
    )
  })

  it('uses Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', {
      share,
      clipboard: { writeText: vi.fn() },
    })

    await expect(
      shareRegistrationUrl('Register Your Child', 'https://khelgram.example'),
    ).resolves.toBe('shared')
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://khelgram.example/register' }),
    )
  })
})
