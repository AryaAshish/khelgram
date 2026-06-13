import { describe, expect, it } from 'vitest'
import { donateLeadSchema } from './lead.schema'

describe('donateLeadSchema', () => {
  it('accepts email-only contact', () => {
    const result = donateLeadSchema.safeParse({
      email: 'donor@example.com',
      phone: '',
      message: 'Monthly support',
    })

    expect(result.success).toBe(true)
  })

  it('accepts phone-only contact', () => {
    const result = donateLeadSchema.safeParse({
      email: '',
      phone: '9876543210',
      message: '',
    })

    expect(result.success).toBe(true)
  })

  it('rejects when both email and phone are missing', () => {
    const result = donateLeadSchema.safeParse({
      email: '',
      phone: '',
      message: 'Interested',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid email when provided', () => {
    const result = donateLeadSchema.safeParse({
      email: 'not-an-email',
      phone: '',
      message: '',
    })

    expect(result.success).toBe(false)
  })
})
