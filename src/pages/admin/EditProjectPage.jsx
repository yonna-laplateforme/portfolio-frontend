import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // États pour les médias
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    
    // États pour les technologies
    const [techList, setTechList] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [manualTech, setManualTech] = useState(""); // Pour l'ajout rapide de techno
    
    const [project, setProject] = useState({
        title: '', description: '', client: '', date_realisation: '', role: '',
        github_url: '', demo_url: '', visibility: 'Publié', isFeatured: false
    });

    useEffect(() => {
        // On charge les technologies ET le projet en parallèle pour gagner du temps
        Promise.all([
            apiFetch(`api/projects/${id}`),
            apiFetch(`api/technologies`)
        ]).then(([projectData, techsData]) => {
            if (techsData) setTechList(techsData);

            if (projectData) {
                // Sanitize : transforme null en ""
                const sanitizedData = Object.keys(projectData).reduce((acc, key) => {
                    acc[key] = projectData[key] === null ? "" : projectData[key];
                    return acc;
                }, {});
                setProject(sanitizedData);
                
                setExistingImages(projectData.image_url ? projectData.image_url.split(',').map(u => u.trim()) : []);

                // Logique sécurisée pour pré-cocher les bonnes technologies
                if (projectData.technologies && typeof projectData.technologies === 'string' && techsData) {
                    const projectTechNames = projectData.technologies.split(',').map(t => t.trim());
                    const matchedIds = techsData
                        .filter(t => projectTechNames.includes(t.name))
                        .map(t => t.id.toString());
                    setSelectedTechs(matchedIds);
                }
            }
        }).catch(err => console.error("Erreur de chargement des données:", err));
    }, [id]);

    // Fonction d'ajout rapide d'une technologie
    const handleAddManualTech = async () => {
        if (!manualTech.trim()) return;
        try {
            const response = await apiFetch(`api/technologies`, {
                method: 'POST',
                body: JSON.stringify({ name: manualTech }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response) {
                setTechList([...techList, response]);
                setManualTech("");
            }
        } catch (err) {
            console.error("Erreur lors de l'ajout de la technologie:", err);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    // Gestion individuelle des cases à cocher
    const handleTechChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedTechs([...selectedTechs, value]);
        } else {
            setSelectedTechs(selectedTechs.filter(techId => techId !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.keys(project).forEach(key => {
            // On exclut les champs virtuels ou obsolètes pour ne pas polluer l'envoi
            if (key !== 'tech_stack' && key !== 'technologies' && key !== 'image_url' && key !== 'category') {
                formData.append(key, key === 'isFeatured' ? (project.isFeatured ? 1 : 0) : project[key]);
            }
        });
        
        // On attache le tableau des identifiants des technologies cochées
        selectedTechs.forEach(techId => {
            formData.append('technologies[]', techId);
        });
        
        formData.append('existingImages', JSON.stringify(existingImages));
        
        newFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await apiFetch(`api/projects/${id}`, { method: 'PUT', body: formData });
            alert("Projet modifié avec succès !");
            navigate('/dashboard-yonna-2026');
        } catch (err) {
            alert("Erreur lors de la modification");
        }
    };

    return (
        <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
                    <button onClick={() => navigate('/dashboard-yonna-2026')} className="font-mono text-[10px] font-bold opacity-60 hover:opacity-100 hover:text-(--accent-color) uppercase tracking-widest transition-all flex items-center gap-2 mb-6 cursor-pointer">
                        <span>←</span> Retour au dashboard
                    </button>
                    <h2 className="font-heading text-4xl font-bold uppercase mb-2 tracking-wide text-(--primary-color)">Modifier le projet</h2>
                    <div className="h-0.5 w-12 bg-(--accent-color) mt-4"></div>
                </motion.div>

                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    
                    {/* COLONNE GAUCHE */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="font-heading text-lg uppercase text-(--primary-color) mb-4 border-b border-(--primary-color)/10 pb-2">Informations générales</h3>
                            
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre *</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.title} onChange={e => setProject({...project, title: e.target.value})} required />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.client} onChange={e => setProject({...project, client: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Date</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.date_realisation} onChange={e => setProject({...project, date_realisation: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Description</label>
                                <textarea className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-32 resize-none focus:border-(--accent-color) outline-none transition-colors" value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
                            </div>
                            
                            {/* SECTION MODIFIÉE : Champ d'ajout rapide + Checkboxes */}
                            <div className="space-y-3 pt-4 border-t border-(--primary-color)/10">
                                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Technologies Utilisées</label>
                                
                                {/* Formulaire d'ajout rapide inline */}
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        type="text" 
                                        value={manualTech}
                                        onChange={(e) => setManualTech(e.target.value)}
                                        placeholder="Ajouter une techno manquante..."
                                        className="flex-1 p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddManualTech}
                                        className="px-6 bg-(--primary-color) text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-(--accent-color) transition-colors cursor-pointer"
                                    >
                                        Ajouter
                                    </button>
                                </div>

                                {techList.length === 0 ? (
                                    <p className="text-sm opacity-50 italic">Chargement des technologies...</p>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-bg/30 border border-(--primary-color)/10">
                                        {techList.map((tech) => (
                                            <label key={tech.id} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    value={tech.id.toString()} 
                                                    checked={selectedTechs.includes(tech.id.toString())}
                                                    onChange={handleTechChange}
                                                    className="w-4 h-4 cursor-pointer accent-(--accent-color)" 
                                                />
                                                <span className="font-mono text-xs uppercase group-hover:text-(--accent-color) transition-colors">{tech.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Liens externes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-(--primary-color)/10">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien GitHub</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.github_url} onChange={e => setProject({...project, github_url: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien Démo</label>
                                    <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.demo_url} onChange={e => setProject({...project, demo_url: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* MÉDIAS COMPLETS */}
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <h3 className="font-heading text-lg uppercase text-(--primary-color) mb-4 border-b border-(--primary-color)/10 pb-2">Galerie Photos</h3>
                            
                            {existingImages.length > 0 && (
                                <div className="space-y-2">
                                    <p className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest mb-2">Images actuelles</p>
                                    <div className="grid grid-cols-4 gap-4 mb-6">
                                        {existingImages.map((url, i) => <img key={i} src={url} className="w-full h-24 object-cover border border-(--primary-color)/20 shadow-sm" alt="existant" />)}
                                    </div>
                                </div>
                            )}
                            
                            <label className="relative flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 cursor-pointer hover:border-(--accent-color) transition-colors">
                                <div className="text-center p-4">
                                    {newFiles.length > 0 ? (
                                        <div className="flex flex-wrap gap-4 justify-center">
                                            {previews.map((src, index) => (
                                                <img key={index} src={src} className="w-16 h-16 object-cover border border-(--primary-color)/20 shadow-sm" alt="Aperçu" />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="font-mono text-xs opacity-60 uppercase tracking-widest">Ajouter de nouvelles photos</p>
                                    )}
                                </div>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* COLONNE DROITE COMPLÈTE */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6 sticky top-8">
                            <h3 className="font-heading text-lg uppercase text-(--primary-color) pb-4 border-b border-(--primary-color)/10">Statut & Options</h3>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 cursor-pointer accent-(--accent-color)" checked={!!project.isFeatured} onChange={e => setProject({...project, isFeatured: e.target.checked})} />
                                <span className="font-mono text-xs uppercase opacity-80 group-hover:text-(--accent-color) transition-colors">Mettre à la une</span>
                            </label>
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Rôle</label>
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" value={project.role} onChange={e => setProject({...project, role: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-(--primary-color) text-white py-4 text-xs font-mono font-bold uppercase tracking-widest hover:bg-(--accent-color) transition-colors cursor-pointer mt-4">Mettre à jour</button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default EditProject;