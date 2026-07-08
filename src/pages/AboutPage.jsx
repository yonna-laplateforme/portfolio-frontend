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
      
      {/* 1. HERO */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <span className="font-mono text-xs uppercase text-(--accent-color) mb-6 block">// Introduction</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase leading-[0.9] max-w-4xl">
            {data.header_line1} <span className="text-(--accent-color)">{data.header_accent}</span> {data.header_line2}
          </h1>
          <p className="mt-6 font-mono text-xs uppercase opacity-60">{data.header_subtitle}</p>
        </motion.div>
      </section>

      {/* 2. BIO NARRATIVE */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {data.bio_text?.split('|').map((part, i) => (
              <p key={i} className={`text-xl md:text-2xl font-light leading-relaxed ${i === 0 ? "font-bold text-3xl md:text-4xl" : "opacity-80"}`}>
                {part.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PORTRAIT & DUALITÉ DYNAMIQUE */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
       <motion.img
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  src={data.photo_url} 
  alt="Portrait"
  className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/5] object-cover"
/>
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black uppercase mb-6">{data.dualite_title}</h2>
              <p className="opacity-70 leading-relaxed">{data.dualite_text}</p>
            </div>
            
            {/* Grille Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-text-main/20">
              <div>
                <h4 className="font-bold text-sm uppercase mb-4">Développement</h4>
                <ul className="font-mono text-xs space-y-2 opacity-60">
                  {data.tech_dev?.split('|').map(item => <li key={item}>— {item.trim()}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase mb-4">Photographie</h4>
                <ul className="font-mono text-xs space-y-2 opacity-60">
                  {data.tech_photo?.split('|').map(item => <li key={item}>— {item.trim()}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION VIDÉO DYNAMIQUE */}
      {data.video_url && (
        <section className="relative w-full h-[50vh] overflow-hidden my-10">
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale-[50%] hover:grayscale-0 transition-all duration-1000"
          >
            <source src={data.video_url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10" />
        </section>
      )}

      {/* 5. PHILOSOPHIE : Grand Final */}
      <footer className="py-32 px-6 text-center border-t border-text-main/10 mt-10">
        <div className="max-w-2xl mx-auto text-2xl md:text-4xl font-light leading-tight">
          "{data.philosophy_prefix} <span className="text-(--accent-color) font-black">{data.philosophy_important}</span> {data.philosophy_suffix}"
        </div>
        <div className="font-mono text-xs uppercase mt-12 opacity-50 tracking-widest">
          — {data.philosophy_author}
        </div>
      </footer>

    </main>
  );
};

export default AboutPage;