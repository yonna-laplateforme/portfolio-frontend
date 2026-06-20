const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--bg-color) border-t border-[#333] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Identité */}
        <div className="font-black text-(--accent-color) tracking-tighter">
          YM<span className="text-(--primary-color)">.</span>
        </div>

        {/* Liens techniques */}
        <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-(--text-main)/60">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-(--primary-color) transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-(--primary-color) transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:yonna.s.merlini@gmail.com" 
            className="hover:text-(--primary-color) transition-colors"
          >
            Email
          </a>
        </div>

        {/* Copyright */}
        <div className="font-mono text-[10px] text-[#333] uppercase tracking-widest">
          © {currentYear} YONNA MERLINI // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};

export default Footer;