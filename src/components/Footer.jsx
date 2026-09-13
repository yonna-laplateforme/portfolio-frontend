import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-paper border-t border-ink/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={scrollToTop}
          className="font-display italic text-3xl text-ink hover:text-brick transition-colors"
        >
          M<span className="text-brick">.</span>
        </Link>

        {/* LIENS */}
        <nav aria-label="Liens sociaux et contact">
          <ul className="flex flex-wrap justify-center gap-8 font-mono text-xs uppercase tracking-[0.25em]">
            <li>
              <a
                href="https://github.com/TON-PSEUDO-GITHUB"
                target="_blank"
                rel="noreferrer"
                className="text-ink hover:text-brick transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/TON-PSEUDO-LINKEDIN"
                target="_blank"
                rel="noreferrer"
                className="text-ink hover:text-brick transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:yonna.s.merlini@gmail.com"
                className="text-ink hover:text-brick transition-colors"
              >
                Email
              </a>
            </li>
            <li>
              <Link
                to="/mentions-legales"
                onClick={scrollToTop}
                className="text-ink hover:text-brick transition-colors"
              >
                Mentions légales
              </Link>
            </li>
          </ul>
        </nav>

        {/* COPYRIGHT */}
        <div className="font-mono text-[10px] text-ink-soft uppercase tracking-widest">
          © {currentYear} MRLN Agency — Yonna Merlini
        </div>
      </div>
    </footer>
  );
};

export default Footer;