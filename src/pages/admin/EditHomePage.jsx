import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { homeApi } from '../../api/homeApi';

const EditHomePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [content, setContent] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    homeApi.get().then((data) => {
      setContent(data);
      reset(data); // pré-remplit le formulaire
    });
  }, [reset]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Sauvegarde des textes
  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await homeApi.update(data);
      showFeedback('success', 'Textes mis à jour ✅');
    } catch (err) {
      showFeedback('error', err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload vidéo hero
  const handleVideoUpload = async () => {
    if (!videoFile) return;
    setIsUploading(true);
    try {
      const { videoUrl } = await homeApi.uploadVideo(videoFile);
      setContent((c) => ({ ...c, video_url: videoUrl }));
      setVideoFile(null);
      showFeedback('success', 'Vidéo hero remplacée 🎬');
    } catch (err) {
      showFeedback('error', err.message || 'Erreur upload vidéo');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload poster (image de fallback)
  const handlePosterUpload = async () => {
    if (!posterFile) return;
    setIsUploading(true);
    try {
      const { posterUrl } = await homeApi.uploadPoster(posterFile);
      setContent((c) => ({ ...c, poster_url: posterUrl }));
      setPosterFile(null);
      showFeedback('success', 'Poster mis à jour 🖼️');
    } catch (err) {
      showFeedback('error', err.message || 'Erreur upload poster');
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    'w-full p-3.5 bg-bg/50 border border-(--primary-color)/20 text-sm focus:border-(--accent-color) outline-none transition-colors';
  const labelClass =
    'font-mono text-[10px] font-bold opacity-60 uppercase tracking-widest';

  if (!content) return <p className="p-10 font-mono text-sm">Chargement…</p>;

  return (
    <div className="bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl font-bold uppercase text-(--primary-color) mb-2">
          Modifier la Home
        </h1>
        <p className="font-mono text-xs opacity-60 mb-8 uppercase tracking-widest">
          Hero — titres, textes, vidéo et poster
        </p>

        {feedback.message && (
          <div className={`mb-6 p-4 border text-sm ${
            feedback.type === 'success'
              ? 'border-green-500 text-green-600 bg-green-500/5'
              : 'border-(--accent-color) text-(--accent-color) bg-(--accent-color)/5'
          }`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* TEXTE DU HERO */}
          <div className="bg-white p-8 border border-(--primary-color)/10 space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color)">Textes du hero</h3>

            <div className="space-y-2">
              <label className={labelClass}>Label (petite ligne au-dessus)</label>
              <input {...register('label')} className={inputClass} placeholder="Studio — Lyon, France" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Titre ligne 1 *</label>
                <input {...register('title_line1', { required: true })} className={inputClass} />
                {errors.title_line1 && <p className="text-xs text-(--accent-color)">Requis</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Titre ligne 2 (accent italique) *</label>
                <input {...register('title_line2', { required: true })} className={inputClass} />
                {errors.title_line2 && <p className="text-xs text-(--accent-color)">Requis</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Paragraphe de présentation *</label>
              <textarea {...register('paragraph', { required: true })} rows={3} className={inputClass} />
              {errors.paragraph && <p className="text-xs text-(--accent-color)">Requis</p>}
            </div>
          </div>

          {/* BOUTONS */}
          <div className="bg-white p-8 border border-(--primary-color)/10 space-y-6">
            <h3 className="font-heading text-lg uppercase text-(--primary-color)">Boutons (CTA)</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Bouton 1 — texte</label>
                <input {...register('cta1_label')} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Bouton 1 — lien</label>
                <input {...register('cta1_url')} className={inputClass} placeholder="/projects" />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Bouton 2 — texte</label>
                <input {...register('cta2_label')} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Bouton 2 — lien</label>
                <input {...register('cta2_url')} className={inputClass} placeholder="/devis" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-(--primary-color) text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-(--accent-color) transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde…' : 'Sauvegarder les textes'}
          </button>
        </form>

        {/* VIDÉO */}
        <div className="bg-white p-8 border border-(--primary-color)/10 space-y-6 mt-8">
          <h3 className="font-heading text-lg uppercase text-(--primary-color)">Vidéo du hero</h3>

          {content.video_url && (
            <video src={content.video_url} muted loop autoPlay playsInline className="w-full max-w-md rounded" />
          )}

          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="font-mono text-xs"
            />
            <button
              type="button"
              onClick={handleVideoUpload}
              disabled={!videoFile || isUploading}
              className="px-6 py-3 bg-(--primary-color) text-white text-xs font-mono uppercase tracking-widest hover:bg-(--accent-color) disabled:opacity-40"
            >
              {isUploading ? 'Upload…' : 'Remplacer la vidéo'}
            </button>
          </div>
          <p className="font-mono text-[10px] opacity-50">Max 200 Mo (limite serveur). Pense à HandBrake avant !</p>
        </div>

        {/* POSTER */}
        <div className="bg-white p-8 border border-(--primary-color)/10 space-y-6 mt-8">
          <h3 className="font-heading text-lg uppercase text-(--primary-color)">Poster (image de fallback)</h3>

          {content.poster_url && (
            <img src={content.poster_url} alt="Poster actuel" className="w-full max-w-md object-cover" />
          )}

          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files[0])}
              className="font-mono text-xs"
            />
            <button
              type="button"
              onClick={handlePosterUpload}
              disabled={!posterFile || isUploading}
              className="px-6 py-3 bg-(--primary-color) text-white text-xs font-mono uppercase tracking-widest hover:bg-(--accent-color) disabled:opacity-40"
            >
              {isUploading ? 'Upload…' : 'Remplacer le poster'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHomePage;