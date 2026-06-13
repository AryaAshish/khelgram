import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSubmitLead } from '@/hooks/useLeads'
import type { InquiryLeadType } from '@/types/app.types'

export type LeadInquiryFormProps = {
  type: InquiryLeadType
  title: string
  description: string
  showOrganization?: boolean
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  message: '',
}

export function LeadInquiryForm({
  type,
  title,
  description,
  showOrganization = false,
}: LeadInquiryFormProps) {
  const submitLead = useSubmitLead(type)
  const [form, setForm] = useState(emptyForm)
  const sectionId = type === 'partner' ? 'partner-inquiry' : 'volunteer-signup'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitLead.mutateAsync(form)
    setForm(emptyForm)
  }

  return (
    <section
      id={sectionId}
      aria-label={title}
      style={{
        padding: '2rem 0',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <div className="container-custom" style={{ maxWidth: '720px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>{description}</p>
        <form
          onSubmit={handleSubmit}
          aria-label={`${title} form`}
          style={{ display: 'grid', gap: '0.75rem' }}
        >
          <div>
            <Label htmlFor={`${sectionId}-name`}>Name</Label>
            <Input
              id={`${sectionId}-name`}
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor={`${sectionId}-email`}>Email</Label>
            <Input
              id={`${sectionId}-email`}
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, email: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor={`${sectionId}-phone`}>Phone (optional)</Label>
            <Input
              id={`${sectionId}-phone`}
              value={form.phone}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, phone: event.target.value }))
              }
            />
          </div>
          {showOrganization ? (
            <div>
              <Label htmlFor={`${sectionId}-organization`}>Organization</Label>
              <Input
                id={`${sectionId}-organization`}
                value={form.organization}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, organization: event.target.value }))
                }
                required
              />
            </div>
          ) : null}
          <div>
            <Label htmlFor={`${sectionId}-message`}>Message</Label>
            <textarea
              id={`${sectionId}-message`}
              value={form.message}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, message: event.target.value }))
              }
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
              }}
            />
          </div>
          <Button type="submit" disabled={submitLead.isPending}>
            {submitLead.isPending ? 'Submitting...' : 'Submit inquiry'}
          </Button>
        </form>
      </div>
    </section>
  )
}
