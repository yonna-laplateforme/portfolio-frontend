import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard"; 
import { apiFetch } from "../api/apiFetch";

const ProjectList = ({ isAdmin }) => { 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TOUT");

  useEffect(() => {
    apiFetch("/projects")
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement projets:", err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = filter === "TOUT" 
    ? projects 
    : projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase());

  if (loading) return (
    <div className="text-center py-20 font-mono text-primary uppercase tracking-widest text-xs">
      Chargement...
    </div>
  );
 
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      
      {/* BARRE DE FILTRAGE */}
      <nav aria-label="Filtres de projets" className="flex gap-8 mb-20 justify-center">
        {["TOUT", "WEB", "PHOTO"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`font-mono text-sm uppercase tracking-widest transition-all ${
              filter === cat ? "text-primary border-b border-primary" : "text-zinc-500 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* VÉRIFICATION SI PROJETS EXISTENT */}
      {filteredProjects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="font-mono text-zinc-400 uppercase tracking-widest text-sm">
            Aucun projet pour le moment.
          </p>
        </motion.div>
      ) : (
        /* GRILLE ANIMÉE */
        <motion.ul 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32"
          aria-live="polite"
        > 
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.li 
                key={project.id || project._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`list-none ${index % 2 !== 0 ? 'md:mt-32' : 'mt-0'}`}
              >
                <ProjectCard 
                  project={project} 
                  isAdmin={isAdmin} 
                  index={index} 
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
};

export default ProjectList;