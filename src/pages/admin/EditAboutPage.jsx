import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../api/apiFetch';

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
      await apiFetch('api/about', { method: 'PUT', body: JSON.stringify(formData) });
      if (selectedPhoto) {
        const pData = new FormData();
        pData.append('image', selectedPhoto);
        await apiFetch('api/about/photo', { method: 'POST', body: pData });
      }
      if (selectedVideo) {
        const vData = new FormData();
        vData.append('video', selectedVideo);
        await apiFetch('api/about/video', { method: 'POST', body: vData });
      }
      alert("Tout a été mis à jour !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="bg-bg text-text-main p-10 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
        
        {/* ZONE UPLOAD */}
        <div className="grid grid-cols-2 gap-8">
          <div onClick={() => photoInputRef.current.click()} className="cursor-pointer border-2 border-dashed p-4">
            {previewPhoto ? <img src={previewPhoto} className="h-40" /> : "Uploader Photo"}
            <input type="file" ref={photoInputRef} className="hidden" onChange={(e) => setSelectedPhoto(e.target.files[0])} accept="image/*" />
          </div>
          <div onClick={() => videoInputRef.current.click()} className="cursor-pointer border-2 border-dashed p-4">
            {selectedVideo ? selectedVideo.name : "Uploader Vidéo"}
            <input type="file" ref={videoInputRef} className="hidden" onChange={(e) => setSelectedVideo(e.target.files[0])} accept="video/*" />
          </div>
        </div>

        {/* CHAMPS TEXTES COMPLETS */}
        <input name="header_line1" value={formData.header_line1 || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Ligne 1" />
        <input name="header_accent" value={formData.header_accent || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Accent" />
        <input name="header_line2" value={formData.header_line2 || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Ligne 2" />
        <input name="bio_title" value={formData.bio_title || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Titre Bio" />
        <textarea name="bio_text" value={formData.bio_text || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Texte Bio" />
        <input name="philosophy_prefix" value={formData.philosophy_prefix || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Philo Prefix" />
        <input name="philosophy_important" value={formData.philosophy_important || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Philo Important" />
        <input name="philosophy_suffix" value={formData.philosophy_suffix || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Philo Suffix" />
        <textarea name="philosophy_text" value={formData.philosophy_text || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Philo Texte" />
        <input name="philosophy_author" value={formData.philosophy_author || ''} onChange={handleChange} className="w-full p-2 border" placeholder="Auteur" />

        <button type="submit" className="bg-black text-white p-4 w-full uppercase">Enregistrer tout</button>
      </form>
    </div>
  );
};

export default EditAboutPage;