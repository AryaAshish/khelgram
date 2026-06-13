import { describe, expect, it } from 'vitest'
import { getSupportContent } from './supportContent'

describe('getSupportContent', () => {
  it('returns default support content when settings are empty', () => {
    const content = getSupportContent({})

    expect(content.title).toBe('Support Our Mission')
    expect(content.donateUrl).toBe('https://khelgram.org/donate')
    expect(content.fundsUsage).toHaveLength(3)
    expect(content.donateQrImage).toBeUndefined()
  })

  it('parses CMS overrides and funds usage lines', () => {
    const content = getSupportContent({
      support_title: 'Donate',
      support_description: 'Help us grow.',
      donate_url: 'https://example.org/give',
      donate_qr_image: 'https://example.org/qr.png',
      support_funds_usage: 'Coaching\n\nEquipment',
    })

    expect(content).toMatchObject({
      title: 'Donate',
      description: 'Help us grow.',
      donateUrl: 'https://example.org/give',
      donateQrImage: 'https://example.org/qr.png',
      fundsUsage: ['Coaching', 'Equipment'],
    })
  })
})
