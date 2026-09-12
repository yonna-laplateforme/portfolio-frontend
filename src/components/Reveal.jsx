import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Apparition douce au scroll (bloc entier)
export const Reveal = ({ children, delay = 0, y = 32, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// Ligne qui sort du masque au scroll (titres)
export const RevealLine = ({ children, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}>
    <motion.span
      className="block"
      initial={{ y: '110%' }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);