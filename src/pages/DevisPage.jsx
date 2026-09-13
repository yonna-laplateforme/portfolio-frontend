import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '../api/apiFetch';
import { Reveal, RevealLine } from '../components/Reveal';

const DevisPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (data) => {
    setIsSending(true);
    setStatus({ type: '', message: '' });

    // Compilation devis → message (compatible avec /api/contact existant)
    const message = [
      `TYPE DE PRESTATION : ${data.prestation}`,
      `BUDGET ESTIMÉ : ${data.budget}`,
      `DÉLAI SOUHAITÉ : ${data.delai}`,
      `TÉLÉPHONE : ${data.telephone || 'non renseigné'}`,
      '',
      'DESCRIPTION DU PROJET :',
      data.description,
    ].join('\n');

    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: data.name, email: data.email, message }),
      });
      setStatus({ type: 'success', message: 'Votre demande est bien envoyée. Réponse sous 48 h ouvrées ! 🎉' });
      reset();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Une erreur est survenue, réessayez.' });
    } finally {
      setIsSending(false);
    }
  };

  const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ink-soft';
  const inputClass = 'w-full p-4 bg-transparent border border-ink/20 text-ink text-sm focus:border-brick outline-none transition-colors';

  return (
    <div className="bg-paper text-ink min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] uppercase text-brick mb-8">// Devis</p>
        </Reveal>
        <h1 className="font-display font-light text-5xl md:text-7xl leading-tight">
          <RevealLine delay={0.1}>Parlons</RevealLine>
          <RevealLine delay={0.2}><em className="italic text-brick">chiffres</em>.</RevealLine>
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-8 text-ink-soft text-lg leading-relaxed max-w-xl">
            Décrivez votre projet en quelques lignes — je vous réponds avec un devis
            détaillé sous 48 h ouvrées. Devis gratuit et sans engagement.
          </p>
        </Reveal>

        {status.message && (
          <div className={`mt-10 p-4 border text-sm ${
            status.type === 'success'
              ? 'border-green-600 text-green-700 bg-green-600/5'
              : 'border-brick text-brick bg-brick/5'
          }`}>
            {status.message}
          </div>
        )}

        <Reveal delay={0.3}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-14 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Type de prestation *</label>
                <select {...register('prestation', { required: true })} className={inputClass}>
                  <option value="">— Choisir —</option>
                  <option>Site web</option>
                  <option>Photographie</option>
                  <option>Vidéo</option>
                  <option>Drone</option>
                  <option>Projet mixte</option>
                </select>
                {errors.prestation && <p className="text-xs text-brick">Requis</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Budget estimé</label>
                <select {...register('budget')} className={inputClass}>
                  <option value="">— Je ne sais pas encore —</option>
                  <option>Moins de 500 €</option>
                  <option>500 – 1 500 €</option>
                  <option>1 500 – 3 000 €</option>
                  <option>Plus de 3 000 €</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Description du projet *</label>
              <textarea
                {...register('description', { required: 'Décrivez votre projet' })}
                rows={5}
                placeholder="Contexte, objectifs, exemples de sites ou d'images que vous aimez…"
                className={inputClass}
              />
              {errors.description && <p className="text-xs text-brick">{errors.description.message}</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Délai souhaité</label>
                <select {...register('delai')} className={inputClass}>
                  <option>Dès que possible</option>
                  <option>Sous 1 mois</option>
                  <option>1 à 3 mois</option>
                  <option>Flexible</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Nom *</label>
                <input {...register('name', { required: true })} className={inputClass} />
                {errors.name && <p className="text-xs text-brick">Requis</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Email *</label>
                <input type="email" {...register('email', { required: true })} className={inputClass} />
                {errors.email && <p className="text-xs text-brick">Requis</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Téléphone (optionnel)</label>
              <input type="tel" {...register('telephone')} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full md:w-auto inline-flex justify-center items-center gap-3 rounded-full bg-brick px-10 py-4 text-sm font-medium text-paper transition-colors hover:bg-ink disabled:opacity-50"
            >
              {isSending ? 'Envoi…' : 'Envoyer ma demande →'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
};

export default DevisPage;