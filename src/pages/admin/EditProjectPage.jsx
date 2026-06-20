import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [project, setProject] = useState({
        title: '',
        description: '',
        client: '',
        date_realisation: '',
        role: '',
        tech_stack: '',
        github_url: '',
        demo_url: '',
        visibility: 'Publié',
        isFeatured: false
    });

    useEffect(() => {
        fetch(`http://localhost:3001/api/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                setProject({
                    title: data.title || '',
                    description: data.description || '',
                    client: data.client || '',
                    date_realisation: data.date_realisation || '',
                    role: data.role || '',
                    tech_stack: data.tech_stack || '',
                    github_url: data.github_url || '',
                    demo_url: data.demo_url || '',
                    visibility: data.visibility || 'Publié',
                    isFeatured: Number(data.isFeatured) === 1
                });
            })
            .catch(err => console.error("Erreur chargement:", err));
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
        const token = localStorage.getItem("token");
        const formData = new FormData();
        
        // Ajout de tous les champs
        formData.append('title', project.title);
        formData.append('description', project.description);
        formData.append('tech_stack', project.tech_stack);
        formData.append('client', project.client);
        formData.append('date_realisation', project.date_realisation);
        formData.append('role', project.role);
        formData.append('github_url', project.github_url || '');
        formData.append('demo_url', project.demo_url || '');
        formData.append('visibility', project.visibility);
        formData.append('isFeatured', project.isFeatured ? 1 : 0);
        
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert("Projet modifié !");
                navigate('/');
            } else {
                alert("Erreur lors de la modification");
            }
        } catch (err) {
            console.error("Crash:", err);
        }
    };

    return (
        <div className="bg-[#fcfaf8] text-[#333] font-sans p-6 md:p-10 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <button onClick={() => navigate('/')} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6">
                        <span>←</span> Retour aux projets
                    </button>
                    <h2 className="text-4xl font-light mb-2 tracking-wide">Modifier le projet</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* COLONNE GAUCHE */}
                    <div className="flex-1 space-y-8">
                        <div className="bg-white p-8 border border-[#f0ebe1] shadow-sm space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Informations générales</h3>
                            <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.title} onChange={e => setProject({...project, title: e.target.value})} placeholder="Titre *" required />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.client} onChange={e => setProject({...project, client: e.target.value})} placeholder="Client" />
                                <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.date_realisation} onChange={e => setProject({...project, date_realisation: e.target.value})} placeholder="Date" />
                            </div>

                            <textarea className="w-full p-4 bg-[#f8f6f3] border border-[#e8e4dc] text-sm h-32" value={project.description} onChange={e => setProject({...project, description: e.target.value})} placeholder="Description" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.github_url} onChange={e => setProject({...project, github_url: e.target.value})} placeholder="Lien GitHub" />
                                <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.demo_url} onChange={e => setProject({...project, demo_url: e.target.value})} placeholder="Lien Démo" />
                            </div>
                        </div>

                        <div className="bg-white p-8 border border-[#f0ebe1] shadow-sm space-y-6">
                            <h3 className="text-lg font-medium text-gray-800">Médias</h3>
                            <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#d9d4cc] bg-[#faf8f5] cursor-pointer">
                                <p className="text-sm text-gray-500">Glissez-déposez une nouvelle image ici</p>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                            {preview && <img src={preview} className="w-40 h-28 object-cover" alt="Aperçu" />}
                        </div>
                    </div>

                    {/* COLONNE DROITE */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="bg-white p-6 border border-[#f0ebe1] shadow-sm space-y-5">
                            <h3 className="text-lg font-medium text-gray-800">Statut & Rôle</h3>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={!!project.isFeatured} onChange={e => setProject({...project, isFeatured: e.target.checked})} />
                                <span className="text-sm">Mettre en avant</span>
                            </label>
                            <input className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] text-sm" value={project.role} onChange={e => setProject({...project, role: e.target.value})} placeholder="Votre rôle" />
                            <button type="submit" className="w-full bg-[#B0D0D3] text-white py-3.5 text-xs font-bold uppercase tracking-widest">Mettre à jour</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProject;