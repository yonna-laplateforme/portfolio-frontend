import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Cursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => setHover(!!e.target.closest('a, button, [data-hover]'));
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [x, y]);

  return (
    <div className="hidden md:block" aria-hidden>
      <motion.div style={{ x, y }} className="fixed top-0 left-0 z-[99] pointer-events-none">
        <div className="w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brick" />
      </motion.div>
      <motion.div style={{ x: ringX, y: ringY }} className="fixed top-0 left-0 z-[98] pointer-events-none">
        <motion.div
          animate={{ scale: hover ? 2.2 : 1, opacity: hover ? 0.9 : 0.5 }}
          transition={{ duration: 0.25 }}
          className="w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brick"
        />
      </motion.div>
    </div>
  );
};

export default Cursor;