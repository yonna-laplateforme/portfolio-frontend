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

  const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend-7xj4.onrender.com";

  // 1. Récupération des technologies depuis le back-end au chargement de la page
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // 2. Traitement dynamique des données pour FormData
    Object.keys(data).forEach(key => {
      if (key === 'technologies') {
        // React Hook Form renvoie un tableau si plusieurs cases sont cochées, ou une string si une seule.
        // On s'assure d'ajouter chaque ID sélectionné proprement au FormData.
        const techs = Array.isArray(data[key]) ? data[key] : [data[key]];
        techs.forEach(techId => {
          if (techId) formData.append('technologies[]', techId); // Le [] indique au backend que c'est un tableau
        });
      } else {
        formData.append(key, key === 'isFeatured' ? (data.isFeatured ? 1 : 0) : data[key]);
      }
    });

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        body: formData,
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erreur serveur" }));
        throw new Error(errorData.message || "Erreur lors de l'envoi");
      }
      
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
        
        {/* Ajout de la typographie brutaliste pour le titre de la page */}
        <h1 className="font-heading text-4xl font-bold uppercase text-(--primary-color) mb-8">Nouveau Projet</h1>

        <motion.form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8">
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">

              {/* Titre */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre du projet *</label>
                <input {...register("title", { required: "Obligatoire" })} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="Nom du projet" />
              </div>

              {/* Client & Année */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                  <input {...register("client")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="Nom du client" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Année</label>
                  <input {...register("date_realisation")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" defaultValue="2026" />
                </div>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Catégorie *</label>
                <select {...register("category_id", { required: "Veuillez choisir" })} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm appearance-none cursor-pointer focus:border-(--accent-color) outline-none transition-colors">
                  <option value="">-- Choisir --</option>
                  <option value="1">Web</option>
                  <option value="2">Photo</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Description *</label>
                <textarea {...register("description", { required: "Requis" })} className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-32 resize-none focus:border-(--accent-color) outline-none transition-colors" />
              </div>

              {/* 3. NOUVEAU : Sélection multiple des Technologies (Checkboxes dynamiques) */}
              <div className="space-y-3 pt-2 border-t border-(--primary-color)/10">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Technologies Utilisées</label>
                {techList.length === 0 ? (
                  <p className="text-sm opacity-50 italic">Chargement des technologies...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-bg/30 border border-(--primary-color)/10">
                    {techList.map((tech) => (
                      <label key={tech.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          value={tech.id} 
                          {...register("technologies")} 
                          className="w-4 h-4 cursor-pointer accent-(--accent-color)" 
                        />
                        <span className="font-mono text-xs uppercase group-hover:text-(--accent-color) transition-colors">{tech.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Liens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-(--primary-color)/10">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien GitHub</label>
                  <input {...register("github_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien Démo</label>
                  <input {...register("demo_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Zone Galerie Multi-images */}
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <h3 className="font-heading text-lg uppercase text-(--primary-color) mb-4">Images du projet</h3>
              <label className="relative flex flex-col items-center justify-center w-full min-h-50 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 cursor-pointer hover:border-(--accent-color) transition-colors">
                <div className="flex flex-wrap gap-4 p-4 justify-center">
                  {previews.map((src, index) => (
                    <img key={index} src={src} className="w-20 h-20 object-cover border border-(--primary-color)/20 shadow-sm" alt="Aperçu" />
                  ))}
                  {previews.length === 0 && <p className="font-mono text-xs opacity-60 uppercase tracking-widest">Glissez-déposez vos images ici</p>}
                </div>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* Colonne Droite */}
          <div className="w-full lg:w-80">
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6 sticky top-8">
              <h3 className="font-heading text-lg uppercase text-(--primary-color) pb-4 border-b border-(--primary-color)/10">Statut & Options</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 cursor-pointer accent-(--accent-color)" />
                <span className="font-mono text-xs uppercase opacity-80 group-hover:text-(--accent-color) transition-colors">Mettre à la une</span>
              </label>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Votre rôle</label>
                <input {...register("role")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="Ex: Développeuse Front-end" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-(--primary-color) text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-(--accent-color) transition-colors cursor-pointer disabled:opacity-50 mt-4">
                {isSubmitting ? "Enregistrement..." : "Créer le projet"}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateProject;