import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils'

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Fonction pour gérer la navigation
  const handleNavigate = () => navigate(`/projects/${project._id || project.id}`);

  return (
    <article 
      ref={cardRef}
      className="group relative"
    >
      {/* On utilise un bouton ou un lien pour rendre la carte interactive pour la liseuse */}
      <button 
        onClick={handleNavigate}
        className="w-full text-left focus:outline-none group"
        aria-label={`Voir les détails du projet ${project.title}`}
      >
        <div className="overflow-hidden bg-bg aspect-video relative border border-zinc-800 transition-colors group-hover:border-primary">
          <motion.img 
            style={{ scale: imageScale }}
            className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-1000" 
            src={getOptimizedUrl(project.image_url)} 
            alt="" 
            aria-hidden="true" 
            loading={index < 2 ? "eager" : "lazy"}
          />
        </div>

        <div className="mt-6 flex gap-4 items-start">
          <div className="w-[60%]">
            <span className="block text-xs font-mono text-primary tracking-[0.2em] mb-2 uppercase">
              0{index + 1} — {project.category || 'PROJET'}
            </span>
            <h3 className="font-black text-2xl md:text-3xl text-main leading-tight uppercase tracking-tighter transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </div>
          
          <div className="w-[40%] text-right">
            <p className="text-secondary text-[11px] uppercase tracking-widest mt-1 font-mono leading-relaxed">
              {project.description?.length > 50 ? `${project.description.substring(0, 50)}...` : project.description}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
};

export default ProjectCard;