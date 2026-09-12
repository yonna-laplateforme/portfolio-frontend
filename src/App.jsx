import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from './context/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer.jsx';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import PageWrapper from './components/PageWrapper';
import ScrollToTop from './components/ScrollToTop';

// Pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx'));
const MentionsLegalePage = lazy(() => import('./pages/MentionsLegalePage.jsx'));

// Pages Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const CreateProject = lazy(() => import('./pages/admin/CreateProjectPage.jsx'));
const EditProject = lazy(() => import('./pages/admin/EditProjectPage.jsx'));
const EditAboutPage = lazy(() => import('./pages/admin/EditAboutPage.jsx'));
const EditHomePage = lazy(() => import('./pages/admin/EditHomePage.jsx'));

const RouteLogger = () => {
  const location = useLocation();
  useEffect(() => {}, [location]);
  return null;
};

const IS_MAINTENANCE = false;

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Curseur custom */}
      <Cursor />

      {/* Le site n'apparaît qu'après le preloader */}
      {!loading && (
        <>
          {!IS_MAINTENANCE && (
            <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
          )}

          <main className={!IS_MAINTENANCE ? 'pt-16' : ''}>
            <Suspense fallback={
              <div className="flex justify-center items-center h-screen font-mono text-sm tracking-widest text-ink-soft">
                CHARGEMENT…
              </div>
            }>
              <RouteLogger />
              <ScrollToTop />

              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  {IS_MAINTENANCE ? (
                    <Route path="*" element={<MaintenancePage />} />
                  ) : (
                    <>
                      {/* Routes publiques */}
                      <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                      <Route path="/projects" element={<PageWrapper><ProjectsPage isAdmin={isAuthenticated} /></PageWrapper>} />
                      <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                      <Route path="/projects/:id" element={<PageWrapper><ProjectDetailPage /></PageWrapper>} />
                      <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                      <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
                      <Route path="/mentions-legales" element={<PageWrapper><MentionsLegalePage /></PageWrapper>} />

                      {/* Routes Admin (Protégées) */}
                      <Route path="/la-porte-secrete-du-portfolio" element={<LoginPage />} />
                      <Route path="/secret-yonna-create" element={
                        <ProtectedRoute><CreateProject /></ProtectedRoute>
                      } />
                      <Route path="/secret-yonna-edit/:id" element={
                        <ProtectedRoute><EditProject /></ProtectedRoute>
                      } />
                      <Route path="/secret-yonna-edit-about" element={
                        <ProtectedRoute><EditAboutPage /></ProtectedRoute>
                      } />
                      <Route path="/dashboard-yonna-2026" element={
                        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                      } />
                      <Route path="/secret-yonna-edit-home" element={
                        <ProtectedRoute><EditHomePage /></ProtectedRoute>
                      } />

                      {/* Page 404 */}

                      <Route path="*" element={<NotFoundPage />} />
                    </>
                  )}
                </Routes>
              </AnimatePresence>
            </Suspense>

            {!IS_MAINTENANCE && <Footer />}
          </main>
        </>
      )}
    </div>
  );
}

export default App;