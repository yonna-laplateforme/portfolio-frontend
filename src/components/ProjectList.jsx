import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectsShowcase from './ProjectsShowcase';
import { apiFetch } from '../api/apiFetch';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TOUT');

  useEffect(() => {
    apiFetch('api/projects')
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement projets:', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = filter === 'TOUT'
    ? projects
    : projects.filter((p) => p.category?.toLowerCase() === filter.toLowerCase());

  if (loading) return (
    <div className="text-center py-20 font-mono text-ink uppercase tracking-widest text-xs">
      Chargement...
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16">

      {/* FILTRES */}
      <nav aria-label="Filtres de projets" className="flex flex-wrap gap-6 md:gap-10 mb-16 justify-center">
        {['TOUT', 'WEB', 'PHOTO', 'VIDÉO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`font-mono text-sm uppercase tracking-widest transition-all ${
              filter === cat
                ? 'text-brick border-b border-brick pb-1'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* LISTE OU MESSAGE VIDE */}
      {filteredProjects.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="font-mono text-ink-soft uppercase tracking-widest text-sm">
            Aucun projet pour le moment.
          </p>
        </motion.div>
      ) : (
        <ProjectsShowcase projects={filteredProjects} />
      )}
    </section>
  );
};

export default ProjectList;