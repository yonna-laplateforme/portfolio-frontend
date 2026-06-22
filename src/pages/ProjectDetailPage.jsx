import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:3001/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project || data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-(--bg-color) flex items-center justify-center font-mono text-(--primary-color) text-xs uppercase tracking-[0.3em]">Chargement...</div>;

  const imgSrc = project?.image_url?.startsWith('http') ? project.image_url : `http://localhost:3001${project?.image_url}`;

  return (
    <main className="min-h-screen bg-(--bg-color) text-(--text-main) px-6 py-24">
      <article className="max-w-4xl mx-auto">
        
        <Link to="/projects" className="inline-block text-[10px] uppercase tracking-[0.3em] text-(--text-secondary) hover:text-(--accent-color) mb-12 font-mono">
          ← Retour
        </Link>

        {/* 1. TITRE ET CATÉGORIE EN HAUT */}
        <header className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-(--accent-color) font-mono mb-4 block">// {project.category || "PROJET"}</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-(--primary-color) tracking-tighter">
            {project.title}
          </h1>
        </header>

        {/* 2. IMAGE */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mb-16"
        >
          <img src={imgSrc} alt={project.title} className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
        </motion.div>

        {/* 3. INFOS SOUS L'IMAGE */}
        <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-mono text-(--text-secondary) mb-16">
          <span>RÔLE : {project.role || "Développeur"}</span>
          <span>CLIENT : {project.client || "Personnel"}</span>
        </div>

        {/* 4. DESCRIPTION ET SIDEBAR */}
        <section className="grid md:grid-cols-3 gap-16 border-t border-(--text-secondary)/20 pt-16">
          <div className="md:col-span-2 text-(--text-main)/90 text-lg font-mono leading-relaxed space-y-6">
            {project.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <aside className="space-y-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-(--text-secondary) mb-6">Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.split(/[\s,]+/).filter(Boolean).map((tech, i) => (
                  <span key={i} className="px-3 py-1 border border-(--primary-color) text-(--primary-color) text-[9px] uppercase tracking-widest hover:bg-(--primary-color) hover:text-(--bg-color) transition-colors cursor-default">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase tracking-[0.3em] text-(--accent-color) hover:underline">→ Voir le projet</a>}
              {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="block text-[10px] uppercase tracking-[0.3em] text-(--primary-color) hover:underline">→ GitHub</a>}
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
};

export default ProjectDetailPage;