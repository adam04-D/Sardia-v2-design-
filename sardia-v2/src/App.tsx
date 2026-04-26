/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RouteFallback from './components/RouteFallback';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Keep HomePage eager (first paint); code-split the rest
const ReadingPage = lazy(() => import('./pages/ReadingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AuthorStudy = lazy(() => import('./pages/AuthorStudy'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminWorks = lazy(() => import('./pages/admin/AdminWorks'));
const AdminWorkForm = lazy(() => import('./pages/admin/AdminWorkForm'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-center"
          dir="rtl"
          richColors
          closeButton
          toastOptions={{ className: 'font-sans' }}
        />
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/reading"
              element={
                <Layout>
                  <ReadingPage />
                </Layout>
              }
            />
            <Route
              path="/reading/:id"
              element={
                <Layout>
                  <ReadingPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/gallery"
              element={
                <Layout>
                  <Gallery />
                </Layout>
              }
            />
            <Route
              path="/author"
              element={
                <Layout>
                  <AuthorStudy />
                </Layout>
              }
            />
            <Route
              path="/privacy"
              element={
                <Layout>
                  <PrivacyPage />
                </Layout>
              }
            />
            <Route
              path="/terms"
              element={
                <Layout>
                  <TermsPage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/saved"
              element={
                <Layout>
                  <SavedPage />
                </Layout>
              }
            />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="works" element={<AdminWorks />} />
              <Route path="works/new" element={<AdminWorkForm />} />
              <Route path="works/:id/edit" element={<AdminWorkForm />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
