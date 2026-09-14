import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onDone }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100)); // easing
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-ink text-paper flex items-center justify-center"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="overflow-hidden pb-[0.25em] -mb-[0.25em]">
        <motion.p
          initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic text-3xl md:text-5xl"
        >
          MRLN Agency
        </motion.p>
      </div>
      <p className="absolute bottom-8 right-8 font-mono text-sm tabular-nums">{count}%</p>
    </motion.div>
  );
};

export default Preloader;