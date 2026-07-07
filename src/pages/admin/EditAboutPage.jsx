import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api/apiFetch';
import { motion } from 'framer-motion';

const EditAboutPage = () => {
  const [formData, setFormData] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    apiFetch('api/about').then(data => {
      setFormData(data || {});
      if (data?.photo_url) setPreviewPhoto(data.photo_url);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Mise à jour texte
      await apiFetch('api/about', { method: 'PUT', body: JSON.stringify(formData) });
      // 2. Upload Photo
      if (selectedPhoto) {
        const pData = new FormData();
        pData.append('image', selectedPhoto);
        await apiFetch('api/about/photo', { method: 'POST', body: pData });
      }
      // 3. Upload Vidéo
      if (selectedVideo) {
        const vData = new FormData();
        vData.append('video', selectedVideo);
        await apiFetch('api/about/video', { method: 'POST', body: vData });
      }
      alert("Mise à jour réussie !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center">Chargement...</div>;

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.form 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white p-8 md:p-12 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-12"
        >
          {/* ZONE UPLOAD DÉDIÉE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div onClick={() => photoInputRef.current.click()} className="cursor-pointer border-2 border-dashed border-(--primary-color)/30 h-64 flex items-center justify-center bg-bg/30">
              {previewPhoto ? <img src={previewPhoto} className="h-full object-cover" /> : <p className="text-xs uppercase font-mono opacity-60">Uploader Photo</p>}
              <input type="file" ref={photoInputRef} className="hidden" onChange={(e) => setSelectedPhoto(e.target.files[0])} accept="image/*" />
            </div>
            <div onClick={() => videoInputRef.current.click()} className="cursor-pointer border-2 border-dashed border-(--primary-color)/30 h-64 flex items-center justify-center bg-bg/30">
              {selectedVideo ? <p className="text-xs">{selectedVideo.name}</p> : <p className="text-xs uppercase font-mono opacity-60">Uploader Vidéo</p>}
              <input type="file" ref={videoInputRef} className="hidden" onChange={(e) => setSelectedVideo(e.target.files[0])} accept="video/*" />
            </div>
          </div>

          {/* CHAMPS TEXTES ORIGINAUX */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">En-tête</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="header_line1" value={formData.header_line1 || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" placeholder="Début titre" />
              <input name="header_accent" value={formData.header_accent || ''} onChange={handleChange} className="w-full p-3.5 border border-(--accent-color)/50 text-sm" placeholder="Mot rouge" />
              <input name="header_line2" value={formData.header_line2 || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" placeholder="Fin titre" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">Biographie</h3>
            <input name="bio_title" value={formData.bio_title || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" placeholder="Titre" />
            <textarea name="bio_text" value={formData.bio_text || ''} onChange={handleChange} className="w-full p-4 border border-(--primary-color)/20 text-sm h-48" placeholder="Texte bio" />
          </div>

          {/* PHILOSOPHIE */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">Philosophie</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="philosophy_prefix" value={formData.philosophy_prefix || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" />
              <input name="philosophy_important" value={formData.philosophy_important || ''} onChange={handleChange} className="w-full p-3.5 border border-(--accent-color)/50 text-sm" />
              <input name="philosophy_suffix" value={formData.philosophy_suffix || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" />
            </div>
            <textarea name="philosophy_text" value={formData.philosophy_text || ''} onChange={handleChange} className="w-full p-4 border border-(--primary-color)/20 text-sm h-32" />
            <input name="philosophy_author" value={formData.philosophy_author || ''} onChange={handleChange} className="w-full p-3.5 border border-(--primary-color)/20 text-sm" />
          </div>

          <button type="submit" className="w-full py-4 bg-(--primary-color) text-white uppercase font-bold tracking-widest text-xs">Enregistrer tout</button>
        </motion.form>
      </div>
    </div>
  );
};

export default EditAboutPage;