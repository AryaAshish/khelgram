export type RegistrationEmailContext = {
  code: string
  childName: string
  parentName: string
  email: string
  gameNames: string[]
  eventDate: string
  siteName: string
  status: 'confirmed' | 'waitlisted' | 'cancelled'
}

const BRAND_GREEN = '#22c55e'
const BRAND_PURPLE = '#a855f7'

export function resolveRegistrationId(body: Record<string, unknown>): string | null {
  if (typeof body.registrationId === 'string' && body.registrationId.length > 0) {
    return body.registrationId
  }

  const record = body.record
  if (record && typeof record === 'object' && 'id' in record) {
    const id = (record as { id?: unknown }).id
    if (typeof id === 'string' && id.length > 0) {
      return id
    }
  }

  return null
}

function wrapEmailHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;padding:24px;">
      <tr>
        <td style="padding:24px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
          <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND_PURPLE};">${title}</h1>
          ${body}
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function buildParentConfirmationSubject(ctx: RegistrationEmailContext): string {
  const prefix = ctx.status === 'waitlisted' ? 'Waitlist received' : 'Registration confirmed'
  return `${prefix} — ${ctx.siteName}`
}

export function buildParentConfirmationHtml(ctx: RegistrationEmailContext): string {
  const statusLine =
    ctx.status === 'waitlisted'
      ? `<p style="margin:0 0 16px;color:#b45309;font-weight:600;">You are on the waitlist. We will contact you if a spot opens.</p>`
      : `<p style="margin:0 0 16px;color:${BRAND_GREEN};font-weight:600;">Your registration is confirmed.</p>`

  const body = `
    <p style="margin:0 0 12px;">Hi ${ctx.parentName},</p>
    ${statusLine}
    <p style="margin:0 0 8px;"><strong>Child:</strong> ${ctx.childName}</p>
    <p style="margin:0 0 8px;"><strong>Registration code:</strong> ${ctx.code}</p>
    <p style="margin:0 0 8px;"><strong>Events:</strong> ${ctx.gameNames.join(', ')}</p>
    <p style="margin:0 0 8px;"><strong>Event date:</strong> ${ctx.eventDate}</p>
    <p style="margin:16px 0 0;color:#6b7280;">Thank you for registering with ${ctx.siteName}.</p>
  `

  return wrapEmailHtml(buildParentConfirmationSubject(ctx), body)
}

export function buildAdminAlertSubject(ctx: RegistrationEmailContext): string {
  return `New registration ${ctx.code} — ${ctx.siteName}`
}

export function buildAdminAlertHtml(ctx: RegistrationEmailContext): string {
  const body = `
    <p style="margin:0 0 12px;">A new registration was submitted.</p>
    <p style="margin:0 0 8px;"><strong>Code:</strong> ${ctx.code}</p>
    <p style="margin:0 0 8px;"><strong>Child:</strong> ${ctx.childName}</p>
    <p style="margin:0 0 8px;"><strong>Parent:</strong> ${ctx.parentName}</p>
    <p style="margin:0 0 8px;"><strong>Email:</strong> ${ctx.email}</p>
    <p style="margin:0 0 8px;"><strong>Status:</strong> ${ctx.status}</p>
    <p style="margin:0 0 8px;"><strong>Events:</strong> ${ctx.gameNames.join(', ')}</p>
  `

  return wrapEmailHtml(buildAdminAlertSubject(ctx), body)
}

export type ResendEmailPayload = {
  from: string
  to: string[]
  subject: string
  html: string
}

export function buildRegistrationEmailPayloads(
  ctx: RegistrationEmailContext,
  adminEmail: string,
  fromEmail: string,
): ResendEmailPayload[] {
  const payloads: ResendEmailPayload[] = [
    {
      from: fromEmail,
      to: [ctx.email],
      subject: buildParentConfirmationSubject(ctx),
      html: buildParentConfirmationHtml(ctx),
    },
  ]

  if (adminEmail.trim().length > 0) {
    payloads.push({
      from: fromEmail,
      to: [adminEmail],
      subject: buildAdminAlertSubject(ctx),
      html: buildAdminAlertHtml(ctx),
    })
  }

  return payloads
}
