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

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-primary text-xs uppercase tracking-[0.3em]">Chargement...</div>;

  const imgSrc = project?.image_url?.startsWith('http') ? project.image_url : `http://localhost:3001${project?.image_url}`;

  return (
    <main className="min-h-screen bg-bg text-main px-6 py-24">
      <article className="max-w-5xl mx-auto">
        <nav className="mb-16">
          <Link to="/projects" className="text-[10px] uppercase tracking-[0.3em] text-primary hover:text-main transition-colors font-mono">
            ← Retour aux projets
          </Link>
        </nav>

        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase text-main leading-tight tracking-tight mb-8">
            {project.title}
          </h1>
          <div className="h-[1px] w-full bg-zinc-800 mb-8"></div>
          
          {/* INFOS COMPLÈTES (Role & Client ajoutés) */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.3em] font-mono text-primary">
            <span>Rôle : {project.role || "Développeur"}</span>
            <span>Client : {project.client || "Personnel"}</span>
          </div>
        </header>

        <section className="grid md:grid-cols-[1fr,300px] gap-16">
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-video w-full overflow-hidden border border-zinc-800 bg-zinc-900"
            >
              <img src={imgSrc} alt={project.title} className="w-full h-full object-cover" />
            </motion.div>

            <div className="text-main/80 text-lg font-mono leading-relaxed space-y-6">
              {project.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          <aside className="space-y-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">Stack Technique</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.split(',').map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-main text-[10px] uppercase tracking-[0.1em]">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-zinc-800 pt-8 space-y-4">
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noreferrer" className="block text-sm uppercase tracking-[0.1em] hover:text-primary transition-colors">
                  → Site en direct
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="block text-sm uppercase tracking-[0.1em] hover:text-primary transition-colors">
                  → Code Source
                </a>
              )}
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
};

export default ProjectDetailPage;