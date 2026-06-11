import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import {
  buildParentConfirmationHtml,
  buildRegistrationEmailPayloads,
  resolveRegistrationId,
} from './registrationEmail.ts'

Deno.test('resolveRegistrationId accepts manual invoke payload', () => {
  assertEquals(resolveRegistrationId({ registrationId: 'reg-1' }), 'reg-1')
})

Deno.test('resolveRegistrationId accepts database webhook payload', () => {
  assertEquals(resolveRegistrationId({ record: { id: 'reg-webhook' } }), 'reg-webhook')
})

Deno.test('buildRegistrationEmailPayloads includes parent and admin emails', () => {
  const payloads = buildRegistrationEmailPayloads(
    {
      code: 'KG-2026-00001',
      childName: 'Aarav',
      parentName: 'Neha',
      email: 'parent@example.com',
      gameNames: ['Sack Race'],
      eventDate: 'March 20, 2026',
      siteName: 'Khelgram Foundation',
      status: 'confirmed',
    },
    'admin@example.com',
    'Khelgram <onboarding@resend.dev>',
  )

  assertEquals(payloads.length, 2)
  assert(payloads[0]?.html.includes('KG-2026-00001'))
  assert(
    buildParentConfirmationHtml({
      code: 'KG-2026-00001',
      childName: 'Aarav',
      parentName: 'Neha',
      email: 'parent@example.com',
      gameNames: ['Sack Race'],
      eventDate: 'March 20, 2026',
      siteName: 'Khelgram Foundation',
      status: 'waitlisted',
    }).includes('waitlist'),
  )
})
