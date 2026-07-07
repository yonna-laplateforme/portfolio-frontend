import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../api/apiFetch';
import { getOptimizedUrl } from '../utils/imageUtils';

const AboutPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/about')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement :", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-text-main font-mono text-sm animate-pulse uppercase tracking-widest">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="bg-bg text-text-main min-h-screen overflow-hidden">

      {/* 1. SECTION HÉROS : Immersion totale */}
      <section className="relative h-screen w-full flex items-center justify-center p-8 md:p-20 overflow-hidden">
        {data.video_url && (
          <video
            autoPlay loop muted playsInline
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={data.video_url} type="video/mp4" />
          </video>
        )}

        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-7xl mx-auto"
        >
          {/* Titre centré et plus compact pour éviter qu'il ne soit trop bas */}
          <h1 className="text-5xl md:text-[6rem] lg:text-[8rem] font-black uppercase leading-[0.9] text-white">
            {data.header_line1} <br />
            <span className="text-(--accent-color)">{data.header_accent}</span> {data.header_line2}
          </h1>
        </motion.div>
      </section>
      {/* 2. SECTION BIO : Typographie "Brutaliste" */}
      <section className="max-w-6xl mx-auto py-32 px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase text-(--accent-color)">// {data.bio_title}</span>
          </div>
          <div className="md:col-span-8 space-y-12">
            {data.bio_text.split('|').map((part, i) => (
              <p key={i} className={`text-2xl md:text-3xl font-light leading-tight ${i === 0 ? "font-bold" : "opacity-70"}`}>
                {part.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION PHOTO & DUALITÉ */}
      <section className="py-20 px-6 bg-(--text-main) text-(--bg-color)">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full md:w-1/2"
          >
            <img
              src={getOptimizedUrl(data.photo_url)}
              alt="Yonna Merlini"
              width="600"
              height="800"
              className="w-full h-full object-cover ..."
            />
          </motion.div>
          <div className="w-full md:w-1/2 space-y-12">
            <h2 className="text-5xl font-black uppercase">Code & Objectif</h2>
            <p className="text-lg opacity-80 leading-relaxed">
              La rigueur du développement rencontre la sensibilité de la photographie.
              Chaque ligne de code est une structure, chaque clic est une émotion.
            </p>
            <div className="flex gap-4 font-mono text-xs uppercase border-t border-(--bg-color)/20 pt-8">
              <span>// Développement</span>
              <span>// Photographie</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPERTISE (Grille épurée) */}
      <section className="max-w-7xl mx-auto py-32 px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
        {[
          { t: "DÉVELOPPEMENT", i: ["REACT / NEXT.JS", "NEST.JS", "TAILWIND"] },
          { t: "PHOTOGRAPHIE", i: ["DIRECTION ARTISTIQUE", "PORTRAIT", "ARGENTIQUE"] },
          { t: "STRATÉGIE", i: ["ANALYSE BESOINS", "SEO", "IDENTITÉ"] }
        ].map((box, i) => (
          <div key={i} className="border-t border-(--text-main) pt-8">
            <h3 className="font-bold text-sm uppercase mb-8">{box.t}</h3>
            <ul className="font-mono text-xs space-y-3 opacity-60">
              {box.i.map(item => <li key={item}>— {item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* 5. PHILOSOPHIE : Le Grand Final */}
      <section className="py-32 px-6 text-center bg-(--accent-color) text-white w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-5xl mx-auto px-4"
        >
          {/* On supprime les contraintes de hauteur fixe et on laisse le texte s'exprimer */}
          <h4 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-8 break-words">
            "{data.philosophy_prefix} <span className="text-(--bg-color)">{data.philosophy_important}</span> {data.philosophy_suffix}"
          </h4>

          <div className="h-px w-20 bg-white/30 mx-auto my-8"></div>

          <p className="font-mono text-xs opacity-80 uppercase tracking-widest">
            {data.philosophy_author}
          </p>
        </motion.div>
      </section>

    </main>
  );
};

export default AboutPage;