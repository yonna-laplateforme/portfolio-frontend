import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import WordRotation from '../components/WordRotation';
import ZigzagProject from '../components/ZigzagProject';

const HomePage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });
  }, []);

  const featured = allProjects.filter(p => Number(p.isFeatured) === 1);
  
  return (
    // Utilisation des variables de ton theme: bg-bg, text-main
    <main className="bg-bg text-main min-h-screen"> 
     

      {/* SECTION HÉRO : Responsive taille texte */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-accent uppercase">
          YONNA<span className="text-primary block md:inline">MERLINI</span>
        </h1>
        <div className="text-xl md:text-4xl font-mono text-primary mt-4 md:mb-12">
          <WordRotation />
        </div>
      </section>

      {/* SECTION PROJETS : Responsive Grid/Spacing */}
      <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-xs md:text-sm font-mono text-primary mb-16 md:mb-24 uppercase tracking-[0.3em] md:tracking-[0.5em] text-center">
          // PROJETS_SÉLECTIONNÉS
        </h2>
        
        {loading ? (
          <p className="text-center font-mono text-secondary">Chargement...</p>
        ) : (
         
          <div className="space-y-16 md:space-y-32">
            {featured.slice(0, visibleCount).map((project, index) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="block hover:opacity-90 transition-opacity">
                <ZigzagProject project={project} index={index} />
              </Link>
            ))}
          </div>
        )}

        {/* Boutons centrés - Stack vertical sur mobile, horizontal sur desktop */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-16">
          {visibleCount < featured.length && (
            <button 
              onClick={() => setVisibleCount(prev => prev + 3)}
              className="w-full md:w-auto px-6 py-4 md:py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all bg-transparent border border-primary text-primary hover:bg-primary hover:text-bg"
            >
              Voir plus
            </button>
          )}

          <Link 
            to="/projects"
            className="w-full md:w-auto px-6 py-4 md:py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all bg-transparent border border-accent text-accent hover:bg-accent hover:text-bg text-center"
          >
            Tout voir
          </Link>
        </div>
      </section>

      <div id="contact" className="py-24 border-t border-zinc-800">
        <ContactForm />
      </div>
    </main>
  );
};

export default HomePage;