import { createElement, useState } from 'react'
import { Handshake, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSubmitLead } from '@/hooks/useLeads'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import type { InquiryLeadType } from '@/types/app.types'

export type LeadInquiryFormProps = {
  type: Extract<InquiryLeadType, 'partner' | 'volunteer'>
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

const formMeta: Record<
  Extract<InquiryLeadType, 'partner' | 'volunteer'>,
  { icon: typeof Handshake; accent: string; bullets: string[] }
> = {
  partner: {
    icon: Handshake,
    accent: '#b45309',
    bullets: [
      'Share sponsorship, equipment, or outreach support',
      'We respond within 3–5 working days',
      'Tell us your organization and goals',
    ],
  },
  volunteer: {
    icon: Heart,
    accent: '#be185d',
    bullets: [
      'Help at Khel 2026, training camps, or village sports days',
      'Flexible weekend and event-day roles',
      'No prior coaching experience required',
    ],
  },
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
  const meta = formMeta[type]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitLead.mutateAsync(form)
    setForm(emptyForm)
  }

  return (
    <SectionShell id={sectionId} variant="warm" className="lead-inquiry-form">
      <div className="container-custom lead-inquiry-form__inner">
        <div
          className="lead-inquiry-form__header"
          style={{ '--lead-accent': meta.accent } as React.CSSProperties}
        >
          {createElement(meta.icon, { className: 'lead-inquiry-form__icon', 'aria-hidden': true })}
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <ul className="lead-inquiry-form__bullets">
          {meta.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <form
          onSubmit={handleSubmit}
          aria-label={`${title} form`}
          className="lead-inquiry-form__fields"
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
              className="lead-inquiry-form__textarea"
            />
          </div>
          <Button type="submit" disabled={submitLead.isPending}>
            {submitLead.isPending ? 'Submitting...' : 'Submit inquiry'}
          </Button>
        </form>
      </div>
    </SectionShell>
  )
}
