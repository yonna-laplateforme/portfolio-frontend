import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const baseUrl = import.meta.env.VITE_API_URL ;
    
    fetch(`${baseUrl}/projects/${id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => navigate('/404', { replace: true }));
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono">CHARGEMENT...</div>;

  const imagesArray = project?.image_url ? project.image_url.split(',').map(u => u.trim()) : [];

  return (
    <>
      <main className="min-h-screen bg-(--bg-color) text-(--text-main) px-6 py-24">
        <article className="max-w-5xl mx-auto">
          <Link to="/projects" className="text-[10px] uppercase tracking-[0.3em] text-secondary hover:text-accent font-mono mb-12 block">← RETOUR</Link>

          {/* HEADER */}
          <header className="mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono mb-4 block">// {project.category || "PROJET"}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">{project.title}</h1>
          </header>

          {/* INFOS GÉNÉRALES */}
          <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-mono text-secondary mb-16">
            <span>RÔLE : {project.role || "N/A"}</span>
            <span>CLIENT : {project.client || "Personnel"}</span>
            <span>DATE : {project.date_realisation || "N/A"}</span>
          </div>

          {/* AFFICHAGE CONDITIONNEL */}
         {project.category?.toLowerCase() === 'photo' ? (
  /* GALERIE ORGANIQUE (Masonry-like) */
  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
    {imagesArray.map((img, i) => (
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
          src={img} 
          alt={`Photo ${i + 1}`}
          className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
        />
      </motion.div>
              ))}
            </div>
          ) : (
            <div>
              {/* CARROUSEL WEB */}
              <div className="mb-16 relative group">
                <AnimatePresence mode='wait'>
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={imagesArray[currentImageIndex]} 
                    alt={project.title} 
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                </AnimatePresence>
                {imagesArray.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setCurrentImageIndex(prev => (prev === 0 ? imagesArray.length - 1 : prev - 1))} className="bg-black/50 text-white p-4">←</button>
                    <button onClick={() => setCurrentImageIndex(prev => (prev === imagesArray.length - 1 ? 0 : prev + 1))} className="bg-black/50 text-white p-4">→</button>
                  </div>
                )}
              </div>

              {/* DÉTAILS WEB */}
              <section className="grid md:grid-cols-3 gap-16 border-t border-secondary/20 pt-16">
                <div className="md:col-span-2 text-primary text-lg font-mono leading-relaxed space-y-6">
                  {project.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <aside className="space-y-12">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-6">Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.split(/[\s,]+/).filter(Boolean).map((tech, i) => (
                        <span key={i} className="px-3 py-1 border border-primary text-[9px] uppercase">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase text-accent hover:underline">→ Voir le projet</a>}
                    {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase text-primary hover:underline">→ GitHub</a>}
                  </div>
                </aside>
              </section>
            </div>
          )}
        </article>
      </main>

    {/* OVERLAY PLEIN ÉCRAN */}
<AnimatePresence>
  {hoveredImage && (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      // On supprime toute marge (p-0)
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-0 cursor-pointer"
      onClick={() => setHoveredImage(null)}
    >
      <motion.img 
        initial={{ scale: 0.98 }} 
        animate={{ scale: 1 }}
        src={hoveredImage} 
        // W-full et H-full forcent les dimensions
        // object-contain garde les proportions sans couper l'image
        className="w-full h-full object-contain cursor-default" 
      />
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
};

export default ProjectDetailPage;