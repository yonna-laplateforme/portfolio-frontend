import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm("Supprimer ce projet ?")) {
      await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      fetchProjects();
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
            <h1 className="text-4xl font-serif text-zinc-900">Dashboard</h1>
            <p className="text-zinc-400 mt-2">Gérez vos projets et votre contenu.</p>
        </div>
        <Link 
          to="/admin/create" 
          className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#8C5A3C] transition-colors"
        >
          <Plus size={16} /> Ajouter un projet
        </Link>
      </div>

      <div className="border-t border-zinc-200">
        {projects.length === 0 ? (
          <p className="py-10 text-center text-zinc-400">Aucun projet trouvé.</p>
        ) : (
          projects.map((project, index) => (
            <div key={project.id ? project.id : `project-${index}`} className="flex items-center justify-between py-6 border-b border-zinc-100 hover:bg-zinc-50 transition-colors px-2">
              <div className="flex items-center gap-6">
                <img src={project.image_url} alt={project.title} className="w-20 h-14 object-cover rounded-sm" />
                <div>
                  <h3 className="font-medium text-zinc-900">{project.title}</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">{project.category || "Projet"}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link to={`/admin/edit/${project.id}`} className="text-zinc-500 hover:text-[#8C5A3C]">
                  <Edit2 size={16} />
                </Link>
                <button onClick={() => deleteProject(project.id)} className="text-zinc-500 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;