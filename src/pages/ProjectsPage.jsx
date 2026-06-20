import ProjectList from '../components/ProjectList';

const ProjectsPage = ({ isAdmin }) => {
  return (
    // Utilisation de la classe body (bg-bg, text-main)
    <main className="min-h-screen pt-32 pb-20"> 
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        
        {/* En-tête de page harmonisé */}
        <header className="mb-20 text-center">
          
          <h1 className="text-primary text-4xl md:text-5xl font-black uppercase text-main mt-4 mb-6">
            Sélection Projets
          </h1>
          <div className="h-px w-12 bg-primary mx-auto"></div>
          <p className="mt-8 text-secondary font-mono text-sm max-w-lg mx-auto leading-relaxed">
            Exploration visuelle et technique à travers différents médiums. 
            Chaque projet est une recherche sur la forme et la narration.
          </p>
        </header>

        {/* La liste des projets */}
        <main>
          <ProjectList isAdmin={isAdmin} />
        </main>
        
      </div>
    </main>
  );
};

export default ProjectsPage;