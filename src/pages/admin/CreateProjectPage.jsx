import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form'; 
import { apiFetch } from '../../api/apiFetch';

const CreateProject = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm(); 

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Ajout de tous les champs du formulaire
    Object.keys(data).forEach(key => {
      formData.append(key, key === 'isFeatured' ? (data.isFeatured ? 1 : 0) : data[key]);
    });

    // Ajout des images
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await apiFetch(`/projects`, { method: 'POST', body: formData });
      alert("Projet créé avec succès !");
      navigate('/dashboard-yonna-2026');
    } catch (err) {
      alert(err.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8">
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">

              {/* Titre */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre du projet *</label>
                <input {...register("title", { required: "Obligatoire" })} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" placeholder="Nom du projet" />
              </div>

              {/* Client & Année */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                  <input {...register("client")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" placeholder="Nom du client" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Année</label>
                  <input {...register("date_realisation")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" defaultValue="2026" />
                </div>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Catégorie *</label>
                <select {...register("category_id", { required: "Veuillez choisir" })} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm appearance-none cursor-pointer">
                  <option value="">-- Choisir --</option>
                  <option value="1">Web</option>
                  <option value="2">Photo</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Description *</label>
                <textarea {...register("description", { required: "Requis" })} className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-32 resize-none" />
              </div>

              {/* Stack */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Stack technique</label>
                <input {...register("tech_stack")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" placeholder="React, Tailwind..." />
              </div>

              {/* Liens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien GitHub</label>
                  <input {...register("github_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien Démo</label>
                  <input {...register("demo_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" />
                </div>
              </div>
            </div>

            {/* Zone Galerie Multi-images */}
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <h3 className="text-lg font-medium text-(--primary-color) mb-4">Images du projet</h3>
              <label className="relative flex flex-col items-center justify-center w-full min-h-50 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 cursor-pointer">
                <div className="flex flex-wrap gap-4 p-4 justify-center">
                  {previews.map((src, index) => (
                    <img key={index} src={src} className="w-20 h-20 object-cover border border-(--primary-color)/20" alt="Aperçu" />
                  ))}
                  {previews.length === 0 && <p className="text-sm opacity-60">Glissez-déposez vos images ici (multiple)</p>}
                </div>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* Colonne Droite */}
          <div className="w-full lg:w-80">
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-lg font-medium text-(--primary-color) pb-4 border-b">Statut & Options</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 border border-(--primary-color)/30" />
                <span className="text-sm opacity-80">Mettre en avant</span>
              </label>
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Votre rôle</label>
                <input {...register("role")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-(--accent-color) text-white text-xs font-bold uppercase transition-all">
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