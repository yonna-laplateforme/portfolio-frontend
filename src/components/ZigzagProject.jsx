import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const ZigzagProject = ({ project, index }) => {
    const ref = useRef(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [
        isDesktop ? (index % 2 === 0 ? -100 : 100) : 0,
        0
    ]);

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Logique d'alternance : 
    // index % 2 !== 0 signifie que c'est un projet impair (le 2ème, 4ème, etc.)
    const isReverse = index % 2 !== 0;

    return (
        <motion.div
            ref={ref}
            style={{ x, opacity }}
            className="mb-16 md:mb-32 flex justify-center"
        >
            <article className="w-full max-w-4xl shadowbox bg-bg p-6 hover:border-primary transition-colors">
                {/* Ajout de la condition dynamique ici */}
                <div className={`flex flex-col gap-8 items-center ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full md:w-1/2 h-64 object-cover"
                    />

                    <div className="flex-1">
                        <span className="font-mono text-primary">0{index + 1}</span>
                        <h3 className="text-4xl font-black uppercase mt-2 text-accent">
                            {project.title}
                        </h3>
                        <p className="mt-4 text-main/70 font-mono text-sm leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                </div>
            </article>
        </motion.div>
    );
};

export default ZigzagProject;