import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import { Reveal, RevealLine } from '../components/Reveal';
import ZigzagProject from '../components/ZigzagProject';
import ContactMinimal from '../components/ContactMinimal';
import { apiFetch } from '../api/apiFetch';
import CarouselAwwwards from '../components/CarouselAwwwards';

const HomePage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('api/projects/home')
      .then((data) => { setAllProjects(data); setLoading(false); })
      .catch((err) => { console.error('Erreur chargement HomePage:', err); setLoading(false); });
  }, []);

  const featured = allProjects.filter((p) => Number(p.isFeatured) === 1);

  return (
    <div className="bg-paper text-ink min-h-screen">
      <Hero />

      {/* MARQUEE */}
      <div className="my-20">
        <Marquee />
      </div>

      {/* VISION */}
      <section className="py-24 px-6 md:px-12 border-t border-ink/10">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-brick mb-8">
              // Vision technique
            </p>
          </Reveal>
          <h2 className="font-display font-light text-4xl md:text-6xl leading-[1.05]">
            <RevealLine delay={0.1}>Le code comme</RevealLine>
            <RevealLine delay={0.2}>outil <em className="italic text-brick">créatif</em>.</RevealLine>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl text-lg text-ink-soft leading-relaxed">
              Mon approche ne se limite pas à faire fonctionner les interfaces.
              Je structure le DOM pour qu'il soit sémantique et je transforme
              les contraintes techniques en opportunités de design.
              Moins de superflu, plus d'impact.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 w-24 h-px bg-brick" />
          </Reveal>
        </div>
      </section>

{/* BANDE PHOTO */}
<CarouselAwwwards 
  src="https://res.cloudinary.com/dltejn5sh/image/upload/w_1800,q_auto,f_auto/v1788823489/portfolio_uploads/iofcdhccpgjogd5h7qib.jpg"
  alt="Photographie — Yonna Merlini"
  className="h-[55vh] md:h-[70vh] mx-4 md:mx-8 my-24"
/>
      {/* PROJETS */}
      <section className="py-24 px-6 md:px-12 border-t border-ink/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-ink-soft mb-16 flex items-center gap-4">
              <span className="w-12 h-px bg-brick" />
              // Projets sélectionnés
            </p>
          </Reveal>

          {loading ? (
            <p className="font-mono text-sm text-ink-soft">Chargement…</p>
          ) : featured.length > 0 ? (
            <ul className="space-y-28">
              {featured.slice(0, visibleCount).map((project, index) => (
                <li key={project.id}>
                  <Reveal delay={0.05 * index}>
                    <Link to={`/projects/${project.id}`} className="block group">
                      <ZigzagProject project={project} index={index} />
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-sm text-ink-soft">Aucun projet à afficher.</p>
          )}

          <Reveal>
            <div className="flex justify-end mt-20">
              <Link to="/projects"
                className="inline-flex items-center gap-3 rounded-full border border-ink px-8 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-ink hover:text-paper">
                Tous les projets <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-6 md:px-12 border-t border-ink/10">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-brick mb-8">
              // Collaboration
            </p>
          </Reveal>
          <h2 className="font-display font-light text-5xl md:text-7xl leading-tight">
            <RevealLine delay={0.1}>Discutons de</RevealLine>
            <RevealLine delay={0.2}>votre <em className="italic text-brick">projet</em>.</RevealLine>
          </h2>
          <Reveal delay={0.25}>
            <div className="mt-14">
              <ContactMinimal />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;