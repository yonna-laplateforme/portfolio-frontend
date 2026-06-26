import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordRotation from '../components/WordRotation';
import ZigzagProject from '../components/ZigzagProject';
import ContactMinimal from '../components/ContactMinimal';
import { apiFetch } from "../api/apiFetch";

const HomePage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

// Dans ton HomePage.jsx
useEffect(() => {
    // Appel à la route simplifiée pour la Home
    apiFetch("/projects/home") 
        .then(data => {
            setAllProjects(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur chargement HomePage:", err);
            setLoading(false);
        });
}, []);

  const featured = allProjects.filter(p => Number(p.isFeatured) === 1);

  return (
    <main className="bg-bg text-text-main min-h-screen">

      
{/* SECTION HÉRO */}
<section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
  <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase whitespace-nowrap">
    <span className="text-accent">YONNA</span><span className="text-primary">MERLINI</span>
  </h1>
  
  {/* Ligne d'accentuation centrée */}
  <div className="w-24 h-1 bg-accent mt-6 mb-8 mx-auto"></div>
  
  <div className="text-xl md:text-4xl font-mono text-secondary">
    <WordRotation />
  </div>
</section>

      {/* SECTION VISION - Adaptation hauteur fenêtre */}
<section className="min-h-screen flex flex-col justify-center items-center py-24 px-6 md:px-24 bg-primary text-bg">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-3xl flex flex-col items-center text-center"
  >
    {/* CORRECTION : Remplacement du titre h2 par un span block */}
    <span className="text-[10px] block font-mono text-accent font-bold mb-6 uppercase tracking-[0.3em]">
      // VISION_TECHNIQUE
    </span>
    
    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase">
      LE CODE COMME <br/>
      <span className="text-accent">OUTIL CRÉATIF</span>.
    </h2>
    
    <p className="text-lg md:text-xl font-light opacity-90 leading-relaxed max-w-2xl">
      Mon approche ne se limite pas à faire fonctionner les interfaces. 
      Je structure le DOM pour qu'il soit sémantique et je transforme 
      les contraintes techniques en opportunités de design. 
      Moins de superflu, plus d'impact.
    </p>

    <div className="mt-12 w-24 h-0.5 bg-accent"></div>
  </motion.div>
</section>

     {/* SECTION PROJETS */}
<section className="py-24 px-6 max-w-7xl mx-auto">
  <h2 className="text-xs md:text-sm font-mono text-secondary mb-24 uppercase tracking-[0.3em] flex items-center gap-4">
    <span className="w-12 h-px bg-accent"></span> // PROJETS_SÉLECTIONNÉS
  </h2>

  {loading ? (
    <p className="text-center font-mono text-secondary">Chargement...</p>
  ) : (
    /* Transformation du container en une liste sémantique */
    <ul className="space-y-32">
      {featured.slice(0, visibleCount).map((project, index) => (
        <li key={project.id}>
          <Link to={`/projects/${project.id}`} className="block group">
            <ZigzagProject project={project} index={index} />
          </Link>
        </li>
      ))}
    </ul>
  )}

  {/* Bouton CTA final */}
  <div className="flex justify-end mt-24">
    <Link
      to="/projects"
      className="px-12 py-6 text-sm font-bold uppercase tracking-[0.3em] transition-all bg-accent text-bg hover:bg-primary"
    >
      MES PROJETS →
    </Link>
  </div>
</section>

{/* SECTION CONTACT - HOMEPAGE */}
<section id="contact" className="py-24 border-t border-zinc-200">
  <div className="text-center mb-16">
    {/* CORRECTION : Remplacement du h2 par un span block pour respecter la hiérarchie h1 -> h2 -> h2 */}
    <span className="text-[10px] block font-bold font-mono text-accent uppercase tracking-[0.3em] mb-4">
      // COLLABORATION
    </span>
    <h2 className="text-4xl md:text-5xl font-black uppercase text-primary">
      DISCUTONS DE VOTRE <span className="text-(--accent-color)">PROJET</span>
    </h2>
  </div>
  
  <ContactMinimal />
</section>
    </main>
  );
};

export default HomePage;