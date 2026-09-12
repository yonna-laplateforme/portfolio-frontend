import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const EASE = [0.76, 0, 0.24, 1];

const LINKS = [
  { label: 'Projets', path: '/projects', num: '01' },
  { label: 'À propos', path: '/about', num: '02' },
  { label: 'Contact', path: '/contact', num: '03' },
];

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    setTimeout(() => navigate(path), 500); // laisse le rideau se fermer avant de changer de page
  };

  return (
    <>
      {/* BARRE DU HAUT */}
      <header className={`fixed top-0 left-0 w-full z-[60] px-6 md:px-12 h-16 flex items-center justify-between transition-colors duration-500 ${open ? 'text-paper' : 'text-ink'}`}>
        <button onClick={() => go('/')} className="font-display italic text-3xl" aria-label="Accueil">
          M<span className="text-brick">.</span>
        </button>

        <div className="flex items-center gap-8">
          {isAuthenticated && !open && (
            <>
              <Link to="/dashboard-yonna-2026" className="font-mono text-xs uppercase tracking-[0.25em] hover:text-brick transition-colors">Admin</Link>
              <button onClick={onLogout} className="font-mono text-xs uppercase tracking-[0.25em] hover:text-brick transition-colors">Sortir</button>
            </>
          )}
          <button onClick={() => setOpen(!open)} className="font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-3">
            {open ? 'Fermer' : 'Menu'}
            <span className="flex flex-col gap-1.5">
              <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="block w-6 h-px bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="block w-6 h-px bg-current" />
            </span>
          </button>
        </div>
      </header>

      {/* OVERLAY PLEIN ÉCRAN */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] bg-ink text-paper flex flex-col justify-between px-6 md:px-12 pt-28 pb-10"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav>
              <ul className="space-y-3 md:space-y-5">
                {LINKS.map((link, i) => (
                  <li key={link.path} className="overflow-hidden">
                    <motion.button
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: EASE }}
                      onClick={() => go(link.path)}
                      className="group flex items-baseline gap-6 text-left"
                    >
                      <span className="font-mono text-sm text-brick">{link.num}</span>
                      <span className="font-display font-light text-6xl md:text-8xl leading-none transition-all duration-300 group-hover:italic group-hover:text-brick group-hover:translate-x-4">
                        {link.label}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-[0.25em] text-paper/60"
            >
              <span>yonnamerlini.com</span>
              <span>Lyon, France</span>
              <span className="text-brick">Disponible pour missions</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;