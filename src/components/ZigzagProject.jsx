import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';

const ZigzagProject = ({ project, index }) => {
    // 1. GESTION DES RÉFÉRENCES (DOM)
    // Utile pour la soutenance : "J'utilise useRef pour cibler ce composant précis dans le DOM
    // afin de lier son comportement à l'avancement du scroll de l'utilisateur."
    const ref = useRef(null);

    // 2. OPTIMISATION DES PERFORMANCES (useMemo)
    // Question jury : "Pourquoi avoir mis useMemo ici ?"
    // Réponse : "Pour éviter de recalculer et re-séparer la chaîne de caractères (split/map) 
    // à chaque rendu du composant. React garde le tableau en mémoire et ne le recalcule 
    // que si l'URL des images change."
    const imagesArray = useMemo(() => 
        project.image_url ? project.image_url.split(',').map(u => u.trim()) : [], 
        [project.image_url]
    );

    /* 
    // LOG DE DÉBOGAGE 
    useEffect(() => {
        console.log("Images pour le projet", project.title, ":", imagesArray);
    }, [project.title, imagesArray]); 
    */

    // 3. GESTION DE L'ÉTAT LOCAL (Carrousel d'images)
    const [currentIndex, setCurrentIndex] = useState(0);

    // 4. EFFET DE BORD & NETTOYAGE DE MÉMOIRE (useEffect / setInterval)
    // Question jury : "Comment fonctionne votre carrousel et comment gérez-vous la mémoire ?"
    // Réponse : "J'utilise un useEffect pour lancer un timer automatique. Très important : 
    // je retourne une fonction de nettoyage 'clearInterval' pour détruire le timer 
    // quand le composant est démonté, évitant ainsi les fuites de mémoire (memory leaks)."
    useEffect(() => {
        if (imagesArray.length <= 1) return; // Sécurité : pas de timer s'il n'y a qu'une seule image
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imagesArray.length);
        }, 3000); // 3 secondes par image pour une bonne expérience utilisateur
        
        return () => clearInterval(interval); // Nettoyage du timer
    }, [imagesArray.length]);

    // 5. ANIMATIONS LIÉES AU SCROLL (Framer Motion)
    // Question jury : "Comment fonctionne l'effet parallaxe/zigzag au scroll ?"
    // Réponse : "useScroll traque la position du composant à l'écran. useTransform convertit 
    // cette progression en valeurs CSS dynamiques (opacité de 0 à 1, et translation X)."
    const isReverse = index % 2 !== 0; // Alterne la disposition (gauche/droite) une fois sur deux
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    
    // 6. SÉCURITÉ RESPONSIVE / RENDU CÔTÉ CLIENT (SSR)
    // Optionnel mais valorisant : "Pour éviter des sauts d'animation ou des bugs sur mobile,
    // j'active l'effet de translation X uniquement si l'écran est un ordinateur (>= 768px)."
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
    }, []);

    const x = useTransform(scrollYProgress, [0, 1], [isReverse ? 100 : -100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div 
            ref={ref} 
            style={{ x: isDesktop ? x : 0, opacity }} 
            className="mb-32 flex justify-center w-full"
        >
            <article className="w-full max-w-4xl p-6">
                {/* Disposition alternée flex-row / flex-row-reverse selon l'index */}
                <div className={`flex flex-col gap-8 items-center ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    {/* BLOC CARROUSEL D'IMAGES */}
                    <div className="w-full md:w-1/2 relative overflow-hidden h-64 bg-zinc-900">
                        {/* AnimatePresence permet d'animer les composants qui disparaissent du DOM */}
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={imagesArray[currentIndex]} // La clé change à chaque image, forçant le fondu enchaîné
                                src={imagesArray[currentIndex]}
                                alt={project.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>

                    {/* BLOC TEXTE (Contenu du projet) */}
                    <div className="w-full md:w-1/2 text-left">
                        {/* Formatage dynamique du numéro (ex: 01, 02) */}
                        <span className="font-mono text-primary text-xs">0{index + 1}</span>
                        <h3 className="text-4xl font-black uppercase mt-2 text-accent">{project.title}</h3>
                        <p className="mt-4 text-main/70 font-mono text-sm leading-relaxed">{project.description}</p>
                    </div>
                </div>
            </article>
        </motion.div>
    );
};

export default ZigzagProject;