'use client'

import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="w-full bg-transparent text-white py-16 px-6 flex flex-col items-center justify-center relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6"
      >
        <p className="font-cursive text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-wide mb-8">
          To the moon and beyond ✨
        </p>
        
        <div className="w-24 h-px bg-white/30 mb-4"></div>
        
        <p className="flex items-center justify-center gap-2 text-sm md:text-base font-medium tracking-widest uppercase text-white/70">
          Developed with <span className="text-red-500 animate-pulse text-xl">❤️</span> by Harsh
        </p>
        <p className="text-xs text-white/40 font-mono mt-2">
          © {new Date().getFullYear()} The Multiverse Project.
        </p>
      </motion.div>
    </footer>
  )
}
