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

  return (
    <motion.form 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onSubmit={handleSubmit} 
      className="max-w-4xl mx-auto p-8 space-y-6 bg-white"
    >
      <h2 className="text-2xl font-black uppercase">Éditer le À Propos</h2>

      {/* --- ZONE PHOTO --- */}
      <div 
        onClick={() => fileInputRef.current.click()}
        className="w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {preview ? <img src={preview} className="max-h-full" alt="Portrait" /> : <p>Cliquer pour changer la photo</p>}
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      </div>

      {/* --- CHAMPS TEXTES ORIGINAUX --- */}
      <div className="grid grid-cols-3 gap-4">
        <input name="header_line1" value={formData.header_line1 || ''} onChange={handleChange} className="border p-2" placeholder="Ligne 1" />
        <input name="header_accent" value={formData.header_accent || ''} onChange={handleChange} className="border p-2" placeholder="Accent" />
        <input name="header_line2" value={formData.header_line2 || ''} onChange={handleChange} className="border p-2" placeholder="Ligne 2" />
      </div>

      <input name="bio_title" value={formData.bio_title || ''} onChange={handleChange} className="w-full border p-2" placeholder="Sous-titre" />
      <textarea name="bio_text" value={formData.bio_text || ''} onChange={handleChange} className="w-full border p-2 h-32" placeholder="Texte Bio" />

      {/* --- NOUVEAUX CHAMPS PHILOSOPHIE --- */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <textarea name="philosophy_quote" value={formData.philosophy_quote || ''} onChange={handleChange} className="w-full border p-2" placeholder="Citation complète" />
        <input name="philosophy_author" value={formData.philosophy_author || ''} onChange={handleChange} className="w-full border p-2" placeholder="Auteur" />
        
        <div className="grid grid-cols-3 gap-4">
          <input name="philosophy_prefix" value={formData.philosophy_prefix || ''} onChange={handleChange} className="border p-2" placeholder="Préfixe citation" />
          <input name="philosophy_important" value={formData.philosophy_important || ''} onChange={handleChange} className="border p-2" placeholder="Mot important" />
          <input name="philosophy_suffix" value={formData.philosophy_suffix || ''} onChange={handleChange} className="border p-2" placeholder="Suffixe citation" />
        </div>
        
        <textarea name="philosophy_text" value={formData.philosophy_text || ''} onChange={handleChange} className="w-full border p-2" placeholder="Texte de philosophie" />
      </div>

      <button type="submit" className="w-full bg-black text-white p-4 uppercase font-bold">Enregistrer tout</button>
    </motion.form>
  );
};

export default EditAboutPage;