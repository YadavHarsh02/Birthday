import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function FinalImageSection() {
  return (
    <section className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center p-4">
      {/* Subtle glowing background effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-4xl aspect-[4/3] md:aspect-[16/9] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/20"
      >
        <Image
          src="/final-collage.png"
          alt="Final Memory Collage"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </section>
  );
}
