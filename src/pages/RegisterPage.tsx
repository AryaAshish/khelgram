import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { PreRegBanner } from '@/components/public/PreRegBanner'
import { RegistrationFormWithI18n } from '@/components/public/RegistrationForm'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useGames } from '@/hooks/useGames'
import { useCreateRegistration } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { getRegistrationShareUrl } from '@/lib/shareUrl'
import type { RegistrationInput } from '@/types/app.types'

export function RegisterPage() {
  const { games, isLoading: gamesLoading } = useGames()
  const { settingsMap } = useAllSettings()
  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const createRegistration = useCreateRegistration(eventStatus)
  const isPreRegistration = eventStatus === 'pre_registration'
  const registerTitle = settingsMap.khel2026_register_title
  const shareUrl = useMemo(() => getRegistrationShareUrl(), [])
  const registrationOpen = eventStatus === 'registration_open' || eventStatus === 'pre_registration'
  const registerPreMessage = settingsMap.khel2026_register_pre_message
  const registerSubmitLabel = settingsMap.khel2026_register_submit_label

  useEffect(() => {
    document.title = `${registerTitle} | ${settingsMap.site_name ?? 'Khelgram Foundation'}`
  }, [registerTitle, settingsMap.site_name])

  const handleRegistrationSubmit = (input: RegistrationInput) => {
    createRegistration.mutate(input)
  }

  const eventOptions = games.map((game) => game.name)

  return (
    <div className="register-page">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      {isPreRegistration ? <PreRegBanner message={registerPreMessage} /> : null}
      <main style={{ minHeight: '60vh' }}>
        {!registrationOpen ? (
          <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Registration unavailable
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Registration is not open on the public site right now. Please check back later.
            </p>
            <Link to="/" style={{ color: '#22c55e', fontWeight: 600 }}>
              ← Back to homepage
            </Link>
          </section>
        ) : (
          <SectionErrorBoundary title={registerTitle}>
            {gamesLoading ? (
              <SectionSkeleton title={registerTitle} />
            ) : (
              <RegistrationFormWithI18n
                title={registerTitle}
                eventOptions={eventOptions}
                preRegistrationMessage={registerPreMessage}
                submitLabel={registerSubmitLabel}
                isPreRegistration={isPreRegistration}
                isSubmitting={createRegistration.isPending}
                shareUrl={shareUrl}
                onSubmit={handleRegistrationSubmit}
              />
            )}
            <div className="container-custom" style={{ paddingBottom: '2rem' }}>
              <Link to="/khel2026" style={{ color: '#6b7280', fontWeight: 600 }}>
                ← Back to Khel 2026
              </Link>
            </div>
          </SectionErrorBoundary>
        )}
      </main>
      <SiteFooter
        description={settingsMap.footer_description ?? footerContent.description}
        copyright={settingsMap.footer_copyright ?? footerContent.copyright}
      />
    </div>
  )
}
