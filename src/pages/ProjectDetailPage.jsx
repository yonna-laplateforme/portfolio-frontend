import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.yonnamerlini.com';
const isVideoUrl = (u) => /\/video\/upload\//.test(u || '');
const mediaSrc = (url) =>
  isVideoUrl(url) || url?.includes('.gif') ? url : getOptimizedUrl(url, 1600);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then((data) => { setProject(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate('/404', { replace: true }); });
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-sm tracking-widest text-ink-soft">CHARGEMENT…</div>;
  if (!project) return null;

  const mediaArray = project.image_url ? project.image_url.split(',').map((u) => u.trim()).filter(Boolean) : [];
  const heroMedia = mediaArray[0];
  const gallery = mediaArray.slice(1);

  return (
    <>
      <article className="min-h-screen bg-paper text-ink px-6 md:px-12 pt-28 pb-24">
        <div className="max-w-6xl mx-auto">

          {/* EN-TÊTE ÉDITORIAL */}
          <Link to="/projects" className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft hover:text-brick transition-colors">← Retour aux projets</Link>

          <header className="mt-10 mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-brick mb-6">
              // {project.category || 'PROJET'}
            </p>
            <h1 className="font-display font-light text-5xl md:text-7xl leading-[0.95]">
              {project.title}
            </h1>
          </header>

          <div className="flex flex-wrap gap-x-10 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft border-y border-ink/10 py-5 mb-14">
            {project.client && <span>Client — {project.client}</span>}
            {project.date_realisation && <span>Date — {project.date_realisation}</span>}
            {project.role && <span>Rôle — {project.role}</span>}
          </div>

          {/* MÉDIA HERO */}
          {heroMedia && (
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              {isVideoUrl(heroMedia) ? (
                <video src={heroMedia} autoPlay muted loop playsInline controls className="w-full aspect-video object-cover bg-sand/40" />
              ) : (
                <img src={mediaSrc(heroMedia)} alt={project.title} className="w-full aspect-video object-cover bg-sand/40" />
              )}
            </motion.div>
          )}

          {/* CONTENU : texte + sidebar */}
          <section className="grid md:grid-cols-3 gap-12 md:gap-16 mt-20">
            <div className="md:col-span-2">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-brick mb-8">// Le projet</p>
              <div className="text-lg md:text-xl leading-relaxed text-ink-soft space-y-6 max-w-2xl">
                {project.description
                  ? project.description.replace(/^"|"$/g, '').split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
                  : <p>Aucune description disponible.</p>}
              </div>
            </div>

            <aside className="space-y-12">
              {project.technologies && (
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-brick mb-6">Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').filter(Boolean).map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 border border-ink/15 font-mono text-[10px] uppercase tracking-widest text-ink">{tech.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {(project.demo_url || project.github_url) && (
                <div className="space-y-4">
                  <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-brick mb-6">Liens</h2>
                  {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="block font-mono text-xs uppercase tracking-[0.25em] text-ink hover:text-brick transition-colors">→ Voir le projet</a>}
                  {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="block font-mono text-xs uppercase tracking-[0.25em] text-ink hover:text-brick transition-colors">→ GitHub</a>}
                </div>
              )}
            </aside>
          </section>

          {/* GALERIE COMPLÈTE */}
        
{gallery.length > 0 && (
  <section className="mt-24">
    <p className="font-mono text-xs uppercase tracking-[0.35em] text-brick mb-10">// Galerie</p>
    <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
      {gallery.map((media, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setHoveredImage(media)}
          className="block w-full overflow-hidden bg-sand/40 cursor-pointer break-inside-avoid"
        >
          {isVideoUrl(media) ? (
            // vidéo : ratio natif 16:9 (aucun rognage)
            <video src={media} muted autoPlay loop playsInline className="w-full aspect-video object-cover block" />
          ) : (
            // photo : sa VRAIE proportion (portrait ou paysage)
            <img
              src={mediaSrc(media)}
              alt={`${project.title} — ${i + 1}`}
              loading="lazy"
              className="w-full h-auto block zoom-img"
            />
          )}
        </motion.button>
      ))}
    </div>
  </section>
)}
          
        </div>
      </article>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {hoveredImage !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
            <button className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl cursor-pointer" onClick={() => setHoveredImage(null)}>×</button>
            <button className="absolute left-8 text-white/50 hover:text-white text-5xl cursor-pointer" onClick={(e) => { e.stopPropagation(); const idx = mediaArray.indexOf(hoveredImage); setHoveredImage(mediaArray[(idx - 1 + mediaArray.length) % mediaArray.length]); }}>←</button>
            {isVideoUrl(hoveredImage) ? (
              <video key={hoveredImage} src={hoveredImage} autoPlay muted loop playsInline controls className="max-h-[90vh] max-w-[90vw]" />
            ) : (
              <motion.img key={hoveredImage} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} src={mediaSrc(hoveredImage)} className="max-h-[90vh] max-w-[90vw] object-contain" />
            )}
            <button className="absolute right-8 text-white/50 hover:text-white text-5xl cursor-pointer" onClick={(e) => { e.stopPropagation(); const idx = mediaArray.indexOf(hoveredImage); setHoveredImage(mediaArray[(idx + 1) % mediaArray.length]); }}>→</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetailPage;