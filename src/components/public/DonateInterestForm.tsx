import { useState } from 'react'
import { IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSubmitLead } from '@/hooks/useLeads'
import { SectionShell } from '@/components/public/primitives/SectionShell'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

export type DonateInterestFormProps = {
  title?: string
  description?: string
}

export function DonateInterestForm({
  title = 'Share your contact details',
  description = 'Leave your email or phone number and we will call or write back within 2–3 working days to discuss how you can support Khelgram.',
}: DonateInterestFormProps) {
  const submitLead = useSubmitLead('donate')
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitLead.mutateAsync(form)
    setForm(emptyForm)
    setSubmitted(true)
  }

  return (
    <SectionShell
      id="donate-form"
      variant="warm"
      className="lead-inquiry-form donate-interest-form"
    >
      <div className="container-custom lead-inquiry-form__inner">
        <div
          className="lead-inquiry-form__header"
          style={{ '--lead-accent': '#15803d' } as React.CSSProperties}
        >
          <IndianRupee className="lead-inquiry-form__icon" aria-hidden="true" />
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <ul className="lead-inquiry-form__bullets">
          <li>Share your email or mobile number — at least one is required</li>
          <li>Add an optional note about how you would like to contribute</li>
          <li>Our team will call or email you back personally</li>
        </ul>
        {submitted ? (
          <div className="donate-interest-form__success" role="status" aria-live="polite">
            <strong>Thank you for your interest!</strong>
            <p>We received your details and will call or email you within 2–3 working days.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            aria-label="Donation interest form"
            className="lead-inquiry-form__fields"
          >
            <div>
              <Label htmlFor="donate-name">Name (optional)</Label>
              <Input
                id="donate-name"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="donate-email">Email</Label>
              <Input
                id="donate-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="donate-phone">Phone</Label>
              <Input
                id="donate-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, phone: event.target.value }))
                }
                autoComplete="tel"
              />
            </div>
            <p className="donate-interest-form__hint">
              Provide at least one contact method so we can reach you.
            </p>
            <div>
              <Label htmlFor="donate-message">How you would like to support (optional)</Label>
              <textarea
                id="donate-message"
                value={form.message}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, message: event.target.value }))
                }
                rows={4}
                className="lead-inquiry-form__textarea"
                placeholder="e.g. Monthly contribution, equipment sponsorship, or one-time gift"
              />
            </div>
            <Button type="submit" disabled={submitLead.isPending}>
              {submitLead.isPending ? 'Submitting...' : 'Request a callback'}
            </Button>
          </form>
        )}
      </div>
    </SectionShell>
  )
}
