import { Component } from 'react'
import { useTranslation } from 'react-i18next'
import { ShareRegistrationLink } from '@/components/public/ShareRegistrationLink'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegistrationInput } from '@/types/app.types'

export type RegistrationFormLabels = {
  childName: string
  age: string
  parentName: string
  email: string
  phone: string
  events: string
}

export type RegistrationFormProps = {
  title: string
  eventOptions: string[]
  preRegistrationMessage: string
  submitLabel?: string
  labels?: RegistrationFormLabels
  isPreRegistration?: boolean
  isSubmitting?: boolean
  shareUrl?: string
  onSubmit: (input: RegistrationInput) => void
}

type RegistrationFormState = RegistrationInput

const initialState: RegistrationFormState = {
  childName: '',
  age: '',
  parentName: '',
  email: '',
  phone: '',
  selectedEvents: [],
}

export class RegistrationForm extends Component<RegistrationFormProps, RegistrationFormState> {
  state: RegistrationFormState = initialState

  private updateField = <K extends Exclude<keyof RegistrationInput, 'selectedEvents'>>(
    field: K,
    value: string,
  ) => {
    this.setState((previousState) => ({
      ...previousState,
      [field]: value,
    }))
  }

  private toggleEvent = (eventName: string, isChecked: boolean) => {
    const selected = this.state.selectedEvents
    const nextSelection = isChecked
      ? [...selected, eventName]
      : selected.filter((name) => name !== eventName)
    this.setState({ selectedEvents: nextSelection })
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.props.onSubmit(this.state)
    this.setState(initialState)
  }

  render() {
    const labels = this.props.labels ?? {
      childName: 'Child Name',
      age: 'Age',
      parentName: 'Parent Name',
      email: 'Email',
      phone: 'Phone',
      events: 'Select Events',
    }

    return (
      <section className="registration-section" id="register" style={{ padding: '4rem 0' }}>
        <div className="container-custom">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{this.props.title}</h2>
          {this.props.shareUrl ? (
            <ShareRegistrationLink formTitle={this.props.title} shareUrl={this.props.shareUrl} />
          ) : null}
          {this.props.isPreRegistration ? (
            <p style={{ marginBottom: '1rem', color: '#059669', fontWeight: 600 }}>
              {this.props.preRegistrationMessage}
            </p>
          ) : null}
          <form
            onSubmit={this.handleSubmit}
            aria-label="Registration form"
            style={{ maxWidth: '640px' }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <Label htmlFor="childName">{labels.childName}</Label>
              <Input
                id="childName"
                value={this.state.childName}
                onChange={(event) => this.updateField('childName', event.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <Label htmlFor="age">{labels.age}</Label>
              <Input
                id="age"
                value={this.state.age}
                onChange={(event) => this.updateField('age', event.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <Label htmlFor="parentName">{labels.parentName}</Label>
              <Input
                id="parentName"
                value={this.state.parentName}
                onChange={(event) => this.updateField('parentName', event.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <Label htmlFor="email">{labels.email}</Label>
              <Input
                id="email"
                type="email"
                value={this.state.email}
                onChange={(event) => this.updateField('email', event.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <Label htmlFor="phone">{labels.phone}</Label>
              <Input
                id="phone"
                value={this.state.phone}
                onChange={(event) => this.updateField('phone', event.target.value)}
                required
              />
            </div>
            <fieldset style={{ border: 'none', margin: '0 0 1rem', padding: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{labels.events}</legend>
              {this.props.eventOptions.map((eventName) => (
                <label key={eventName} style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={this.state.selectedEvents.includes(eventName)}
                    onChange={(event) => this.toggleEvent(eventName, event.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {eventName}
                </label>
              ))}
            </fieldset>
            <Button type="submit" disabled={this.props.isSubmitting}>
              {this.props.isSubmitting
                ? 'Submitting...'
                : (this.props.submitLabel ?? 'Submit Registration')}
            </Button>
          </form>
        </div>
      </section>
    )
  }
}

export function RegistrationFormWithI18n(props: Omit<RegistrationFormProps, 'labels'>) {
  const { t } = useTranslation()

  return (
    <RegistrationForm
      {...props}
      labels={{
        childName: t('register.childName'),
        age: t('register.age'),
        parentName: t('register.parentName'),
        email: t('register.email'),
        phone: t('register.phone'),
        events: t('register.events'),
      }}
      submitLabel={props.submitLabel || t('register.submit')}
    />
  )
}
