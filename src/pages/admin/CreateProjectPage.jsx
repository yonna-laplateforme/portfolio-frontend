import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [project, setProject] = useState({
    title: '',
    description: '',
    tech_stack: '',
    client: '',
    role: '',
    year: '2026',
    github_url: '',
    demo_url: '',
    isFeatured: false // Initialisé à false
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('description', project.description);
    formData.append('tech_stack', project.tech_stack);
    formData.append('client', project.client);
    formData.append('role', project.role);
    formData.append('year', project.year);
    formData.append('github_url', project.github_url);
    formData.append('demo_url', project.demo_url);
    // On envoie 1 si true, 0 si false pour correspondre au TINYINT SQL
    formData.append('isFeatured', project.isFeatured ? 1 : 0);
    
    if (selectedFile) {
      formData.append('image', selectedFile); 
    }

    try {
      const response = await fetch(`http://localhost:3001/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert("Nouveau projet créé avec succès !");
        navigate('/');
      } else {
        alert("Erreur lors de la création");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#fcfaf8] text-[#333] font-sans p-6 md:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12">
          <h2 className="text-4xl font-light mb-2 tracking-wide">Nouveau projet</h2>
          <p className="text-gray-500 text-sm">Ajoutez une nouvelle réalisation à votre portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
          
          {/* COLONNE GAUCHE (Principale) */}
          <div className="flex-1 space-y-8">
            <div className="space-y-6 bg-white p-6 md:p-10 border border-[#f0ebe1] shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Titre du projet *</label>
                <input 
                  className="w-full p-3 bg-[#f8f6f3] border border-[#e8e4dc] focus:outline-none focus:border-[#a67c52] transition-colors text-sm"
                  value={project.title}
                  onChange={(e) => setProject({...project, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description *</label>
                <textarea 
                  className="w-full p-4 bg-[#f8f6f3] border border-[#e8e4dc] focus:outline-none focus:border-[#a67c52] text-sm h-48 resize-none"
                  value={project.description}
                  onChange={(e) => setProject({...project, description: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="bg-white p-6 md:p-10 border border-[#f0ebe1] shadow-sm space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Image principale *</label>
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-[#d9d4cc] border-dashed bg-[#faf8f5] hover:bg-[#f0ebe1] transition-colors cursor-pointer group">
                {preview ? (
                  <img src={preview} alt="Aperçu" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-sm font-medium">Glissez-déposez ou cliquez</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-6 md:p-8 border border-[#f0ebe1] shadow-sm space-y-5">
              
              {/* NOUVELLE SECTION: Statut */}
              <div className="pb-5 border-b border-[#f0ebe1]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-[#8b4513] border-gray-300 rounded focus:ring-[#8b4513]"
                    checked={project.isFeatured}
                    onChange={(e) => setProject({...project, isFeatured: e.target.checked})}
                  />
                  <span className="text-sm text-gray-700">Mettre en avant sur l'accueil</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client</label>
                <input 
                  className="w-full p-2.5 bg-[#f8f6f3] border border-[#e8e4dc] focus:outline-none focus:border-[#a67c52] text-sm"
                  value={project.client}
                  onChange={(e) => setProject({...project, client: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Technologies</label>
                <input 
                  className="w-full p-2.5 bg-[#f8f6f3] border border-[#e8e4dc] focus:outline-none focus:border-[#a67c52] text-sm"
                  value={project.tech_stack}
                  onChange={(e) => setProject({...project, tech_stack: e.target.value})}
                />
              </div>

              <div className="pt-2 space-y-5 border-t border-[#f0ebe1]">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lien GitHub</label>
                  <input 
                    className="w-full p-2.5 bg-[#f8f6f3] border border-[#e8e4dc] focus:outline-none focus:border-[#a67c52] text-sm"
                    value={project.github_url}
                    onChange={(e) => setProject({...project, github_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#8b4513] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#6b350e] transition-colors"
            >
              Enregistrer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;