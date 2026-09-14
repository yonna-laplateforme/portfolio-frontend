import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const isVideoUrl = (u) => u?.includes('/video/upload/');
const firstMedia = (p) => p.image_url?.split(',')[0]?.trim();

const ProjectsShowcase = ({ projects }) => {
  if (!projects?.length) return null;

  return (
    <div className="space-y-8 md:space-y-14">
      {projects.map((p, i) => {
        const media = firstMedia(p);
        const video = isVideoUrl(media);

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/projects/${p.id}`}
              className="group relative block overflow-hidden h-[62vh] md:h-[78vh] bg-sand/40"
            >
              {/* MÉDIA */}
              {video ? (
                <video
                  src={media}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              ) : (
                <img
                  src={getOptimizedUrl(media, 1800)}
                  alt={p.title}
                  loading="lazy"
                  className="zoom-img w-full h-full object-cover"
                />
              )}

              {/* VOILE + DÉGRADÉ */}
              <div className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/45" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />

              {/* CONTENU */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-14 flex items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-paper/70 mb-4">
                    {String(i + 1).padStart(2, '0')} — {p.category}
                  </p>
                  <h3 className="font-display font-light text-paper text-4xl md:text-6xl leading-[0.95] transition-all duration-500 group-hover:translate-x-3">
                    {p.title}
                  </h3>
                </div>

                <span className="hidden md:inline-flex shrink-0 items-center gap-3 rounded-full border border-paper/50 px-7 py-3.5 text-sm font-medium text-paper transition-all duration-300 group-hover:bg-paper group-hover:text-ink">
                  Voir le projet <span aria-hidden>→</span>
                </span>
              </div>

              {/* Flèche mobile */}
              <span className="md:hidden absolute top-6 right-6 text-paper/80 text-2xl">→</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectsShowcase;