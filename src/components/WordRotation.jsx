import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ["DÉVELOPPEUSE FULL-STACK", "PHOTOGRAPHE", "CRÉATRICE DIGITALE"];

const WordRotation = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WordRotation;