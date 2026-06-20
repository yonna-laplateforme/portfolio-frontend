import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';

// Pages
import Login from './components/login.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'; 
import ProjectsPage from './pages/ProjectsPage';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CreateProject from './pages/admin/CreateProjectPage.jsx';
import EditProject from './pages/admin/EditProjectPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-bg text-main font-sans selection:bg-primary selection:text-white">
      {/* Navbar unique et globale */}
      <Navbar token={token} onLogout={logout} />

      {/* Conteneur principal avec padding-top pour compenser la Navbar fixe */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} /> 
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage isAdmin={!!token} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateProject />} />
          <Route path="/admin/edit/:id" element={<EditProject />} />
          
          <Route path="/la-porte-secrete-du-portfolio" element={
            <div className="px-6 md:px-12 py-12"><Login setToken={setToken} /></div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;