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
          src="/placeholder.jpg" // Replace this with your actual image file!
          alt="Final Memory"
          fill
          className="object-cover"
          priority
        />
        
        {/* Subtle overlay gradient to make text readable if you want to add any later */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-8 left-0 w-full text-center">
          <p className="text-white font-cursive text-3xl md:text-5xl drop-shadow-lg tracking-wide">
            To Infinity & Beyond ✨
          </p>
        </div>
      </motion.div>
    </section>
  );
}
