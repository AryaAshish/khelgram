import { Component, createElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RegisterBenefitsPanel } from '@/components/public/RegisterBenefitsPanel'
import { ShareRegistrationLink } from '@/components/public/ShareRegistrationLink'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resolveGameEventIcon } from '@/lib/gameEventIcons'
import type { Game, RegistrationInput } from '@/types/app.types'

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
  games?: Game[]
  preRegistrationMessage: string
  submitLabel?: string
  labels?: RegistrationFormLabels
  isPreRegistration?: boolean
  isSubmitting?: boolean
  shareUrl?: string
  showSuccessBanner?: boolean
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

function RegistrationSuccessBanner() {
  return (
    <div className="register-success-banner" role="status" aria-live="polite">
      <svg className="register-success-banner__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          className="register-success-banner__check"
          d="M7 12.5l3 3 7-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <strong>Registration received!</strong>
        <p>We sent a confirmation to your email. See you at Khel 2026.</p>
      </div>
    </div>
  )
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

  private resolveGame = (eventName: string): Game | undefined =>
    this.props.games?.find((game) => game.name === eventName)

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
      <SectionShell variant="festival" className="registration-section" id="register-form">
        <div className="container-custom register-page-layout">
          <div className="register-form-column">
            <SectionHeading title={this.props.title} />
            {this.props.showSuccessBanner ? <RegistrationSuccessBanner /> : null}
            {this.props.shareUrl ? (
              <ShareRegistrationLink formTitle={this.props.title} shareUrl={this.props.shareUrl} />
            ) : null}
            {this.props.isPreRegistration ? (
              <p className="register-pre-message">{this.props.preRegistrationMessage}</p>
            ) : null}
            <form
              onSubmit={this.handleSubmit}
              aria-label="Registration form"
              className="register-form"
            >
              <div className="register-form__field">
                <Label htmlFor="childName">{labels.childName}</Label>
                <Input
                  id="childName"
                  value={this.state.childName}
                  onChange={(event) => this.updateField('childName', event.target.value)}
                  required
                />
              </div>
              <div className="register-form__field">
                <Label htmlFor="age">{labels.age}</Label>
                <Input
                  id="age"
                  value={this.state.age}
                  onChange={(event) => this.updateField('age', event.target.value)}
                  required
                />
              </div>
              <div className="register-form__field">
                <Label htmlFor="parentName">{labels.parentName}</Label>
                <Input
                  id="parentName"
                  value={this.state.parentName}
                  onChange={(event) => this.updateField('parentName', event.target.value)}
                  required
                />
              </div>
              <div className="register-form__field">
                <Label htmlFor="email">{labels.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => this.updateField('email', event.target.value)}
                  required
                />
              </div>
              <div className="register-form__field">
                <Label htmlFor="phone">{labels.phone}</Label>
                <Input
                  id="phone"
                  value={this.state.phone}
                  onChange={(event) => this.updateField('phone', event.target.value)}
                  required
                />
              </div>
              <fieldset className="register-form__events">
                <legend>{labels.events}</legend>
                <div className="register-event-chips">
                  {this.props.eventOptions.map((eventName) => {
                    const game = this.resolveGame(eventName)
                    const iconGame = game ?? { name: eventName }
                    const checked = this.state.selectedEvents.includes(eventName)
                    const chipId = `event-${eventName.replace(/\s+/g, '-').toLowerCase()}`

                    return (
                      <label
                        key={eventName}
                        htmlFor={chipId}
                        className={`register-event-chip ${checked ? 'register-event-chip--selected' : ''}`}
                      >
                        <input
                          id={chipId}
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => this.toggleEvent(eventName, event.target.checked)}
                          className="register-event-chip__input"
                        />
                        {createElement(resolveGameEventIcon(iconGame), {
                          className: 'register-event-chip__icon',
                          'aria-hidden': true,
                        })}
                        <span>{eventName}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <Button type="submit" variant="festival" disabled={this.props.isSubmitting}>
                {this.props.isSubmitting
                  ? 'Submitting...'
                  : (this.props.submitLabel ?? 'Submit Registration')}
              </Button>
            </form>
          </div>
          <RegisterBenefitsPanel />
        </div>
      </SectionShell>
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
