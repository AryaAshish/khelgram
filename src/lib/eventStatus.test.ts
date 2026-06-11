import { describe, expect, it } from 'vitest'
import { isRegistrationAllowed } from './eventStatus'

describe('eventStatus', () => {
  it('allows registration in pre-registration and open states', () => {
    expect(isRegistrationAllowed('pre_registration')).toBe(true)
    expect(isRegistrationAllowed('registration_open')).toBe(true)
  })

  it('blocks registration in other states', () => {
    expect(isRegistrationAllowed('draft')).toBe(false)
    expect(isRegistrationAllowed('registration_closed')).toBe(false)
    expect(isRegistrationAllowed('completed')).toBe(false)
  })
})
