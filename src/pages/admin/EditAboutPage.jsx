import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../../api/apiFetch';

const EditAboutPage = () => {
  const [formData, setFormData] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const [removeVideo, setRemoveVideo] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const loadAboutData = async () => {
    try {
      setError('');

      const data = await apiFetch('/api/about');

      setFormData(data || {});
      setPreviewPhoto(data?.photo_url || null);
      setPreviewVideo(null);
      setSelectedPhoto(null);
      setSelectedVideo(null);
      setRemoveVideo(false);
    } catch (err) {
      console.error('Erreur chargement About :', err);
      setError(err.message || 'Impossible de charger les informations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutData();
  }, []);

  /*
   * Libération des URL temporaires créées pour les aperçus.
   */
  useEffect(() => {
    return () => {
      if (previewPhoto?.startsWith('blob:')) {
        URL.revokeObjectURL(previewPhoto);
      }

      if (previewVideo?.startsWith('blob:')) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewPhoto, previewVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (previewPhoto?.startsWith('blob:')) {
      URL.revokeObjectURL(previewPhoto);
    }

    setSelectedPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (previewVideo?.startsWith('blob:')) {
      URL.revokeObjectURL(previewVideo);
    }

    setSelectedVideo(file);
    setPreviewVideo(URL.createObjectURL(file));
    setRemoveVideo(false);
  };

  const cancelNewVideo = () => {
    if (previewVideo?.startsWith('blob:')) {
      URL.revokeObjectURL(previewVideo);
    }

    setSelectedVideo(null);
    setPreviewVideo(null);

    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    cancelNewVideo();
    setRemoveVideo(true);
  };

  const cancelVideoRemoval = () => {
    setRemoveVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setError('');

    try {
      /*
       * 1. Mise à jour des champs texte.
       * removeVideo permet au backend de savoir si l’URL doit être supprimée.
       */
      await apiFetch('/api/about', {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          removeVideo,
        }),
      });

      /*
       * 2. Nouvelle photo, uniquement si un fichier a été choisi.
       */
      if (selectedPhoto) {
        const photoData = new FormData();
        photoData.append('image', selectedPhoto);

        await apiFetch('/api/about/photo', {
          method: 'POST',
          body: photoData,
        });
      }

      /*
       * 3. Nouvelle vidéo, uniquement si un fichier a été choisi.
       */
      if (selectedVideo) {
        const videoData = new FormData();
        videoData.append('video', selectedVideo);

        await apiFetch('/api/about/video', {
          method: 'POST',
          body: videoData,
        });
      }

      /*
       * On recharge les données réelles depuis la base,
       * pour récupérer les nouvelles URL Cloudinary.
       */
      await loadAboutData();

      alert('Mise à jour réussie !');
    } catch (err) {
      console.error('Erreur mise à jour About :', err);

      const message =
        err.message || 'Une erreur est survenue pendant la mise à jour.';

      setError(message);
      alert(`Erreur : ${message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <span className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />

        <p className="font-mono text-xs uppercase tracking-widest">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-bg text-text-main font-sans p-6 md:p-10 min-h-screen">
      {/* Overlay pendant la sauvegarde */}
      {saving && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white text-black px-8 py-7 shadow-2xl max-w-sm w-full flex items-center gap-5">
            <span className="shrink-0 w-7 h-7 border-2 border-black/20 border-t-black rounded-full animate-spin" />

            <div>
              <p className="font-bold uppercase text-sm">
                Enregistrement en cours
              </p>

              <p className="text-xs opacity-60 mt-1 leading-relaxed">
                L’upload d’une photo ou d’une vidéo peut prendre quelques
                instants. Ne fermez pas cette page.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 border border-(--primary-color)/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-12"
        >
          <div>
            <p className="font-mono text-xs uppercase text-(--accent-color) mb-3">
              // Administration
            </p>

            <h1 className="text-3xl md:text-4xl font-black uppercase">
              Modifier la page À propos
            </h1>

            <p className="text-sm opacity-60 mt-3">
              La photo et la vidéo sont facultatives. Sans nouveau fichier,
              les médias actuels sont conservés.
            </p>
          </div>

          {error && (
            <div className="border border-red-500/30 bg-red-50 text-red-700 p-4 text-sm">
              {error}
            </div>
          )}

          {/* Médias */}
          <section className="space-y-6">
            <h2 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">
              Médias
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo */}
              <div className="space-y-3">
                <p className="text-xs uppercase font-mono opacity-60">
                  Photo
                </p>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full cursor-pointer border-2 border-dashed border-(--primary-color)/30 h-64 flex items-center justify-center bg-bg/30 overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {previewPhoto ? (
                    <img
                      src={previewPhoto}
                      alt="Aperçu du portrait"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs uppercase font-mono opacity-60">
                      Ajouter une photo
                    </span>
                  )}
                </button>

                <input
                  type="file"
                  ref={photoInputRef}
                  className="hidden"
                  onChange={handlePhotoChange}
                  accept="image/*"
                />

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => photoInputRef.current?.click()}
                  className="text-xs uppercase underline disabled:opacity-50"
                >
                  {formData.photo_url || selectedPhoto
                    ? 'Remplacer la photo'
                    : 'Ajouter une photo'}
                </button>

                {selectedPhoto && (
                  <p className="text-xs opacity-60 break-all">
                    Nouveau fichier : {selectedPhoto.name}
                  </p>
                )}
              </div>

              {/* Vidéo */}
              <div className="space-y-3">
                <p className="text-xs uppercase font-mono opacity-60">
                  Vidéo facultative
                </p>

                <div className="border-2 border-dashed border-(--primary-color)/30 h-64 flex flex-col items-center justify-center bg-bg/30 p-4 overflow-hidden">
                  {/* Nouvelle vidéo sélectionnée */}
                  {selectedVideo && previewVideo ? (
                    <div className="w-full h-full flex flex-col gap-3">
                      <video
                        src={previewVideo}
                        controls
                        muted
                        playsInline
                        className="w-full flex-1 min-h-0 object-cover bg-black"
                      />

                      <p className="text-xs text-center break-all">
                        {selectedVideo.name}
                      </p>
                    </div>
                  ) : formData.video_url && !removeVideo ? (
                    /*
                     * Vidéo actuellement enregistrée
                     */
                    <video
                      src={formData.video_url}
                      controls
                      muted
                      playsInline
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    /*
                     * Aucune vidéo ou suppression demandée
                     */
                    <div className="text-center space-y-3">
                      <p className="text-xs uppercase font-mono opacity-60">
                        {removeVideo
                          ? 'La vidéo sera supprimée'
                          : 'Aucune vidéo'}
                      </p>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => videoInputRef.current?.click()}
                        className="text-xs uppercase underline disabled:opacity-50"
                      >
                        Ajouter une vidéo
                      </button>

                      {removeVideo && formData.video_url && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={cancelVideoRemoval}
                          className="block mx-auto text-xs uppercase opacity-60 underline disabled:opacity-50"
                        >
                          Annuler la suppression
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  onChange={handleVideoChange}
                  accept="video/*"
                />

                <div className="flex flex-wrap gap-4">
                  {!selectedVideo && !removeVideo && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => videoInputRef.current?.click()}
                      className="text-xs uppercase underline disabled:opacity-50"
                    >
                      {formData.video_url
                        ? 'Remplacer la vidéo'
                        : 'Ajouter une vidéo'}
                    </button>
                  )}

                  {selectedVideo && (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => videoInputRef.current?.click()}
                        className="text-xs uppercase underline disabled:opacity-50"
                      >
                        Choisir un autre fichier
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={cancelNewVideo}
                        className="text-xs uppercase text-red-600 underline disabled:opacity-50"
                      >
                        Annuler la nouvelle vidéo
                      </button>
                    </>
                  )}

                  {formData.video_url &&
                    !removeVideo &&
                    !selectedVideo && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleRemoveVideo}
                        className="text-xs uppercase text-red-600 underline disabled:opacity-50"
                      >
                        Supprimer la vidéo
                      </button>
                    )}
                </div>
              </div>
            </div>
          </section>

          {/* En-tête */}
          <section className="space-y-6">
            <h2 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">
              En-tête
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="header_line1"
                value={formData.header_line1 || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                placeholder="Début du titre"
              />

              <input
                name="header_accent"
                value={formData.header_accent || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--accent-color)/50 text-sm disabled:opacity-60"
                placeholder="Mot en couleur"
              />

              <input
                name="header_line2"
                value={formData.header_line2 || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                placeholder="Fin du titre"
              />
            </div>

            <input
              name="header_subtitle"
              value={formData.header_subtitle || ''}
              onChange={handleChange}
              disabled={saving}
              className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
              placeholder="Sous-titre"
            />
          </section>

          {/* Biographie */}
          <section className="space-y-6">
            <h2 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">
              Biographie
            </h2>

            <input
              name="bio_title"
              value={formData.bio_title || ''}
              onChange={handleChange}
              disabled={saving}
              className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
              placeholder="Titre de la biographie"
            />

            <textarea
              name="bio_text"
              value={formData.bio_text || ''}
              onChange={handleChange}
              disabled={saving}
              className="w-full p-4 border border-(--primary-color)/20 text-sm h-48 resize-y disabled:opacity-60"
              placeholder="Utilise | pour séparer les paragraphes"
            />

            <p className="text-xs opacity-50">
              Utilise le caractère <strong>|</strong> pour créer plusieurs
              paragraphes.
            </p>
          </section>

          {/* Dualité et expertise */}
          <section className="space-y-6">
            <h2 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">
              Section Dualité & Expertise
            </h2>

            <div className="space-y-4">
              <input
                name="dualite_title"
                value={formData.dualite_title || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                placeholder="Exemple : Code |& Vision"
              />

              <textarea
                name="dualite_text"
                value={formData.dualite_text || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-4 border border-(--primary-color)/20 text-sm h-32 resize-y disabled:opacity-60"
                placeholder="Utilise | pour séparer les paragraphes"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="tech_dev"
                  className="text-xs uppercase opacity-50"
                >
                  Développement — utiliser | pour séparer
                </label>

                <input
                  id="tech_dev"
                  name="tech_dev"
                  value={formData.tech_dev || ''}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                  placeholder="React|Node.js|Express"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tech_photo"
                  className="text-xs uppercase opacity-50"
                >
                  Photographie — utiliser | pour séparer
                </label>

                <input
                  id="tech_photo"
                  name="tech_photo"
                  value={formData.tech_photo || ''}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                  placeholder="Portrait|Drone|Lifestyle"
                />
              </div>
            </div>
          </section>

          {/* Philosophie */}
          <section className="space-y-6">
            <h2 className="font-heading text-lg uppercase text-(--primary-color) border-b border-(--primary-color)/10 pb-2">
              Philosophie
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="philosophy_prefix"
                value={formData.philosophy_prefix || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                placeholder="Début de la phrase"
              />

              <input
                name="philosophy_important"
                value={formData.philosophy_important || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--accent-color)/50 text-sm disabled:opacity-60"
                placeholder="Partie importante"
              />

              <input
                name="philosophy_suffix"
                value={formData.philosophy_suffix || ''}
                onChange={handleChange}
                disabled={saving}
                className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
                placeholder="Fin de la phrase"
              />
            </div>

            <textarea
              name="philosophy_text"
              value={formData.philosophy_text || ''}
              onChange={handleChange}
              disabled={saving}
              className="w-full p-4 border border-(--primary-color)/20 text-sm h-32 resize-y disabled:opacity-60"
              placeholder="Texte complémentaire"
            />

            <input
              name="philosophy_author"
              value={formData.philosophy_author || ''}
              onChange={handleChange}
              disabled={saving}
              className="w-full p-3.5 border border-(--primary-color)/20 text-sm disabled:opacity-60"
              placeholder="Auteur"
            />
          </section>

          {/* Bouton de sauvegarde */}
          <button
            type="submit"
            disabled={saving}
            className={`
              w-full py-4 text-white uppercase font-bold tracking-widest text-xs
              flex items-center justify-center gap-3 transition
              ${
                saving
                  ? 'bg-(--primary-color)/60 cursor-not-allowed'
                  : 'bg-(--primary-color) hover:opacity-90'
              }
            `}
          >
            {saving && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}

            {saving
              ? 'Enregistrement en cours...'
              : 'Enregistrer toutes les modifications'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default EditAboutPage;