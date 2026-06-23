import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; 
import { motion } from 'framer-motion';
import { apiFetch } from '../api/apiFetch';

const LoginPage = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Utilise apiFetch au lieu de fetch natif
    // Il gère déjà l'URL de base, il ne manque que le chemin relatif
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      // Pas besoin de headers 'Content-Type' si apiFetch les ajoute par défaut
    });

    if (data.token) {
      login(data.token);
      navigate('/admin');
    }
  } catch (error) {
    console.error('Erreur connexion:', error);
    alert(error.message || 'Identifiants incorrects');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-6 text-text-main font-sans">
      
      {/* Bouton retour utilisant la couleur principale */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-[10px] font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent-color)] uppercase tracking-widest transition-all flex items-center gap-2"
      >
        <span>←</span> Retour à l'accueil
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 md:p-12 border border-[var(--primary-color)]/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light tracking-wide mb-3 text-[var(--primary-color)]">
            Accès Réservé
          </h2>
          {/* Ligne d'accentuation avec ta variable de couleur */}
          <div className="h-0.5 w-12 bg-[var(--accent-color)] mx-auto"></div>
          <p className="mt-4 text-[10px] opacity-60 uppercase tracking-widest">
            Administration du portfolio
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
              Adresse Email
            </label>
            <input 
              type="email" 
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main"
              placeholder="hello@tonportfolio.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
              Mot de passe
            </label>
            <input 
              type="password" 
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            {/* Bouton principal avec la couleur d'accentuation en fond */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--accent-color)] text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Connexion en cours...</span>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </form>
      </motion.div>

    </div>
  );
};

export default LoginPage;