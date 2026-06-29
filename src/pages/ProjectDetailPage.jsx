import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-7xj4.onrender.com";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null); // <--- DÉCLARÉ ICI

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    fetch(`${API_URL}/api/projects/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur API");
        return res.json();
      })
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("DEBUG : Le fetch a échoué :", err);
        setLoading(false);
        navigate('/404', { replace: true });
      });
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono">CHARGEMENT...</div>;
  if (!project) return null;

  const imagesArray = project?.image_url ? project.image_url.split(',').map(u => u.trim()) : [];

  return (
    <>
      <main className="min-h-screen bg-(--bg-color) text-(--text-main) px-6 py-24">
        <article className="max-w-5xl mx-auto">
          <Link to="/projects" className="text-[10px] uppercase tracking-[0.3em] text-secondary hover:text-accent font-mono mb-12 block">← RETOUR</Link>

          <header className="mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono mb-4 block">// {project.category || "PROJET"}</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">{project.title}</h1>
          </header>

          {project.category?.toLowerCase() === 'photo' ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {imagesArray.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid overflow-hidden cursor-pointer"
                  onClick={() => setHoveredImage(img)} // <--- UTILISE BIEN LE SETTER ICI
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
             /* ... ton code carrousel Web inchangé ... */
             <div>(Contenu Web)</div>
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-0 cursor-pointer"
            onClick={() => setHoveredImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.98 }} 
              animate={{ scale: 1 }}
              src={hoveredImage} 
              className="w-full h-full object-contain cursor-default" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetailPage;