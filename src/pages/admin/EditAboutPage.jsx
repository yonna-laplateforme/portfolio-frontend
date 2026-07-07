import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api/apiFetch';
import { motion } from 'framer-motion';

const EditAboutPage = () => {
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    apiFetch('api/about').then(data => {
      setFormData(data || {});
      if (data && data.photo_url) setPreview(data.photo_url);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { image, ...textData } = formData; 
      
      await apiFetch('api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textData)
      });

      if (selectedFile) {
        const imageData = new FormData();
        imageData.append('image', selectedFile);
        
        await apiFetch('api/about/photo', {
          method: 'POST',
          body: imageData
        });
      }

      alert("Mise à jour réussie !");
    } catch (err) {
      console.error("Erreur détaillée :", err);
      alert("Une erreur est survenue, vérifie la console (F12).");
    }
  };

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-sm uppercase">Chargement...</div>;

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.form 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white p-8 md:p-12 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-12"
        >
          <div className="border-b border-(--primary-color)/10 pb-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase text-(--primary-color)">Éditer "À Propos"</h1>
            <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest mt-2">Gérez le contenu de votre page de présentation</p>
          </div>

          {/* --- ZONE PHOTO --- */}
          <div className="space-y-3">
            <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Portrait de profil</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full h-80 border-2 border-dashed border-(--primary-color)/30 bg-bg/30 flex items-center justify-center cursor-pointer overflow-hidden hover:border-(--accent-color) transition-colors group"
            >
              {preview ? (
                <img src={preview} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" alt="Portrait" />
              ) : (
                <p className="font-mono text-xs opacity-60 uppercase tracking-widest group-hover:text-(--accent-color)">Cliquez pour uploader une photo</p>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
          </div>

          {/* --- EN-TÊTE PRINCIPAL --- */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">Titre d'accroche (Header)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Début du titre</label>
                <input name="header_line1" value={formData.header_line1 || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="DÉVELOPPEUSE &" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold text-(--accent-color) uppercase tracking-widest">Mot accentué (Rouge)</label>
                <input name="header_accent" value={formData.header_accent || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--accent-color)/50 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="PHOTOGRAPHE" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Fin du titre</label>
                <input name="header_line2" value={formData.header_line2 || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="(Optionnel)" />
              </div>
            </div>
          </div>

          {/* --- TEXTE BIO --- */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">Biographie</h3>
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Titre de la bio</label>
              <input name="bio_title" value={formData.bio_title || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="MON APPROCHE" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Contenu</label>
              <textarea name="bio_text" value={formData.bio_text || ''} onChange={handleChange} className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-48 resize-none focus:border-(--accent-color) outline-none transition-colors" placeholder="Écrivez votre parcours ici..." />
            </div>
          </div>

          {/* --- NOUVEAUX CHAMPS PHILOSOPHIE --- */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">Cadre Noir (Citation / Philosophie)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Début de la citation</label>
                <input name="philosophy_prefix" value={formData.philosophy_prefix || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="LA TECHNIQUE" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold text-(--accent-color) uppercase tracking-widest">Mot accentué</label>
                <input name="philosophy_important" value={formData.philosophy_important || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--accent-color)/50 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="SANS VISION" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Fin de la citation</label>
                <input name="philosophy_suffix" value={formData.philosophy_suffix || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="N'EST QUE DU BRUIT." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Sous-texte explicatif</label>
              <textarea name="philosophy_text" value={formData.philosophy_text || ''} onChange={handleChange} className="w-full p-4 bg-bg/50 border border-(--primary-color)/20 text-sm h-32 resize-none focus:border-(--accent-color) outline-none transition-colors" placeholder="Explication de votre philosophie..." />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest">Auteur de la citation</label>
              <input name="philosophy_author" value={formData.philosophy_author || ''} onChange={handleChange} className="w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors" placeholder="YONNA MERLINI" />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-(--primary-color) text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-(--accent-color) transition-colors cursor-pointer mt-8">
            Enregistrer les modifications
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default EditAboutPage;