import { describe, expect, it } from 'vitest'
import {
  buildAdminAlertHtml,
  buildParentConfirmationHtml,
  buildParentConfirmationSubject,
  buildRegistrationEmailPayloads,
  resolveRegistrationId,
} from './registrationEmail'

const sampleContext = {
  code: 'KG-2026-00001',
  childName: 'Aarav',
  parentName: 'Neha',
  email: 'neha@example.com',
  gameNames: ['Sack Race', 'Relay Race'],
  eventDate: 'March 20, 2026',
  siteName: 'Khelgram Foundation',
  status: 'confirmed' as const,
}

describe('registrationEmail', () => {
  it('resolves registration id from manual and webhook payloads', () => {
    expect(resolveRegistrationId({ registrationId: 'reg-1' })).toBe('reg-1')
    expect(resolveRegistrationId({ record: { id: 'reg-2' } })).toBe('reg-2')
    expect(resolveRegistrationId({ record: { id: 123 } })).toBeNull()
    expect(resolveRegistrationId({})).toBeNull()
  })

  it('builds parent confirmation content with brand styling', () => {
    expect(buildParentConfirmationSubject(sampleContext)).toContain('Registration confirmed')
    const html = buildParentConfirmationHtml(sampleContext)
    expect(html).toContain('#22c55e')
    expect(html).toContain('#a855f7')
    expect(html).toContain('KG-2026-00001')
    expect(html).toContain('Sack Race, Relay Race')
  })

  it('builds waitlist messaging for waitlisted registrations', () => {
    const html = buildParentConfirmationHtml({ ...sampleContext, status: 'waitlisted' })
    expect(html).toContain('waitlist')
    expect(buildParentConfirmationSubject({ ...sampleContext, status: 'waitlisted' })).toContain(
      'Waitlist received',
    )
  })

  it('builds parent and admin payloads', () => {
    const payloads = buildRegistrationEmailPayloads(
      sampleContext,
      'admin@example.com',
      'Khelgram <onboarding@resend.dev>',
    )

    expect(payloads).toHaveLength(2)
    expect(payloads[0]?.to).toEqual(['neha@example.com'])
    expect(payloads[1]?.to).toEqual(['admin@example.com'])
    expect(buildAdminAlertHtml(sampleContext)).toContain('neha@example.com')
  })

  it('skips admin payload when admin email is blank', () => {
    const payloads = buildRegistrationEmailPayloads(
      sampleContext,
      '   ',
      'Khelgram <onboarding@resend.dev>',
    )
    expect(payloads).toHaveLength(1)
  })
})
