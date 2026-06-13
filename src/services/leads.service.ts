import { supabase } from '@/lib/supabase'
import { SettingsError } from '@/lib/errors'
import type {
  InquiryLead,
  InquiryLeadFilters,
  InquiryLeadStatus,
  InquiryLeadType,
} from '@/types/app.types'
import type { Database } from '@/types/database.types'

type InquiryLeadRow = Database['public']['Tables']['inquiry_leads']['Row']

function mapLead(row: InquiryLeadRow): InquiryLead {
  return {
    id: row.id,
    type: row.type as InquiryLeadType,
    name: row.name,
    email: row.email ?? '',
    phone: row.phone ?? undefined,
    organization: row.organization ?? undefined,
    message: row.message,
    status: row.status as InquiryLeadStatus,
    createdAt: row.created_at,
  }
}

export async function submitLead(input: {
  type: InquiryLeadType
  name: string
  email?: string
  phone?: string
  organization?: string
  message?: string
}): Promise<InquiryLead> {
  const id = crypto.randomUUID()

  const { data, error } = await supabase
    .from('inquiry_leads')
    .insert({
      id,
      type: input.type,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      organization: input.organization ?? null,
      message: input.message ?? '',
    })
    .select('*')
    .single()

  if (error) {
    throw new SettingsError(error.message)
  }

  return mapLead(data)
}

export async function getLeads(): Promise<InquiryLead[]> {
  const { data, error } = await supabase
    .from('inquiry_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new SettingsError(error.message)
  }

  return (data ?? []).map(mapLead)
}

export function filterLeads(leads: InquiryLead[], filters: InquiryLeadFilters): InquiryLead[] {
  const search = filters.search?.trim().toLowerCase()

  return leads.filter((lead) => {
    if (filters.type && lead.type !== filters.type) {
      return false
    }

    if (filters.status && lead.status !== filters.status) {
      return false
    }

    if (search) {
      const haystack = [lead.name, lead.email, lead.phone, lead.organization, lead.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(search)) {
        return false
      }
    }

    return true
  })
}

export function formatLeadsForCsv(leads: InquiryLead[]): Record<string, string>[] {
  return leads.map((lead) => ({
    Type: lead.type,
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone ?? '',
    Organization: lead.organization ?? '',
    Message: lead.message,
    Status: lead.status,
    'Submitted At': new Date(lead.createdAt).toLocaleString(),
  }))
}
