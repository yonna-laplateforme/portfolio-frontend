import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // 1. On sépare toutes les images
  const imagesArray = project.image_url ? project.image_url.split(',').map(url => url.trim()) : [];
  const mainImage = imagesArray[0] || '';
  const thumbnails = imagesArray.slice(1); 

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleNavigate = () => navigate(`/projects/${project.id}`);

  return (
    <article ref={cardRef} className="group relative">
      <button onClick={handleNavigate} className="w-full text-left focus:outline-none">
        
        {/* GRANDE IMAGE PRINCIPALE */}
        <div className="overflow-hidden bg-bg aspect-video relative border border-zinc-800 transition-colors group-hover:border-primary">
          <motion.img 
            style={{ scale: imageScale }}
            className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-1000" 
            src={getOptimizedUrl(mainImage)} 
            alt={project.title} 
          />
        </div>

        {/* ZONE MINIATURES */}
        {thumbnails.length > 0 && (
          <div className="flex gap-2 mt-4">
            {thumbnails.map((thumb, i) => (
              <div key={i} className="w-16 h-12 overflow-hidden border border-zinc-800">
                <img 
                  src={getOptimizedUrl(thumb)} 
                  alt={`Miniature ${i + 1}`} 
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        )}

        {/* TEXTE */}
        <div className="mt-6 flex gap-4 items-start">
          <div className="w-[60%]">
            <span className="block text-xs font-mono text-primary tracking-[0.2em] mb-2 uppercase">
              0{index + 1} — {project.category || 'PROJET'}
            </span>
            <h3 className="font-black text-2xl md:text-3xl text-main leading-tight uppercase">
              {project.title}
            </h3>
          </div>
        </div>
      </button>
    </article>
  );
};

export default ProjectCard;