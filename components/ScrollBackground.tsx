"use client"
import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ScrollBackground() {
  const { scrollYProgress } = useScroll()

  // Smoothly interpolate background color from top to bottom
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      '#fff0f5', // Lavender Blush / Soft Pink (Top)
      '#fdfbf7', // Warm Off-white (Memories)
      '#2e1b4b', // Twilight Purple (Letter)
      '#1a1a2e', // Midnight Blue (Cake/Outro)
    ]
  )

  return (
    <motion.div 
      className="fixed inset-0 z-[-100] pointer-events-none"
      style={{ backgroundColor }}
    >
      {/* Subtle floating decorative particles in the background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {['✨', '🌸', '🎈', '💖'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
