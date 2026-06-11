export const eventStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'pre_registration', label: 'Pre-registration' },
  { value: 'registration_open', label: 'Registration open' },
  { value: 'registration_closed', label: 'Registration closed' },
  { value: 'completed', label: 'Completed' },
] as const

export type EventStatus = (typeof eventStatusOptions)[number]['value']

export function isRegistrationAllowed(status: string): boolean {
  return status === 'registration_open' || status === 'pre_registration'
}
