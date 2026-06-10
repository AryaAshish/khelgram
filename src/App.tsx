import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { HomePage } from '@/pages/HomePage'
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
