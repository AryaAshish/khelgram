import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { HomePage } from '@/pages/HomePage'
import { Khel2026Page } from '@/pages/Khel2026Page'
import { RegisterPage } from '@/pages/RegisterPage'
import '@/App.css'

const LoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const RegistrationsPage = lazy(() =>
  import('@/pages/admin/RegistrationsPage').then((module) => ({
    default: module.RegistrationsPage,
  })),
)
const RegistrationDetailPage = lazy(() =>
  import('@/pages/admin/RegistrationDetailPage').then((module) => ({
    default: module.RegistrationDetailPage,
  })),
)
const ContentPage = lazy(() =>
  import('@/pages/admin/ContentPage').then((module) => ({ default: module.ContentPage })),
)
const MediaPage = lazy(() =>
  import('@/pages/admin/MediaPage').then((module) => ({ default: module.MediaPage })),
)
const GalleryPage = lazy(() =>
  import('@/pages/admin/GalleryPage').then((module) => ({ default: module.GalleryPage })),
)
const TeamPage = lazy(() =>
  import('@/pages/admin/TeamPage').then((module) => ({ default: module.TeamPage })),
)
const ContributorsPage = lazy(() =>
  import('@/pages/admin/ContributorsPage').then((module) => ({
    default: module.ContributorsPage,
  })),
)
const SponsorsPage = lazy(() =>
  import('@/pages/admin/SponsorsPage').then((module) => ({ default: module.SponsorsPage })),
)
const TestimonialsPage = lazy(() =>
  import('@/pages/admin/TestimonialsPage').then((module) => ({
    default: module.TestimonialsPage,
  })),
)
const FAQPage = lazy(() =>
  import('@/pages/admin/FAQPage').then((module) => ({ default: module.FAQPage })),
)
const ImpactStatsPage = lazy(() =>
  import('@/pages/admin/ImpactStatsPage').then((module) => ({
    default: module.ImpactStatsPage,
  })),
)
const ProgramsPage = lazy(() =>
  import('@/pages/admin/ProgramsPage').then((module) => ({ default: module.ProgramsPage })),
)
const GamesPage = lazy(() =>
  import('@/pages/admin/GamesPage').then((module) => ({ default: module.GamesPage })),
)

function AdminFallback() {
  return (
    <div style={{ padding: '2rem' }}>
      <p>Loading admin...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/khel2026" element={<Khel2026Page />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <RegistrationsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/content"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ContentPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/media"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <MediaPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <GalleryPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/team"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <TeamPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/contributors"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ContributorsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/sponsors"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <SponsorsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <TestimonialsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/faq"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <FAQPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/impact-stats"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ImpactStatsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/programs"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ProgramsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/games"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <GamesPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/registrations/:id"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <RegistrationDetailPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
