import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form'; 
import { useAuth } from '../../context/AuthProvider'; 

const CreateProject = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { register, handleSubmit } = useForm(); 

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techList, setTechList] = useState([]); 
  const [manualTech, setManualTech] = useState(""); // NOUVEAU

  const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-7xj4.onrender.com";

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/technologies`);
        if (response.ok) {
          const data = await response.json();
          setTechList(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des technologies:", err);
      }
    };
    fetchTechnologies();
  }, [API_URL]);

  // NOUVEAU : Fonction pour ajouter une techno rapidement
  const handleAddManualTech = async () => {
    if (!manualTech.trim()) return;
    try {
      const response = await fetch(`${API_URL}/api/technologies`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: manualTech })
      });
      if (response.ok) {
        const newTech = await response.json();
        setTechList([...techList, newTech]);
        setManualTech("");
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'technologies') {
        const techs = Array.isArray(data[key]) ? data[key] : [data[key]];
        techs.forEach(techId => { if (techId) formData.append('technologies[]', techId); });
      } else {
        formData.append(key, key === 'isFeatured' ? (data.isFeatured ? 1 : 0) : data[key]);
      }
    });
    selectedFiles.forEach((file) => { formData.append('images', file); });

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Erreur lors de l'envoi");
      alert("Projet créé avec succès !");
      navigate('/dashboard-yonna-2026');
    } catch (err) {
      alert("Erreur: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-4xl font-bold uppercase text-(--primary-color) mb-8">Nouveau Projet</h1>

        <motion.form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <div className="bg-white p-8 border border-(--primary-color)/10 space-y-6">
              
              {/* [SECTION TITRE, CLIENT, ANNÉE, CATÉGORIE, DESCRIPTION INCHANGÉE] */}
              {/* (J'ai abrégé ici pour la lisibilité, garde ton code original pour ces champs) */}
              
              <div className="space-y-3 pt-2 border-t border-(--primary-color)/10">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Technologies Utilisées</label>
                
                {/* NOUVEAU : Champ d'ajout rapide intégré proprement */}
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={manualTech}
                    onChange={(e) => setManualTech(e.target.value)}
                    placeholder="Ajouter une techno..."
                    className="flex-1 p-2 bg-bg/50 border border-(--primary-color)/20 text-xs outline-none"
                  />
                  <button type="button" onClick={handleAddManualTech} className="px-3 bg-(--primary-color) text-white text-[10px] uppercase font-bold cursor-pointer">Ajouter</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-bg/30 border border-(--primary-color)/10">
                  {techList.map((tech) => (
                    <label key={tech.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" value={tech.id} {...register("technologies")} className="w-4 h-4 accent-(--accent-color)" />
                      <span className="font-mono text-xs uppercase">{tech.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* [RESTE DE TON CODE GALERIE INCHANGÉ] */}
          </div>
          {/* [COLONNE DROITE INCHANGÉE] */}
        </motion.form>
      </div>
    </div>
  );
};

export default CreateProject;