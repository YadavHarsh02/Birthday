"use client"
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function DepthSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth cinematic fall-back effect.
  // 0 to 0.33: The section is fully visible and stuck.
  // 0.33 to 1: The next section is sliding up over this one.
  const scale = useTransform(scrollYProgress, [0, 0.33, 1], [1, 1, 0.75])
  const filter = useTransform(scrollYProgress, [0, 0.33, 1], ['blur(0px)', 'blur(0px)', 'blur(12px)'])
  const opacity = useTransform(scrollYProgress, [0, 0.33, 0.8, 1], [1, 1, 0.1, 0])

  return (
    <div ref={containerRef} className="relative w-full h-[150vh]">
      <motion.div 
        style={{ scale, filter, opacity }} 
        className="sticky top-0 w-full h-screen origin-top overflow-hidden bg-transparent shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
      >
        {children}
      </motion.div>
    </div>
  )
}
