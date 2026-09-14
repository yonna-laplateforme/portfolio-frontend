import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const isVideoUrl = (u) => u?.includes('/video/upload/');
const firstMedia = (p) => p.image_url?.split(',')[0]?.trim();

const ProjectsEditorial = ({ projects }) => {
  const [active, setActive] = useState(null);

  // Aperçu flottant qui suit le curseur (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 200, damping: 25 });
  const py = useSpring(my, { stiffness: 200, damping: 25 });

  if (!projects?.length) return null;
  const activeProject = active !== null ? projects[active] : null;
  const activeMedia = activeProject ? firstMedia(activeProject) : null;

  return (
    <div onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }} className="relative">
      <ul className="border-t border-ink/10">
        {projects.map((p, i) => {
          const media = firstMedia(p);
          const video = isVideoUrl(media);
          return (
            <li
              key={p.id}
              className="border-b border-ink/10"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <Link
                to={`/projects/${p.id}`}
                className="group grid grid-cols-12 items-center gap-3 md:gap-6 py-7 md:py-9 px-1 md:px-4 transition-colors duration-300 hover:bg-cream"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-xs text-ink-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Miniature mobile uniquement */}
                <span className="col-span-3 md:hidden">
                  {video ? (
                    <video src={media} muted autoPlay loop playsInline className="w-full h-14 object-cover" />
                  ) : (
                    <img src={getOptimizedUrl(media, 400)} alt="" className="w-full h-14 object-cover" loading="lazy" />
                  )}
                </span>

                <h3 className="col-span-7 md:col-span-7 font-display font-light text-2xl md:text-5xl leading-none text-ink transition-all duration-300 group-hover:text-brick group-hover:translate-x-2">
                  {p.title}
                </h3>

                <span className="hidden md:block md:col-span-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                  {p.category}
                </span>

                <span className="hidden md:flex md:col-span-1 justify-end text-xl md:text-2xl text-ink transition-all duration-300 group-hover:translate-x-2 group-hover:text-brick">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* APERÇU FLOTTANT (desktop) */}
      <AnimatePresence>
        {activeProject && activeMedia && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            style={{ x: px, y: py }}
            className="hidden md:block fixed top-0 left-0 z-40 pointer-events-none"
          >
            <div className="-translate-x-1/2 -translate-y-1/2 w-[22rem] aspect-video overflow-hidden shadow-2xl shadow-ink/30 border border-ink/10">
              {isVideoUrl(activeMedia) ? (
                <video src={activeMedia} muted autoPlay loop playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={getOptimizedUrl(activeMedia, 800)} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsEditorial;