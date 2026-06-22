import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm'; // On importe ton composant logique

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-(--bg-color) pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête de page aligné */}
        <header className="mb-16 text-center">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-mono text-(--accent-color) uppercase tracking-[0.3em] mb-4"
          >
            // CONTACT
          </motion.h3>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase text-(--primary-color)"
          >
            DÉMARRONS UN <br/> NOUVEAU <span className="text-(--accent-color)">PROJETS</span>.
          </motion.h1>
        </header>

       
        <ContactForm />

       

      </div>
    </main>
  );
};

export default ContactPage;