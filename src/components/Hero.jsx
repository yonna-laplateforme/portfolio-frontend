import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const Masked = ({ children, delay = 0 }) => (
 <span className="block overflow-hidden pb-[0.3em] -mb-[0.3em]">
    <motion.span
      className="block"
      initial={{ y: '110%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

const Hero = () => (
  <section className="relative -mt-16 h-screen flex flex-col justify-end overflow-hidden">
    {/* FOND — ton image drone avec zoom cinématique */}
   {/* FOND VIDÉO drone */}
<video
  ref={(el) => { if (el) el.muted = true; }}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="absolute inset-0 w-full h-full object-cover"
>
  <source
    src="https://res.cloudinary.com/dltejn5sh/video/upload/w_1920,q_auto/v1789242431/dji_fly_20260907_011822_0301_1788716033973_video_d_log.mp4"
    type="video/mp4"
  />
</video>
    {/* Voile sombre pour la lisibilité */}
    <div className="absolute inset-0 bg-ink/55" />

    {/* CONTENU */}
    <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-24">
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
        className="font-mono text-xs tracking-[0.35em] uppercase text-paper/70 mb-8"
      >
        Studio — Lyon, France
      </motion.p>

      <h1 className="font-display font-light text-paper leading-[0.88] text-[18vw] md:text-[11.5vw]">
        <Masked delay={0.35}>MRLN</Masked>
        <Masked delay={0.48}>
          <em className="italic font-normal text-brick">Agency</em>
        </Masked>
      </h1>

     <div className="overflow-hidden mt-10 pb-[0.3em] -mb-[0.3em]">
        <motion.p
          initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="max-w-xl text-lg md:text-xl text-paper/85 leading-relaxed"
        >
          Le studio de <span className="font-display italic text-paper">Yonna Merlini</span> —
          développeuse full-stack &amp; photographe. Des sites qui racontent des histoires,
          des images qui laissent une trace.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.95 }}
        className="mt-10 flex flex-wrap items-center gap-8"
      >
        <a href="/projects"
          className="inline-flex items-center gap-3 rounded-full border border-paper/60 px-8 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-paper hover:text-ink">
          Voir les projets <span aria-hidden>→</span>
        </a>
        <a href="/devis" className="text-sm font-medium text-paper underline underline-offset-4 decoration-brick decoration-2 hover:text-brick transition">
          Demander un devis
        </a>
      </motion.div>
    </div>

    {/* Indicateur scroll */}
    <motion.p
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
      className="absolute bottom-6 right-6 md:right-12 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50 z-10"
    >
      Défiler ↓
    </motion.p>
  </section>
);

export default Hero;