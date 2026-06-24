import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ZigzagProject = ({ project, index }) => {
    const ref = useRef(null);
    
    // Détermine si on doit inverser (pour le zigzag)
    const isReverse = index % 2 !== 0;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Mouvement uniquement pour le Desktop
    const x = useTransform(scrollYProgress, [0, 1], [isReverse ? 100 : -100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            // Sur mobile (pas de 'md:'), on ne bouge pas (x: 0). Sur desktop, on applique x.
            style={{ x: window.innerWidth >= 768 ? x : 0, opacity }}
            className="mb-32 flex justify-center w-full"
        >
            <article className="w-full max-w-4xl p-6">
                {/* flex-col : Empilement vertical sur mobile
                   md:flex-row : Ligne sur Desktop
                   md:flex-row-reverse : L'inversion pour le zigzag sur Desktop
                */}
                <div className={`flex flex-col gap-8 items-center ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    {/* Image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-64 object-cover"
                        />
                    </div>

                    {/* Texte */}
                    <div className="w-full md:w-1/2 text-left">
                        <span className="font-mono text-primary text-xs">
                            0{index + 1}
                        </span>
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