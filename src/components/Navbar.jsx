import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ token, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path) => {
    setIsOpen(false); // Ferme le menu après clic
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-800 bg-bg/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div onClick={() => handleNavigation('/')} className="cursor-pointer flex items-center font-black text-xl text-accent">
          Y<span className="text-primary">M</span>
        </div>

        {/* BOUTON BURGER MOBILE */}
        <button 
  onClick={() => setIsOpen(!isOpen)} 
  aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  className="md:hidden text-main p-2"
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>

<div className={`
  fixed inset-0 top-16 z-40 
  bg-[#fdfcfc] 
  w-full h-dvh 
  flex flex-col items-center justify-center gap-12
  md:static md:flex-row md:justify-end md:h-auto md:w-auto md:gap-8 md:p-0 md:bg-transparent
  ${isOpen ? 'flex' : 'hidden md:flex'}
`}>
  <ul className="flex flex-col md:flex-row items-center gap-12 md:gap-8">
    <li>
      <button 
        onClick={() => handleNavigation('/projects')} 
        className="text-3xl md:text-sm hover:text-accent hover:font-bold transition-colors font-mono uppercase tracking-[0.2em]"
      >
        Projets
      </button>
    </li>
    <li>
      <button 
        onClick={() => handleNavigation('/about')} 
        className="text-3xl md:text-sm hover:text-accent hover:font-bold transition-colors font-mono uppercase tracking-[0.2em]"
      >
        À Propos
      </button>
    </li>
    <li>
      <button 
        onClick={() => handleNavigation('/contact')} 
        className="text-3xl md:text-sm hover:text-accent hover:font-bold transition-colors font-mono uppercase tracking-[0.2em]"
      >
        Contact
      </button>
    </li>
  </ul>

          
          {token && (
  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-8 md:pt-0 md:pl-6">
   
    <Link to="/dashboard-yonna-2026" className="hover:text-primary">ADMIN</Link>
    <button onClick={onLogout} className="hover:text-red-500"><LogOut size={16}/></button>
  </div>

          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;