import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAuth } from './context/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer.jsx';

// Pages publiques
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Pages Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const CreateProject = lazy(() => import('./pages/admin/CreateProjectPage.jsx'));
const EditProject = lazy(() => import('./pages/admin/EditProjectPage.jsx'));
const EditAboutPage = lazy(() => import('./pages/admin/EditAboutPage.jsx'));

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar token={token} onLogout={logout} />
      <main className="pt-16">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">CHARGEMENT...</div>}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage isAdmin={!!token} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Porte secrète de connexion */}
            <Route path="/la-porte-secrete-du-portfolio" element={<LoginPage />} />

           
            <Route path="/dashboard-yonna-2026" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            
            <Route path="/secret-yonna-create" element={
              <CreateProject />
            } />

            <Route path="/secret-yonna-edit/:id" element={
              <ProtectedRoute><EditProject /></ProtectedRoute>
            } />

            <Route path="/secret-yonna-edit-about" element={
              <ProtectedRoute><EditAboutPage /></ProtectedRoute>
            } />

            {/* Tout le reste finit en 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}

export default App;