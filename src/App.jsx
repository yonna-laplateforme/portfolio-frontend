import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAuth } from './context/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const CreateProject = lazy(() => import('./pages/admin/CreateProjectPage.jsx'));
const EditProject = lazy(() => import('./pages/admin/EditProjectPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage.jsx'));
const ContactPage= lazy(() => import('./pages/ContactPage.jsx'));

function App() {
  const { token, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <Navbar token={token} onLogout={logout} />
      <main className="pt-16">
        <Suspense fallback={<div>CHARGEMENT...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage isAdmin={!!token} />} />
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/Contact" element={<ContactPage/>}/>
<Route path="/la-porte-secrete-du-portfolio" element={<LoginPage />} />
            {/* Dashboard Admin */}
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />

            {/* Création de projet */}
            <Route path="/admin/create" element={
              <ProtectedRoute><CreateProject /></ProtectedRoute>
            } />

            {/* Édition de projet (avec l'ID dynamique) */}
            <Route path="/admin/edit/:id" element={
              <ProtectedRoute><EditProject /></ProtectedRoute>
            } />

          </Routes>
        </Suspense>
        <Footer/>
      </main>
    </div>
  );
}

export default App;