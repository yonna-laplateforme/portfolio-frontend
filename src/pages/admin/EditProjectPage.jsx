import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [existingImages, setExistingImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [techList, setTechList] = useState([]);
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [manualTech, setManualTech] = useState(""); 
    
    const [project, setProject] = useState({
        title: '', description: '', client: '', date_realisation: '', role: '',
        github_url: '', demo_url: '', visibility: 'Publié', isFeatured: false
    });

    useEffect(() => {
        Promise.all([
            apiFetch(`api/projects/${id}`),
            apiFetch(`api/technologies`)
        ]).then(([projectData, techsData]) => {
            if (techsData) setTechList(techsData);
            if (projectData) {
                const sanitizedData = Object.keys(projectData).reduce((acc, key) => {
                    acc[key] = projectData[key] === null ? "" : projectData[key];
                    return acc;
                }, {});
                setProject(sanitizedData);
                setExistingImages(projectData.image_url ? projectData.image_url.split(',').map(u => u.trim()) : []);
                if (projectData.technologies && typeof projectData.technologies === 'string' && techsData) {
                    const projectTechNames = projectData.technologies.split(',').map(t => t.trim());
                    const matchedIds = techsData
                        .filter(t => projectTechNames.includes(t.name))
                        .map(t => t.id.toString());
                    setSelectedTechs(matchedIds);
                }
            }
        });
    }, [id]);

    const handleAddManualTech = async () => {
        if (!manualTech.trim()) return;
        try {
            const response = await apiFetch(`api/technologies`, {
                method: 'POST',
                body: JSON.stringify({ name: manualTech }),
                headers: { 'Content-Type': 'application/json' }
            });
            setTechList([...techList, response]);
            setManualTech("");
        } catch (err) { alert("Erreur ajout techno"); }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleTechChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTechs(prev => checked ? [...prev, value] : prev.filter(id => id !== value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(project).forEach(key => {
            if (key !== 'technologies' && key !== 'image_url' && key !== 'category') {
                formData.append(key, key === 'isFeatured' ? (project.isFeatured ? 1 : 0) : project[key]);
            }
        });
        selectedTechs.forEach(techId => formData.append('technologies[]', techId));
        formData.append('existingImages', JSON.stringify(existingImages));
        newFiles.forEach((file) => formData.append('images', file));

        try {
            await apiFetch(`api/projects/${id}`, { method: 'PUT', body: formData });
            alert("Projet modifié avec succès !");
            navigate('/dashboard-yonna-2026');
        } catch (err) { alert("Erreur lors de la modification"); }
    };

    return (
        <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* TON HEADER AVEC ANIMATION */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
                    <button onClick={() => navigate('/dashboard-yonna-2026')} className="font-mono text-[10px] font-bold opacity-60 hover:opacity-100 hover:text-(--accent-color) uppercase tracking-widest transition-all flex items-center gap-2 mb-6 cursor-pointer">
                        <span>←</span> Retour au dashboard
                    </button>
                    <h2 className="font-heading text-4xl font-bold uppercase mb-2 tracking-wide text-(--primary-color)">Modifier le projet</h2>
                    <div className="h-0.5 w-12 bg-(--accent-color) mt-4"></div>
                </motion.div>

                {/* TON FORMULAIRE COMPLET */}
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        {/* SECTION INFO & TECHS */}
                        <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                            <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20" value={project.title} onChange={e => setProject({...project, title: e.target.value})} placeholder="Titre" />
                            
                            <div className="grid grid-cols-2 gap-6">
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20" value={project.client} onChange={e => setProject({...project, client: e.target.value})} placeholder="Client" />
                                <input className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20" value={project.date_realisation} onChange={e => setProject({...project, date_realisation: e.target.value})} placeholder="Date" />
                            </div>

                            <textarea className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 h-32" value={project.description} onChange={e => setProject({...project, description: e.target.value})} />

                            {/* SECTION TECHS MODIFIÉE */}
                            <div className="pt-4 border-t">
                                <label className="font-mono text-[10px] font-bold opacity-60 uppercase mb-3 block">Technologies</label>
                                <div className="flex gap-2 mb-4">
                                    <input className="flex-1 p-2 bg-bg border border-(--primary-color)/20 text-sm" placeholder="Ajouter une techno..." value={manualTech} onChange={e => setManualTech(e.target.value)} />
                                    <button type="button" onClick={handleAddManualTech} className="px-4 bg-(--primary-color) text-white text-xs uppercase font-bold">Ajouter</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {techList.map((tech) => (
                                        <label key={tech.id} className="flex items-center gap-2 text-xs uppercase font-mono">
                                            <input type="checkbox" value={tech.id.toString()} checked={selectedTechs.includes(tech.id.toString())} onChange={handleTechChange} />
                                            {tech.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* COLONNE DROITE ET FOOTER ... etc */}
                </motion.form>
            </div>
        </div>
    );
};

export default EditProject;