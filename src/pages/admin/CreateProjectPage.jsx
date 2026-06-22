import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form'; 
import { apiFetch } from "../../api/apiFetch";

const CreateProject = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm(); 

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      formData.append(key, key === 'isFeatured' ? (data.isFeatured ? 1 : 0) : data[key]);
    });

    if (selectedFile) formData.append('image', selectedFile);

    try {
      await apiFetch(`/projects`, {
        method: 'POST',
        body: formData
      });
      alert("Nouveau projet créé avec succès !");
      navigate('/admin');
    } catch (err) {
      alert(err.message || "Erreur lors de la création");
    }
  };

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.form
          onSubmit={handleSubmit(onSubmit)} 
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1 space-y-8">
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">

              {/* Titre avec erreur */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre du projet *</label>
                <input
                  {...register("title", { required: "Le titre est obligatoire" })}
                  className={`w-full p-3.5 bg-bg/50 border ${errors.title ? 'border-red-500' : 'border-(--primary-color)/20'} focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main`}
                  placeholder="Nom du projet"
                />
                {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Client</label>
                  <input {...register("client")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main" placeholder="Nom du client" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Année</label>
                  <input {...register("date_realisation")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main" defaultValue="2026" />
                </div>
              </div>

              {/* Catégorie avec erreur */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Catégorie *</label>
                <select {...register("category", { required: "Veuillez choisir une catégorie" })} className={`w-full p-3.5 bg-bg/50 border ${errors.category ? 'border-red-500' : 'border-(--primary-color)/20'} focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main appearance-none cursor-pointer`}>
                  <option value="web">Web</option>
                  <option value="photo">Photo</option>
                </select>
                {errors.category && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.category.message}</p>}
              </div>

              {/* Description avec erreur */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Description *</label>
                <textarea {...register("description", { required: "La description est requise" })} className={`w-full p-4 bg-bg/50 border ${errors.description ? 'border-red-500' : 'border-(--primary-color)/20'} focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main h-32 resize-none`} placeholder="Description..." />
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Stack technique</label>
                <input {...register("tech_stack")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main" placeholder="React, Tailwind..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien GitHub</label>
                  <input {...register("github_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Lien Démo</label>
                  <input {...register("demo_url")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 focus:outline-none focus:border-(--accent-color) transition-colors text-sm text-text-main" placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Section Image */}
            <div className="bg-white p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-lg font-medium text-(--primary-color) mb-2">Image principale *</h3>
              <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 hover:bg-bg/60 transition-colors cursor-pointer group overflow-hidden">
                {preview ? (
                  <>
                    <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" alt="Aperçu" />
                    <p className="relative z-10 text-sm font-bold text-(--primary-color) bg-white/80 px-4 py-2">Changer l'image</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <span className="text-2xl mb-2 opacity-50">📁</span>
                    <p className="text-sm opacity-60">Glissez-déposez une image ici</p>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-2">ou cliquez pour parcourir</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-8">
            <div className="bg-white p-6 md:p-8 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
              <h3 className="text-lg font-medium text-(--primary-color) pb-4 border-b border-(--primary-color)/10">Statut & Options</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 border border-(--primary-color)/30" />
                <span className="text-sm opacity-80">Mettre en avant sur l'accueil</span>
              </label>
              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Votre rôle</label>
                <input {...register("role")} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20" placeholder="Ex: Développeur Fullstack" />
              </div>
              <button type="submit" className="w-full bg-(--accent-color) text-white py-4 text-xs font-bold uppercase">Enregistrer le projet</button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateProject;