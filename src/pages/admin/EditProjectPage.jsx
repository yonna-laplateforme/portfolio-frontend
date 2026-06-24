import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [project, setProject] = useState({
        title: '', description: '', client: '', date_realisation: '', role: '',
        tech_stack: '', github_url: '', demo_url: '', visibility: 'Publié', isFeatured: false
    });

    useEffect(() => {
  apiFetch(`/projects/${id}`).then((data) => {
    if (data) {
      // Nettoyage : transforme chaque null en ""
      const sanitizedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] === null ? "" : data[key];
        return acc;
      }, {});
      setProject(sanitizedData);
    }
  });
}, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.keys(project).forEach(key => {
            formData.append(key, key === 'isFeatured' ? (project.isFeatured ? 1 : 0) : project[key]);
        });
        if (selectedFile) formData.append('image', selectedFile);

        try {
            await apiFetch(`/projects/${id}`, { method: 'PUT', body: formData });
            alert("Projet modifié !");
            navigate('/admin');
        } catch (err) {
            alert(err.message || "Erreur lors de la modification");
        }
    };
    return (
        <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-10"
                >
                    <button 
                        onClick={() => navigate('/admin')} 
                        className="text-[10px] font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent-color)] uppercase tracking-widest transition-all flex items-center gap-2 mb-6"
                    >
                        <span>←</span> Retour au dashboard
                    </button>
                    <h2 className="text-4xl font-light mb-2 tracking-wide text-[var(--primary-color)]">Modifier le projet</h2>
                    <div className="h-0.5 w-12 bg-[var(--accent-color)] mt-4"></div>
                </motion.div>

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    onSubmit={handleSubmit} 
                    className="flex flex-col lg:flex-row gap-8"
                >
                    {/* COLONNE GAUCHE */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-white p-8 border border-[var(--primary-color)]/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-[var(--primary-color)] mb-4">Informations générales</h3>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre *</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.title} onChange={e => setProject({...project, title: e.target.value})} placeholder="Nom du projet" required />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.client} onChange={e => setProject({...project, client: e.target.value})} placeholder="Nom du client ou Projet personnel" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Date de réalisation</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.date_realisation} onChange={e => setProject({...project, date_realisation: e.target.value})} placeholder="Ex: 2026" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Description</label>
                                <textarea className="w-full p-4 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main h-32 resize-none" value={project.description} onChange={e => setProject({...project, description: e.target.value})} placeholder="Expliquez le concept, les défis, les solutions..." />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Stack technique</label>
                                <input 
                                    className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" 
                                    value={project.tech_stack} 
                                    onChange={e => setProject({...project, tech_stack: e.target.value})} 
                                    placeholder="React, Tailwind, Node.js..." 
                                />
                                <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1">Séparez les technologies par des virgules</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien GitHub</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.github_url} onChange={e => setProject({...project, github_url: e.target.value})} placeholder="https://github.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien Démo</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.demo_url} onChange={e => setProject({...project, demo_url: e.target.value})} placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 border border-[var(--primary-color)]/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-[var(--primary-color)] mb-2">Médias</h3>
                            <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block mb-4">Image de couverture</label>
                            
                            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--primary-color)]/30 bg-bg/30 hover:bg-bg/60 transition-colors cursor-pointer group overflow-hidden">
                                {preview ? (
                                    <>
                                        <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" alt="Aperçu" />
                                        <p className="relative z-10 text-sm font-bold text-[var(--primary-color)] bg-white/80 px-4 py-2">Changer l'image</p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-4">
                                        <span className="text-2xl mb-2 opacity-50">📁</span>
                                        <p className="text-sm opacity-60">Glissez-déposez une nouvelle image ici</p>
                                        <p className="text-[10px] opacity-40 uppercase tracking-widest mt-2">ou cliquez pour parcourir</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* COLONNE DROITE */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="bg-white p-6 md:p-8 border border-[var(--primary-color)]/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-[var(--primary-color)] pb-4 border-b border-[var(--primary-color)]/10">Statut & Options</h3>
                            
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer appearance-none w-5 h-5 border border-[var(--primary-color)]/30 checked:bg-[var(--accent-color)] checked:border-[var(--accent-color)] transition-colors cursor-pointer"
                                        checked={!!project.isFeatured} 
                                        onChange={e => setProject({...project, isFeatured: e.target.checked})} 
                                    />
                                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">Mettre en avant sur l'accueil</span>
                            </label>

                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Votre rôle</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-[var(--primary-color)]/20 focus:outline-none focus:border-[var(--accent-color)] transition-colors text-sm text-text-main" value={project.role} onChange={e => setProject({...project, role: e.target.value})} placeholder="Ex: Développeur Fullstack" />
                            </div>
                            
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-[var(--accent-color)] text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all">
                                    Mettre à jour le projet
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default EditProject;