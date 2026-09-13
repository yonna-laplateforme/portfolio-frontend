import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.yonnamerlini.com';

// 🎬 Détecte une vidéo Cloudinary
const isVideoUrl = (url) => /\/video\/upload\//.test(url || '');

// 🖼️ Source d'affichage : vidéo/GIF intacts, images optimisées
const mediaSrc = (url) =>
  isVideoUrl(url) || url?.includes('.gif') ? url : getOptimizedUrl(url, 1600);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetch(`${API_URL}/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('DEBUG : Le fetch a échoué :', err);
        setLoading(false);
        navigate('/404', { replace: true });
      });
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono">CHARGEMENT...</div>;
  if (!project) return null;

  const imagesArray = project?.image_url ? project.image_url.split(',').map((u) => u.trim()).filter(Boolean) : [];
  const currentMedia = imagesArray[currentImageIndex];

  return (
    <>
      <div className="min-h-screen bg-(--bg-color) text-(--text-main) px-6 py-24">
        <article className="max-w-5xl mx-auto">
          <Link to="/projects" className="text-[10px] uppercase tracking-[0.3em] text-secondary hover:text-accent font-mono mb-12 block">← RETOUR</Link>

          <header className="mb-12 text-center">
            <span className="font-bold text-[10px] uppercase tracking-[0.3em] text-accent font-mono mb-4 block">// {project.category || 'PROJET'}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">{project.title}</h1>
          </header>

          <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-mono text-secondary mb-16">
            <span>RÔLE : {project.role || 'N/A'}</span>
            <span>CLIENT : {project.client || 'Personnel'}</span>
            <span>DATE : {project.date_realisation || 'N/A'}</span>
          </div>

          {/* GALERIE PHOTO (masonry) — images uniquement */}
          {project.category?.toLowerCase() === 'photo' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {imagesArray.filter((u) => !isVideoUrl(u)).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid overflow-hidden cursor-pointer"
                  onClick={() => setHoveredImage(img)}
                >
                  <motion.img
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.5 }}
                    src={mediaSrc(img)}
                    alt={`Photo ${i + 1}`}
                    className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            /* CARROUSEL MULTIMÉDIA (web / vidéo) */
            <div className="mb-16 relative group">
              <AnimatePresence mode="wait">
                {isVideoUrl(currentMedia) ? (
                  <motion.video
                    key={currentMedia}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={currentMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full"
                  />
                ) : (
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={mediaSrc(currentMedia)}
                    alt={project.title}
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                )}
              </AnimatePresence>

              {imagesArray.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1))}
                    className="bg-black/50 text-white p-4 pointer-events-auto cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1))}
                    className="bg-black/50 text-white p-4 pointer-events-auto cursor-pointer"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION DESCRIPTION */}
          <section className="grid md:grid-cols-3 gap-16 border-t border-secondary/20 pt-16 mt-16">
            <div className="md:col-span-2 text-primary text-lg font-mono leading-relaxed space-y-6">
              {project.description ? (
                <p>{project.description.replace(/^"|"$/g, '')}</p>
              ) : (
                <p>Aucune description disponible.</p>
              )}
            </div>

            <aside className="space-y-12">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-6">Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies ? (
                    project.technologies.split(',').filter(Boolean).map((tech, i) => (
                      <span key={i} className="px-3 py-1 border border-primary text-[9px] uppercase">
                        {tech.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] opacity-50 italic">Aucune techno définie</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase text-accent hover:underline">→ Voir le projet</a>}
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase text-primary hover:underline">→ GitHub</a>}
              </div>
            </aside>
          </section>
        </article>
      </div>

      {/* LIGHTBOX PLEIN ÉCRAN (image ou vidéo) — boutons avec curseur visible */}
      <AnimatePresence>
        {hoveredImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          >
            <button
              className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl cursor-pointer"
              onClick={() => setHoveredImage(null)}
            >
              ×
            </button>

            <button
              className="absolute left-8 text-white/50 hover:text-white text-5xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = imagesArray.indexOf(hoveredImage);
                const nextIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
                setHoveredImage(imagesArray[nextIndex]);
              }}
            >
              ←
            </button>

            {isVideoUrl(hoveredImage) ? (
              <video
                key={hoveredImage}
                src={hoveredImage}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="max-h-[90vh] max-w-[90vw]"
              />
            ) : (
              <motion.img
                key={hoveredImage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                src={mediaSrc(hoveredImage)}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}

            <button
              className="absolute right-8 text-white/50 hover:text-white text-5xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = imagesArray.indexOf(hoveredImage);
                const nextIndex = (currentIndex + 1) % imagesArray.length;
                setHoveredImage(imagesArray[nextIndex]);
              }}
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetailPage;