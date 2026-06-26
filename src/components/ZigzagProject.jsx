import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const ZigzagProject = ({ project, index }) => {
    const ref = useRef(null);
    
    // Ton log pour vérifier
    useEffect(() => {
        console.log("Images pour le projet", project.title, ":", project.image_url);
    }, [project]);

    // On transforme en tableau. Si c'est une seule image, ça fera un tableau de 1 élément.
    const imagesArray = project.image_url ? project.image_url.split(',').map(u => u.trim()) : [];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Carrousel auto 10s
    useEffect(() => {
        if (imagesArray.length <= 1) return; // Ne fait rien si pas d'autres images
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imagesArray.length);
        }, 1000);
        return () => clearInterval(interval);
    }, [imagesArray.length]);

    // Animations (Ton code existant)
    const isReverse = index % 2 !== 0;
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const x = useTransform(scrollYProgress, [0, 1], [isReverse ? 100 : -100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div ref={ref} style={{ x: typeof window !== 'undefined' && window.innerWidth >= 768 ? x : 0, opacity }} className="mb-32 flex justify-center w-full">
            <article className="w-full max-w-4xl p-6">
                <div className={`flex flex-col gap-8 items-center ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    {/* Bloc Image */}
                    <div className="w-full md:w-1/2 relative overflow-hidden h-64 bg-zinc-900">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={imagesArray[currentIndex]}
                                alt={project.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </div>

                    {/* Texte */}
                    <div className="w-full md:w-1/2 text-left">
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