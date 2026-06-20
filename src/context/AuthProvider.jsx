import { useState, useContext } from 'react';
import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  // On initialise le token directement depuis le localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Dérivé : Est-on authentifié ? (vrai si le token existe)
  const isAuthenticated = !!token;

  // Dérivé : Récupérer les infos de l'utilisateur depuis le JWT
  let user = null;
  if (token) {
    try {
      // On décode la partie "payload" du token (le milieu)
      const payload = token.split('.')[1];
      user = JSON.parse(atob(payload));
    } catch (e) {
      console.error("Erreur de décodage du token", e);
    }
  }

  // Fonction pour se connecter
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser l'auth facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};