import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';
import { apiFetch } from '../api/apiFetch';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const CarouselAwwwards = () => {
  const [images, setImages] = useState([]);
  const baseX = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const SPEED = -6; // vitesse en %/seconde

  // ⬇️ Récupère TOUTES les images de TON API (comme ZigzagProject : image_url séparé par des virgules)
  useEffect(() => {
    apiFetch('api/projects/home')
      .then((projects) => {
        const urls = projects
          .flatMap((p) => (p.image_url ? p.image_url.split(',').map((u) => u.trim()) : []))
          .filter(Boolean);
        setImages(urls);
      })
      .catch((err) => console.error('Erreur carousel:', err));
  }, []);

  useAnimationFrame((_, delta) => {
    if (!paused && images.length > 0) {
      baseX.set(baseX.get() + SPEED * (delta / 1000));
    }
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // Rien à afficher tant qu'on n'a pas les images (pas de bloc vide)
  if (images.length === 0) return null;

  return (
    <div
      className="overflow-hidden py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div style={{ x }} className="flex gap-6 w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-6" aria-hidden={copy === 1}>
            {images.map((src, i) => (
              <img
                key={`${copy}-${i}`}
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-64 md:h-96 w-auto object-cover select-none"
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CarouselAwwwards;