import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const { token } = useAuth(); 

 const fetchProjects = async () => {
    try {
      const data = await apiFetch('api/projects'); 
      setProjects(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Supprimer ce projet ?")) {
      try {
        await apiFetch(`api/projects/${id}`, {
          method: 'DELETE',
       
        });
        fetchProjects();
      } catch (error) {
        console.error("Erreur :", error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
  
    <div className="min-h-screen flex flex-col bg-bg text-text-main font-sans pt-24 pb-20 px-6">
      
     
      <div className="max-w-5xl mx-auto w-full flex-1">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12"
        >
          <div>
              <h1 className="font-heading text-4xl font-bold uppercase text-(--primary-color) mb-2">DASHBOARD</h1>
              <div className="h-0.5 w-12 bg-(--accent-color) mb-4"></div>
              <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest">Gérez vos projets et votre contenu.</p>
          </div>
          <Link 
            to="/secret-yonna-create" 
            className="flex items-center gap-2 bg-(--accent-color) text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
          >
            <Plus size={16} /> Ajouter un projet
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
        >
          {/* GESTION PAGE À PROPOS */}
        <section className="mb-12">
          <div className="flex items-center justify-between p-6 bg-white border border-(--primary-color)/10 shadow-sm">
            <div>
              <h2 className="font-bold uppercase text-sm tracking-widest text-(--primary-color)">Page "À Propos"</h2>
              <p className="font-mono text-[10px] opacity-60 mt-1 uppercase">Gérez votre bio, vos expertises et votre philosophie.</p>
            </div>
            <Link 
              to="/secret-yonna-edit-about" // Assure-toi que cette route existe dans ton App.js
              className="flex items-center gap-2 border border-(--primary-color)/20 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-(--primary-color) hover:text-white transition-all"
            >
              <Edit2 size={16} /> Modifier la page
            </Link>
          </div>
        </section>
          {projects.length === 0 ? (
            <p className="py-16 text-center text-sm opacity-50 font-medium">Aucun projet trouvé pour le moment.</p>
          ) : (
            <div className="divide-y divide-(--primary-color)/10">
              {projects.map((project, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={project.id || `project-${index}`} 
                  className="flex items-center justify-between p-6 hover:bg-bg/30 transition-colors group"
                >
                  <div className="flex items-center gap-6">
                    {/* Conteneur image stylisé */}
                    {/* Conteneur image stylisé */}
                    <div className="w-24 h-16 bg-bg/50 border border-(--primary-color)/10 overflow-hidden shrink-0">
                      {project.image_url ? (
                        <img 
                          src={project.image_url.split(',')[0]} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30 text-xs">IMG</div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-(--primary-color) text-lg mb-1">{project.title}</h3>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest">
                        {project.technologies || "Projet"} {project.isFeatured ? "• À la une" : ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 sm:gap-5">
                    <Link 
                      to={`/secret-yonna-edit/${project.id}`}
                      className="p-2 text-(--primary-color) opacity-50 hover:opacity-100 hover:text-(--accent-color) hover:bg-(--accent-color)/10 rounded-full transition-all"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => deleteProject(project.id)} 
                      className="p-2 text-(--primary-color) opacity-50 hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;