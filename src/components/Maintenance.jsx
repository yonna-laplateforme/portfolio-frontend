const Maintenance = () => {
  return (
    <div className="min-h-screen bg-(--bg-color) text-(--text-main) flex flex-col items-center justify-center p-6 font-mono">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-black uppercase tracking-tighter text-primary">
          // MAINTENANCE
        </h1>
        <p className="text-secondary uppercase tracking-[0.3em] text-[10px]">
          LE PORTFOLIO EST ACTUELLEMENT EN MISE À JOUR.
        </p>
        <div className="w-16 h-px bg-accent mx-auto"></div>
        <p className="text-primary text-sm">
          RETOUR PRÉVU TRÈS PROCHAINEMENT.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;