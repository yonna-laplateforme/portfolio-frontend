import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const isVideoUrl = (url) => /\/video\/upload\//.test(url || '');
const mediaSrc = (url) =>
  isVideoUrl(url) || url?.includes('.gif') ? url : getOptimizedUrl(url, 1400);

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const mediaArray = project.image_url ? project.image_url.split(',').map((u) => u.trim()).filter(Boolean) : [];
  const mainMedia = mediaArray[0] || '';
  const thumbnails = mediaArray.slice(1);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const handleNavigate = () => navigate(`/projects/${project.id}`);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <button onClick={handleNavigate} className="w-full text-left focus:outline-none cursor-pointer">

        {/* MÉDIA PRINCIPAL */}
        <div className="relative overflow-hidden h-64 md:h-80 bg-sand/40">
          {isVideoUrl(mainMedia) ? (
            <video
              src={mainMedia}
              muted
              loop
              playsInline
              autoPlay
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.img
              style={{ scale: imageScale }}
              src={mediaSrc(mainMedia)}
              alt={project.title}
              className="zoom-img w-full h-full object-cover"
            />
          )}
          {/* Fine bordure qui s'illumine au survol */}
          <div className="absolute inset-0 border border-ink/10 group-hover:border-brick/60 transition-colors duration-500 pointer-events-none" />
        </div>

        {/* MINIATURES */}
        {thumbnails.length > 0 && (
          <div className="flex gap-3 mt-4">
            {thumbnails.map((thumb, i) => (
              <div key={i} className="w-16 h-12 overflow-hidden border border-ink/10">
                {isVideoUrl(thumb) ? (
                  <video src={thumb} muted autoPlay loop playsInline className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                ) : (
                  <img
                    src={mediaSrc(thumb)}
                    alt={`Miniature ${i + 1}`}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* TEXTE — style éditorial */}
        <div className="mt-8 pb-8 border-b border-ink/10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brick">
            0{index + 1} — {project.category || 'PROJET'}
          </span>
          <h3 className="font-display font-light text-3xl md:text-4xl leading-tight mt-3 text-ink transition-colors duration-300 group-hover:text-brick">
            {project.title}
          </h3>
          {project.client && (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft mt-3">
              {project.client} — {project.date_realisation}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink transition-all duration-300 group-hover:gap-4 group-hover:text-brick">
            Voir le projet <span aria-hidden>→</span>
          </span>
        </div>
      </button>
    </motion.article>
  );
};

export default ProjectCard;