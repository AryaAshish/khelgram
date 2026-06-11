import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import {
  buildRegistrationEmailPayloads,
  resolveRegistrationId,
  type RegistrationEmailContext,
  type ResendEmailPayload,
} from './registrationEmail.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type RegistrationRow = {
  id: string
  code: string
  child_name: string
  parent_name: string
  email: string
  status: string
  registration_games: Array<{
    games: { name: string } | { name: string }[] | null
  }> | null
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function getGameName(gameRelation: { name: string } | { name: string }[] | null): string {
  if (!gameRelation) {
    return 'Unknown game'
  }

  if (Array.isArray(gameRelation)) {
    return gameRelation[0]?.name ?? 'Unknown game'
  }

  return gameRelation.name
}

async function sendWithResend(payload: ResendEmailPayload, apiKey: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Resend API request failed')
  }
}

export async function handleSendRegistrationEmail(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as Record<string, unknown>
    const registrationId = resolveRegistrationId(body)

    if (!registrationId) {
      console.error('send-registration-email: missing registration id')
      return jsonResponse({ ok: false, error: 'Missing registration id' })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Khelgram <onboarding@resend.dev>'

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      console.error('send-registration-email: missing environment configuration')
      return jsonResponse({ ok: false, error: 'Email service is not configured' })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: registration, error: registrationError } = await supabase
      .from('registrations')
      .select(
        `
        id,
        code,
        child_name,
        parent_name,
        email,
        status,
        registration_games (
          games ( name )
        )
      `,
      )
      .eq('id', registrationId)
      .maybeSingle()

    if (registrationError || !registration) {
      console.error('send-registration-email: registration lookup failed', registrationError)
      return jsonResponse({ ok: false, error: 'Registration not found' })
    }

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_name', 'hero_event_date', 'event_date', 'admin_email'])

    if (settingsError) {
      console.error('send-registration-email: settings lookup failed', settingsError)
      return jsonResponse({ ok: false, error: 'Unable to load site settings' })
    }

    const settingsMap = Object.fromEntries(
      (settings ?? []).map((setting) => [setting.key, setting.value]),
    )

    const row = registration as RegistrationRow
    const emailContext: RegistrationEmailContext = {
      code: row.code,
      childName: row.child_name,
      parentName: row.parent_name,
      email: row.email,
      gameNames: (row.registration_games ?? []).map((entry) => getGameName(entry.games)),
      eventDate: settingsMap.hero_event_date ?? settingsMap.event_date ?? 'To Be Announced',
      siteName: settingsMap.site_name ?? 'Khelgram Foundation',
      status: row.status as RegistrationEmailContext['status'],
    }

    const payloads = buildRegistrationEmailPayloads(
      emailContext,
      settingsMap.admin_email ?? '',
      fromEmail,
    )

    for (const payload of payloads) {
      await sendWithResend(payload, resendApiKey)
    }

    return jsonResponse({ ok: true, sent: payloads.length })
  } catch (error) {
    console.error('send-registration-email: unexpected error', error)
    return jsonResponse({ ok: false, error: 'Unable to send registration email' })
  }
}

if (import.meta.main) {
  Deno.serve(handleSendRegistrationEmail)
}
