import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // États pour les images
    const [existingImages, setExistingImages] = useState([]); // Photos venant de la BDD
    const [newFiles, setNewFiles] = useState([]);             // Nouveaux fichiers à uploader
    const [previews, setPreviews] = useState([]);             // Aperçus des nouveaux fichiers
    
    const [project, setProject] = useState({
        title: '', description: '', client: '', date_realisation: '', role: '',
        tech_stack: '', github_url: '', demo_url: '', visibility: 'Publié', isFeatured: false
    });

    useEffect(() => {
        apiFetch(`api/projects/${id}`).then((data) => {
            if (data) {
                // Sanitize : transforme null en ""
                const sanitizedData = Object.keys(data).reduce((acc, key) => {
                    acc[key] = data[key] === null ? "" : data[key];
                    return acc;
                }, {});
                setProject(sanitizedData);
                // On extrait les images existantes (séparées par des virgules)
                setExistingImages(data.image_url ? data.image_url.split(',').map(u => u.trim()) : []);
            }
        });
    }, [id]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Ajoute les infos textes
    Object.keys(project).forEach(key => {
        formData.append(key, key === 'isFeatured' ? (project.isFeatured ? 1 : 0) : project[key]);
    });
    
    // AJOUT IMPORTANT : Envoie la liste des photos déjà existantes
    // pour que le serveur sache lesquelles garder.
    formData.append('existingImages', JSON.stringify(existingImages));
    
    // Ajoute les NOUVEAUX fichiers
    newFiles.forEach((file) => {
        formData.append('images', file);
    });

    try {
        await apiFetch(`api/projects/${id}`, { method: 'PUT', body: formData });
        alert("Projet modifié !");
        navigate('/dashboard-yonna-2026');
    } catch (err) {
        alert("Erreur lors de la modification");
    }
};

    return (
        <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
                    <button onClick={() => navigate('/dashboard-yonna-2026')} className="text-[10px] font-bold opacity-60 hover:opacity-100 hover:text-[var(--accent-color)] uppercase tracking-widest transition-all flex items-center gap-2 mb-6">
                        <span>←</span> Retour au dashboard
                    </button>
                    <h2 className="text-4xl font-light mb-2 tracking-wide text-(--primary-color)">Modifier le projet</h2>
                    <div className="h-0.5 w-12 bg-(--accent-color) mt-4"></div>
                </motion.div>

                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* COLONNE GAUCHE */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-(--primary-color) mb-4">Informations générales</h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre *</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" value={project.title} onChange={e => setProject({...project, title: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" value={project.client} onChange={e => setProject({...project, client: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Date</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" value={project.date_realisation} onChange={e => setProject({...project, date_realisation: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Description</label>
                                <textarea className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-32 resize-none" value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Stack technique</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" value={project.tech_stack} onChange={e => setProject({...project, tech_stack: e.target.value})} />
                            </div>
                        </div>

                        {/* MÉDIAS CORRIGÉS */}
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-(--primary-color) mb-4">Galerie Photos</h3>
                            {/* Images existantes */}
                            <div className="grid grid-cols-4 gap-4">
                                {existingImages.map((url, i) => <img key={i} src={url} className="w-full h-24 object-cover border" alt="existant" />)}
                            </div>
                            {/* Ajouter nouvelles */}
                            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 cursor-pointer">
                                <div className="text-center">
                                    <p className="text-sm opacity-60">{newFiles.length > 0 ? `${newFiles.length} photo(s) ajoutée(s)` : "Ajouter de nouvelles photos"}</p>
                                </div>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* COLONNE DROITE */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="text-lg font-medium text-(--primary-color) pb-4 border-b">Statut & Options</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5" checked={!!project.isFeatured} onChange={e => setProject({...project, isFeatured: e.target.checked})} />
                                <span className="text-sm opacity-80">Mettre en avant</span>
                            </label>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold opacity-60 uppercase">Rôle</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" value={project.role} onChange={e => setProject({...project, role: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-(--accent-color) text-white py-4 text-xs font-bold uppercase transition-all">Mettre à jour</button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default EditProject;