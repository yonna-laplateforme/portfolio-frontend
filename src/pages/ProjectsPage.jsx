import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectList from '../components/ProjectList';

const ProjectsPage = ({ isAdmin }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-bg text-text-main pt-32 pb-20"> 
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        
        {/* HEADER DE PAGE */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-[10px] font-mono text-accent uppercase tracking-[0.3em]">// SÉLECTION</h3>
            
            <h1 className="text-4xl md:text-7xl font-black uppercase mt-4 mb-8 text-(--primary-color)">
  TOUS MES <span className="text-(--accent-color)">PROJETS</span>
</h1>
            
            <div className="h-0.5 w-12 bg-accent mx-auto"></div>
            
            <p className="mt-8 text-secondary font-mono text-sm max-w-lg mx-auto leading-relaxed">
              Exploration visuelle et technique à travers différents médiums. 
              Chaque projet est une recherche sur la forme et la narration, 
              développé avec une rigueur orientée vers l'expérience utilisateur.
            </p>
          </motion.div>
        </header>

        {/* LISTE DES PROJETS  */}
        <section>
          {loading ? (
            <div className="text-center font-mono text-secondary animate-pulse">Chargement...</div>
          ) : (
            <ProjectList projects={projects} isAdmin={isAdmin} />
          )}
        </section>
        
      </div>
    </main>
  );
};

export default ProjectsPage;