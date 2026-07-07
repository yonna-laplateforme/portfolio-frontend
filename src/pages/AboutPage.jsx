import { useState, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';
import { getOptimizedUrl } from '../utils/imageUtils';

const AboutPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // On garde juste le chargement des données
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

  if (loading || !data) return <main className="min-h-screen"></main>;

  return (
    <main className="min-h-screen bg-(--bg-color) text-(--text-main) py-16 md:py-32 px-6 md:px-16 max-w-7xl mx-auto overflow-x-hidden">

      {/* HEADER SECTION */}
      <header className="mb-24">
        <span className="font-mono text-xs font-bold uppercase text-(--accent-color) mb-4 block">// IDENTITÉ_VISUELLE</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1 className="font-heading text-5xl md:text-8xl font-black uppercase leading-[0.9]">
            {data.header_line1} <br />
            <span className="text-(--accent-color)">{data.header_accent}</span> {data.header_line2}
          </h1>
          <span className="font-mono text-sm opacity-60 mt-6 md:mt-0">{data.header_subtitle}</span>
        </div>
      </header>

      {/* PROFILE SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
        <div className="lg:col-span-5 relative w-full max-w-sm mx-auto lg:mx-0">
          <div className="group relative">
            <div className="relative border border-(--text-main) p-2 bg-white z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[8px_8px_0px_var(--accent-color)]">
              <div className="aspect-4/5 bg-gray-200 overflow-hidden">
                <img
                  src={getOptimizedUrl(data.photo_url)}
                  alt="Yonna Merlini"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="bg-(--accent-color) text-white font-mono text-[10px] px-2 py-1 inline-block mt-2">YONNA_MERLINI.JPG</div>
            </div>
            <div className="absolute top-4 left-4 w-full h-full border border-(--text-main) z-0 hidden lg:block"></div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase mb-8">{data.bio_title}</h2>
          <div className="space-y-12">
            {data.bio_text.split('|').map((part, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? "text-2xl font-black uppercase" : "text-lg opacity-80"}`}>
                {part.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SÉPARATEUR */}
      <div className="flex items-center gap-6 mb-16 w-full">
        <div className="h-px flex-1 bg-(--text-main)"></div>
        <span className="font-mono text-sm uppercase whitespace-nowrap">CHAMPS D'EXPERTISE</span>
        <div className="h-px flex-1 bg-(--text-main)"></div>
      </div>

      {/* EXPERTISE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { t: "DÉVELOPPEMENT", i: ["REACT / NEXT.JS / NEST.JS", "TAILWIND CSS", "TYPESCRIPT"] },
          { t: "PHOTOGRAPHIE", i: ["DIRECTION ARTISTIQUE", "ÉDITION NUMÉRIQUE", "ARGENTIQUE", "PORTRAIT"] },
          { t: "STRATÉGIE", i: ["ANALYSE DE BESOINS", "OPTIMISATION SEO", "BRAND IDENTITY"] }
        ].map((box, i) => (
          <div key={i} className="border border-(--text-main) p-8 hover:bg-(--text-main) hover:text-(--bg-color) transition-colors duration-300">
            <h4 className="font-bold text-xl mb-8 uppercase">{box.t}</h4>
            <ul className="font-mono text-sm space-y-3 opacity-90">
              {box.i.map(item => <li key={item}>— {item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* GRAND CADRE NOIR */}
      <section className="bg-(--primary-color) text-(--bg-color) p-12 md:p-24 text-center border border-(--text-main) min-h-100 flex flex-col">
        <div className="grow flex flex-col justify-center">
          <h3 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-8">
            "{data.philosophy_prefix} <span className="text-(--accent-color)">{data.philosophy_important}</span> {data.philosophy_suffix}"
          </h3>
          <p className="font-mono text-sm max-w-xl mx-auto opacity-70">
            {data.philosophy_text}
          </p>
        </div>
        <p className="font-mono text-sm text-(--bg-color font-bold max-w-xl mx-auto opacity-70 mt-auto pt-12">
          {data.philosophy_author}
        </p>
      </section>
    </main>
  );
};

export default AboutPage;