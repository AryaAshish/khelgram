import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as shareUrlModule from '@/lib/shareUrl'
import { toast } from 'sonner'
import { ShareRegistrationLink } from './ShareRegistrationLink'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

describe('ShareRegistrationLink', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(toast.success).mockClear()
    vi.mocked(toast.error).mockClear()
  })

  it('copies registration link', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'copyTextToClipboard').mockResolvedValue(true)

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Copy registration link' }))
    expect(shareUrlModule.copyTextToClipboard).toHaveBeenCalledWith(
      'https://khelgram.example/register',
    )
    expect(toast.success).toHaveBeenCalledWith('Registration link copied')
  })

  it('shows error toast when copy fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'copyTextToClipboard').mockResolvedValue(false)

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Copy registration link' }))
    expect(toast.error).toHaveBeenCalledWith('Unable to copy link')
  })

  it('opens share flow', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'shareRegistrationUrl').mockResolvedValue('shared')

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share registration form' }))
    expect(shareUrlModule.shareRegistrationUrl).toHaveBeenCalledWith(
      'Register Your Child',
      'https://khelgram.example',
    )
    expect(toast.success).toHaveBeenCalledWith('Share dialog opened')
  })

  it('shows copied toast when share falls back to clipboard', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'shareRegistrationUrl').mockResolvedValue('copied')

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share registration form' }))
    expect(toast.success).toHaveBeenCalledWith('Registration link copied')
  })

  it('shows sharing state while share is in progress', async () => {
    const user = userEvent.setup()
    let resolveShare: (value: shareUrlModule.ShareRegistrationResult) => void = () => undefined
    vi.spyOn(shareUrlModule, 'shareRegistrationUrl').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveShare = resolve
        }),
    )

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share registration form' }))
    const shareButton = screen.getByRole('button', { name: 'Share registration form' })
    expect(shareButton).toHaveTextContent('Sharing...')
    expect(shareButton).toBeDisabled()

    resolveShare('shared')
    await screen.findByText('Share')
  })

  it('does not toast when share is cancelled', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'shareRegistrationUrl').mockResolvedValue('cancelled')

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share registration form' }))
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('shows error toast when share fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(shareUrlModule, 'shareRegistrationUrl').mockResolvedValue('failed')

    render(
      <ShareRegistrationLink
        formTitle="Register Your Child"
        shareUrl="https://khelgram.example/register"
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Share registration form' }))
    expect(toast.error).toHaveBeenCalledWith('Unable to share registration link')
  })
})
