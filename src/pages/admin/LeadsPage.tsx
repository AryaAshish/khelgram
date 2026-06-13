import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminLeads, useExportLeads } from '@/hooks/useLeads'
import type { InquiryLeadFilters, InquiryLeadStatus, InquiryLeadType } from '@/types/app.types'

const typeOptions: Array<InquiryLeadType | ''> = ['', 'partner', 'volunteer']
const statusOptions: Array<InquiryLeadStatus | ''> = ['', 'new', 'contacted', 'closed']

export function LeadsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<InquiryLeadType | ''>('')
  const [status, setStatus] = useState<InquiryLeadStatus | ''>('')

  const filters = useMemo<InquiryLeadFilters>(
    () => ({
      search,
      type: type || undefined,
      status: status || undefined,
    }),
    [search, type, status],
  )

  const { leads, isLoading } = useAdminLeads(filters)
  const exportLeads = useExportLeads(filters)

  return (
    <section aria-label="Admin leads">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Leads</h2>
        <Button onClick={() => exportLeads.mutate()} disabled={exportLeads.isPending}>
          {exportLeads.isPending ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <Label htmlFor="lead-search">Search</Label>
          <Input
            id="lead-search"
            placeholder="Name, email, or message"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lead-type-filter">Type</Label>
          <select
            id="lead-type-filter"
            value={type}
            onChange={(event) => setType(event.target.value as InquiryLeadType | '')}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
            }}
          >
            {typeOptions.map((option) => (
              <option key={option || 'all'} value={option}>
                {option ? option : 'All types'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="lead-status-filter">Status</Label>
          <select
            id="lead-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value as InquiryLeadStatus | '')}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
            }}
          >
            {statusOptions.map((option) => (
              <option key={option || 'all'} value={option}>
                {option ? option : 'All statuses'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? <p>Loading leads...</p> : null}

      {!isLoading && leads.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No leads match the current filters.</p>
      ) : null}

      {!isLoading && leads.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem' }}>Type</th>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Organization</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem' }}>{lead.type}</td>
                  <td style={{ padding: '0.75rem' }}>{lead.name}</td>
                  <td style={{ padding: '0.75rem' }}>{lead.email}</td>
                  <td style={{ padding: '0.75rem' }}>{lead.organization ?? '—'}</td>
                  <td style={{ padding: '0.75rem' }}>{lead.status}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
