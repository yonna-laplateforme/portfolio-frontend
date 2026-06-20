import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard"; 

const ProjectList = ({ isAdmin }) => { 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => console.error("Erreur de chargement des projets:", err));
  }, []);

  if (loading) return (
    <div className="text-center py-20 font-mono text-primary uppercase tracking-widest text-xs">
      Chargement des implémentations...
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-32"> 
        {projects.map((project, index) => (
          <motion.div 
            key={project.id || project._id}
            // On désactive l'animation de mouvement sur mobile pour plus de stabilité
            initial={window.innerWidth > 768 ? { opacity: 0, y: 100 } : { opacity: 1, y: 0 }}
            whileInView={window.innerWidth > 768 ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            // md:mt-32 n'est activé que sur écran large, sinon mt-0 (alignement droit sur mobile)
            className={`${index % 2 !== 0 ? 'md:mt-32' : 'mt-0'}`}
          >
            <ProjectCard 
              project={project} 
              isAdmin={isAdmin} 
              index={index} 
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;