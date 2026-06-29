import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-(--bg-color) border-t border-[#333] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Identité - Lien propre vers la Home avec scroll */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="cursor-pointer flex items-center font-black text-xl text-accent hover:opacity-80 transition-opacity"
        >
          Y<span className="text-primary">M</span>
        </Link>

        {/* Liens techniques */}
        <nav aria-label="Liens sociaux et contact">
          <ul className="flex gap-8 font-mono text-[12px] uppercase tracking-[0.2em] text-(--text-main)/90">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-(--primary-color) hover:text-(--accent-color) transition-colors font-bold"
              >
                GitHub
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-(--primary-color) hover:text-(--accent-color) transition-colors font-bold"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a 
                href="mailto:yonna.s.merlini@gmail.com" 
                className="text-(--primary-color) hover:text-(--accent-color) transition-colors font-bold"
              >
                Email
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <div className="font-mono text-[10px] text-[#333] uppercase tracking-widest">
          © {currentYear} YONNA MERLINI // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};

export default Footer;