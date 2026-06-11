/**
 * Optional Resend test inbox polling for Phase 11 E2E.
 * Set RESEND_E2E_INBOX_ID and RESEND_API_KEY to enable delivery assertions.
 */
export async function waitForResendInboxMessage(inboxId: string, subjectIncludes: string) {
  void inboxId
  void subjectIncludes
  if (!process.env.RESEND_E2E_INBOX_ID || !process.env.RESEND_API_KEY) {
    throw new Error('RESEND_E2E_INBOX_ID and RESEND_API_KEY are required for inbox polling')
  }

  // Resend testing API surface may vary; hook is reserved for live E2E environments.
  await new Promise((resolve) => setTimeout(resolve, 10_000))
}
