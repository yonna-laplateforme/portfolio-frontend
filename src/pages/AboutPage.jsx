import React from 'react';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-primary py-32 px-6 md:px-16 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <header className="mb-24">
        <span className="font-mono text-xs uppercase text-[var(--color-accent)] mb-4 block">// IDENTITÉ_VISUELLE</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9]">
            DÉVELOPPEUSE <br />
            <span className="text-[var(--color-accent)]">&</span> PHOTOGRAPHE
          </h1>
          <span className="font-mono text-sm opacity-60 mt-6 md:mt-0">BASÉE À LYON — DISPONIBLE 2026</span>
        </div>
      </header>

      {/* PROFILE SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
        
        {/* PORTRAIT CONTAINER - Version Simplifiée et Garantie */}
<div className="lg:col-span-5 relative">
  {/* On ajoute un conteneur qui déclenche le hover */}
  <div className="group relative">
    
    {/* Image et Cadre */}
    <div className="relative border border-black p-2 bg-white z-10 transition-all duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[8px_8px_0px_#ba0013]">
      <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
        <img 
          src="ton-image.jpg" 
          alt="Yonna Merlini" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      </div>
      <div className="bg-[#ba0013] text-white font-mono text-[10px] px-2 py-1 inline-block mt-2">
        YONNA_MERLINI.JPG
      </div>
    </div>

    {/* Cadre de fond fixe (le trait noir) */}
    <div className="absolute top-4 left-4 w-full h-full border border-black -z-0"></div>

  </div>
</div>

        {/* BIO CONTENT */}
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8">L'INTERSECTION DU CODE ET DE L'IMAGE</h2>
          <div className="space-y-6 text-lg opacity-90 leading-relaxed">
            <p>
              Je m'appelle Yonna Merlini. Mon travail explore l'équilibre entre la rigueur technique du développement web et la sensibilité organique de la photographie. Je crée des expériences numériques qui ne se contentent pas de fonctionner, mais qui racontent une histoire visuelle forte.
            </p>
            <p className="opacity-70">
              En tant que développeuse, je privilégie des architectures propres et des interfaces intuitives. En tant que photographe, je cherche à capturer l'essence brute des sujets, qu'il s'agisse d'architecture urbaine ou de portraits intimistes.
            </p>
          </div>
          
        </div>
      </section>

      {/* SÉPARATEUR BRUTALISTE */}
      {/* SÉPARATEUR BRUTALISTE AVEC TRAITS */}
<div className="flex items-center gap-6 mb-16 w-full">
  {/* Trait gauche */}
  <div className="h-px flex-1 bg-black"></div>
  
  {/* Texte centré */}
  <span className="font-mono text-sm uppercase whitespace-nowrap">
    CHAMPS D'EXPERTISE
  </span>
  
  {/* Trait droit */}
  <div className="h-px flex-1 bg-black"></div>
</div>

      {/* EXPERTISE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { t: "DÉVELOPPEMENT", i: ["REACT / NEXT.JS", "TAILWIND CSS", "TYPESCRIPT", "THREE.JS"] },
          { t: "PHOTOGRAPHIE", i: ["DIRECTION ARTISTIQUE", "ÉDITION NUMÉRIQUE", "ARGENTIQUE", "PORTRAIT"] },
          { t: "STRATÉGIE", i: ["ANALYSE DE BESOINS", "OPTIMISATION SEO", "BRAND IDENTITY"] }
        ].map((box, i) => (
          <div key={i} className="border border-[var(--main)] p-8 hover:bg-[var(--main)] hover:text-[var(--bg)] transition-colors duration-300">
            <h4 className="font-bold text-xl mb-8 uppercase">{box.t}</h4>
            <ul className="font-mono text-sm space-y-3 opacity-90">
              {box.i.map(item => <li key={item}>— {item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* GRAND CADRE NOIR (CITATION) */}
      <section className="bg-[var(--main)] text-[var(--bg)] p-12 md:p-24 text-center border border-[var(--main)]">
        <h3 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-8">
          "LA TECHNIQUE <span className="text-[var(--primary)]">SANS VISION</span> N'EST QUE DU BRUIT."
        </h3>
        <p className="font-mono text-sm max-w-xl mx-auto opacity-70">
          Chaque pixel et chaque grain de film sont intentionnels. Je crois en une esthétique qui sert la fonction tout en provoquant une émotion.
        </p>
      </section>
    </main>
  );
};

export default AboutPage;