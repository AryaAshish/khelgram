import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { PreRegBanner } from '@/components/public/PreRegBanner'
import { RegistrationForm } from '@/components/public/RegistrationForm'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useGames } from '@/hooks/useGames'
import { useCreateRegistration } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { getRegistrationShareUrl } from '@/lib/shareUrl'
import { isSectionVisible, sectionTitle } from '@/lib/homepageSections'
import type { RegistrationInput } from '@/types/app.types'

export function RegisterPage() {
  const { games, isLoading: gamesLoading } = useGames()
  const { settingsMap } = useAllSettings()
  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const createRegistration = useCreateRegistration(eventStatus)
  const isPreRegistration = eventStatus === 'pre_registration'
  const registerTitle = sectionTitle(settingsMap, 'register_title', 'Register Your Child')
  const shareUrl = useMemo(() => getRegistrationShareUrl(), [])
  const registrationOpen = isSectionVisible(settingsMap, 'register_visible')

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
      {isPreRegistration ? (
        <PreRegBanner
          message={
            settingsMap.register_pre_message ??
            "Pre-registration open — we'll confirm dates by email"
          }
        />
      ) : null}
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
              <RegistrationForm
                title={registerTitle}
                eventOptions={eventOptions}
                preRegistrationMessage={
                  settingsMap.register_pre_message ??
                  "Pre-registration open — we'll confirm dates by email"
                }
                submitLabel={settingsMap.register_submit_label ?? 'Submit Registration'}
                isPreRegistration={isPreRegistration}
                isSubmitting={createRegistration.isPending}
                shareUrl={shareUrl}
                onSubmit={handleRegistrationSubmit}
              />
            )}
            <div className="container-custom" style={{ paddingBottom: '2rem' }}>
              <Link to="/" style={{ color: '#6b7280', fontWeight: 600 }}>
                ← View full festival homepage
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
