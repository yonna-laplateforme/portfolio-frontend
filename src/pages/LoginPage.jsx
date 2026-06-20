import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="p-4 bg-white shadow flex justify-between">
        <h1 className="font-bold">Mon Portfolio</h1>
        {token ? (
          <button onClick={logout} className="text-red-500">Déconnexion</button>
        ) : (
          <a href="/login">Connexion Admin</a>
        )}
      </nav>

      {/* Si je suis connecté, je montre le bouton "Ajouter un projet" */}
      {true && (
        <div className="container mx-auto p-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            + Ajouter un Projet
          </button>
        </div>
      )}

      <ProjectList isAdmin={!!token} />
    </div>
  );
}