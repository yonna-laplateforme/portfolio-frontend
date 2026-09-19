import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const isVideoUrl = (u) => u?.includes('/video/upload/');
const firstMedia = (p) => p.image_url?.split(',')[0]?.trim();

const ProjectsShowcase = ({ projects }) => {
  if (!projects?.length) return null;

  return (
    <div className="border-t border-ink/10">
      {projects.map((p, i) => {
        const media = firstMedia(p);
        const video = isVideoUrl(media);

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/projects/${p.id}`}
              className="group grid grid-cols-12 items-center gap-4 md:gap-8 py-8 md:py-12 border-b border-ink/10 transition-colors duration-300 hover:bg-cream"
            >
              {/* Numéro */}
              <span className="col-span-2 md:col-span-1 font-mono text-xs text-ink-soft">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Titre */}
              <div className="col-span-10 md:col-span-7">
                <h3 className="font-display font-light text-3xl md:text-6xl leading-[0.95] text-ink transition-all duration-500 group-hover:text-brick group-hover:translate-x-3">
                  {p.title}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft mt-3">
                  {p.category}
                </p>
              </div>

              {/* FRAGMENT TEASER : un morceau caché, révélé au survol */}
              <span className="hidden md:block md:col-span-4 justify-self-end">
                <span className="block overflow-hidden w-64 h-40 lg:w-80 lg:h-44 bg-sand/40">
                  {video ? (
                    <video
                      src={media}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover scale-[1.5] transition-transform duration-700 ease-out group-hover:scale-100"
                    />
                  ) : (
                    <img
                      src={getOptimizedUrl(media, 900)}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover scale-[1.5] transition-transform duration-700 ease-out group-hover:scale-100"
                    />
                  )}
                </span>
              </span>

              {/* Flèche mobile */}
              <span className="md:hidden col-start-12 text-right text-xl text-ink">→</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectsShowcase;