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

  if (loading || !data) return <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-xs">CHARGEMENT...</div>;

  return (
    <main className="bg-bg text-text-main min-h-screen selection:bg-(--accent-color) selection:text-white">
      
      {/* 1. HERO SOBRE : Plus d'immersion forcée, juste une introduction */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <span className="font-mono text-xs uppercase text-(--accent-color) mb-6 block">// Introduction</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-[0.9] max-w-4xl">
            {data.header_line1} <span className="text-(--accent-color)">{data.header_accent}</span> {data.header_line2}
          </h1>
        </motion.div>
      </section>

      {/* 2. BIO NARRATIVE : Format "Magazine" pour favoriser la lecture */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {data.bio_text.split('|').map((part, i) => (
              <p key={i} className={`text-xl md:text-2xl font-light leading-relaxed ${i === 0 ? "font-bold text-3xl md:text-4xl" : "opacity-80"}`}>
                {part.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PORTRAIT & DUALITÉ : Intégré plus naturellement */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            src={getOptimizedUrl(data.photo_url)}
            alt="Portrait"
            className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover"
          />
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase">Entre Code & Image</h2>
            <p className="opacity-70 leading-relaxed">
              La rigueur du développement rencontre la sensibilité de la photographie. C'est dans cet équilibre que je construis mes projets : une structure solide pour supporter l'émotion.
            </p>
            <div className="flex gap-4 font-mono text-xs uppercase pt-4">
              <span className="border-b border-(--accent-color)">// Développement</span>
              <span className="border-b border-(--accent-color)">// Photographie</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPERTISE : Liste simple et épurée (plus de cartes) */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h3 className="font-mono text-xs uppercase text-(--accent-color) mb-12">// Compétences & Outils</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { t: "DÉVELOPPEMENT", i: ["REACT / NEXT.JS", "NEST.JS", "TAILWIND"] },
            { t: "PHOTOGRAPHIE", i: ["DIRECTION ARTISTIQUE", "PORTRAIT", "ARGENTIQUE"] },
          ].map((box, i) => (
            <div key={i}>
              <h4 className="font-bold text-sm uppercase mb-4">{box.t}</h4>
              <ul className="font-mono text-xs space-y-2 opacity-60">
                {box.i.map(item => <li key={item}>— {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONCLUSION : Citation discrète */}
      <footer className="py-32 px-6 text-center border-t border-text-main/10 mt-10">
        <div className="max-w-2xl mx-auto italic text-2xl font-light">
          “{data.philosophy_prefix} <span className="text-(--accent-color) font-black">{data.philosophy_important}</span> {data.philosophy_suffix}”
        </div>
        <div className="font-mono text-xs uppercase mt-8 opacity-50">
          — {data.philosophy_author}
        </div>
      </footer>

    </main>
  );
};

export default AboutPage;