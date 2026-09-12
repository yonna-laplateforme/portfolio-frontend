import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';

const ZigzagProject = ({ project, index }) => {
    // 1. Référence DOM pour lier le composant au scroll
    const ref = useRef(null);

    // 2. useMemo : évite de re-splitter la chaîne d'URLs à chaque rendu
    const imagesArray = useMemo(() => 
        project.image_url ? project.image_url.split(',').map(u => u.trim()) : [], 
        [project.image_url]
    );

    // 3. État local du carrousel d'images du projet
    const [currentIndex, setCurrentIndex] = useState(0);

    // 4. Timer auto + nettoyage mémoire (clearInterval)
    useEffect(() => {
        if (imagesArray.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imagesArray.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [imagesArray.length]);

    // 5. Parallax / apparition au scroll
    const isReverse = index % 2 !== 0;
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    
    // 6. Effet de translation uniquement sur desktop
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        setIsDesktop(window.innerWidth >= 768);
    }, []);

    const x = useTransform(scrollYProgress, [0, 1], [isReverse ? 80 : -80, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.6]);

    return (
        <motion.div 
            ref={ref} 
            style={{ x: isDesktop ? x : 0, opacity }} 
            className="flex justify-center w-full"
        >
            <article className="group w-full max-w-5xl">
                <div className={`flex flex-col gap-10 items-center ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    {/* BLOC IMAGE(S) */}
                    <div className="w-full md:w-3/5 relative overflow-hidden h-72 md:h-[26rem] bg-sand/40">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={imagesArray[currentIndex]}
                                src={imagesArray[currentIndex]}
                                alt={project.title}
                                initial={{ opacity: 0, scale: 1.04 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="zoom-img w-full h-full object-cover"
                            />
                        </AnimatePresence>
                        {/* Indicateur d'images multiples */}
                        {imagesArray.length > 1 && (
                            <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widest text-paper bg-ink/60 px-2 py-1">
                                {currentIndex + 1} / {imagesArray.length}
                            </span>
                        )}
                    </div>

                    {/* BLOC TEXTE */}
                    <div className="w-full md:w-2/5">
                        <span className="font-mono text-xs text-brick">0{index + 1}</span>
                        <h3 className="font-display font-light text-3xl md:text-4xl mt-3 leading-tight transition-colors duration-300 group-hover:text-brick">
                            {project.title}
                        </h3>
                        <p className="mt-5 text-ink-soft leading-relaxed text-[15px]">
                            {project.description}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ink transition-all duration-300 group-hover:gap-4 group-hover:text-brick">
                            Voir le projet <span aria-hidden>→</span>
                        </span>
                    </div>
                </div>

                {/* Fine ligne de séparation */}
                <div className="mt-16 h-px w-full bg-ink/10" />
            </article>
        </motion.div>
    );
};

export default ZigzagProject;