import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers l'accueil après 5 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--bg-color) text-(--primary-color)">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-xl font-mono">// PAGE NON TROUVÉE</p>
      <button 
        onClick={() => navigate('/')} 
        className="mt-8 px-6 py-2 border border-(--primary-color) hover:bg-(--primary-color) hover:text-(--bg-color) transition-all uppercase tracking-widest font-mono text-xs"
      >
        RETOUR À L'ACCUEIL
      </button>
    </div>
  );
};

export default NotFoundPage;