import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';
import { apiFetch } from '../api/apiFetch';
import { getOptimizedUrl } from '../utils/imageUtils';

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const CarouselAwwwards = () => {
  const [items, setItems] = useState([]); // [{ url, projectId }]
  const baseX = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const SPEED = -6;

  // Récupère images + GIF avec l'ID de leur projet (les vidéos restent dans les cards)
  useEffect(() => {
    apiFetch('api/projects/home')
      .then((projects) => {
        const list = projects.flatMap((p) =>
          (p.image_url ? p.image_url.split(',').map((u) => u.trim()) : [])
            .filter(Boolean)
            .filter((u) => !u.includes('/video/upload/'))
            .map((u) => ({ url: u, projectId: p.id }))
        );
        setItems(list);
      })
      .catch((err) => console.error('Erreur carousel:', err));
  }, []);

  useAnimationFrame((_, delta) => {
    if (!paused && items.length > 0) {
      baseX.set(baseX.get() + SPEED * (delta / 1000));
    }
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div style={{ x }} className="flex gap-6 w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-6" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <Link
                key={`${copy}-${i}`}
                to={`/projects/${item.projectId}`}
                className="block shrink-0"
                aria-label="Voir le projet"
              >
                <img
                  src={getOptimizedUrl(item.url, 1200)}
                  alt=""
                  loading="lazy"
                  width="800"
                  height="600"
                  draggable={false}
                  className="h-64 md:h-96 w-auto object-cover select-none transition-opacity duration-300 hover:opacity-80"
                />
              </Link>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CarouselAwwwards;