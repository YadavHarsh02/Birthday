"use client"
import React from 'react'
import { motion } from 'framer-motion'

// Shared background petals component
const BackgroundPetals = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={`petal-${i}`}
        className="absolute text-pink-200 text-xl md:text-3xl opacity-50"
        initial={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          rotate: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{
          top: ['-10%', '110%'],
          rotate: [0, 360],
          x: [0, Math.sin(i) * 50]
        }}
        transition={{
          duration: Math.random() * 10 + 20,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10
        }}
      >
        🌸
      </motion.div>
    ))}
  </div>
);

const PolaroidFrame = ({ rotation, delay, x = 0, y = 0, flowerTop, className = "" }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: y }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      style={{ rotate: rotation, x }}
      className={`relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100 ${className}`}
    >
      {/* Decorative flower */}
      <div className={`absolute ${flowerTop ? '-top-8 -left-8' : '-bottom-6 -right-6'} text-5xl md:text-6xl drop-shadow-md z-10`}>
        {flowerTop ? '🌺' : '🌸'}
      </div>

      {/* Inner photo placeholder */}
      <div className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] bg-[#f8f9fa] border border-gray-200 shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)] flex items-center justify-center">
        <span className="text-gray-300 text-sm font-medium tracking-widest uppercase">Photo Placeholder</span>
      </div>

      {/* Signature / Text space */}
      <div className="absolute bottom-3 right-6 font-cursive text-gray-400 text-xl opacity-80">
        With love...
      </div>
    </motion.div>
  )
}

const Page1 = () => (
  <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden py-20">
    <BackgroundPetals />

    {/* Title Badge */}
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="z-10 bg-gradient-to-r from-[#ff7e9a] to-[#ff5d80] text-white font-bold text-2xl md:text-4xl px-10 py-4 md:px-14 md:py-6 rounded-full shadow-[0_10px_25px_rgba(255,93,128,0.4)] mb-20 border-4 border-white/80"
    >
      Pretty lil Takli?
    </motion.div>

    <div className="z-10 flex flex-col md:flex-row gap-16 md:gap-24 items-center justify-center relative w-full max-w-5xl px-4">
      <PolaroidFrame rotation={-4} delay={0.2} x={-20} flowerTop={true} />
      <PolaroidFrame rotation={6} delay={0.4} x={20} y={40} flowerTop={false} className="border-4 border-pink-100" />
    </div>
  </div>
)

const Page2 = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      <BackgroundPetals />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="relative z-10"
      >
        {/* Retro Camera Illustration */}
        <div className="relative w-[340px] sm:w-[450px] md:w-[600px] h-[220px] sm:h-[280px] md:h-[350px] bg-gradient-to-b from-[#dcdcdc] to-[#b0b0b0] rounded-[30px] md:rounded-[40px] shadow-[0_30px_50px_rgba(0,0,0,0.2)] border-t-[4px] border-[#f4f4f4] border-b-[6px] border-[#909090] p-5 sm:p-8 flex items-center">

          {/* Decorative Bows & Flowers */}
          <div className="absolute -top-12 -left-8 text-[5rem] drop-shadow-xl z-20" style={{ transform: 'rotate(-20deg)' }}>🎀</div>
          <div className="absolute -top-14 right-12 text-[5.5rem] drop-shadow-xl z-20">🌺</div>
          <div className="absolute -top-10 right-0 text-[4rem] drop-shadow-lg z-20">🌸</div>

          {/* Camera Screen (Photo Placeholder) */}
          <div className="w-[50%] h-[85%] bg-[#f8f9fa] border-[8px] border-[#333] rounded-xl ml-2 relative overflow-hidden flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-gray-400 text-xs sm:text-sm font-medium tracking-widest uppercase">Screen Placeholder</span>

            {/* Small stars decorations on screen border */}
            <div className="absolute bottom-2 left-2 text-sm text-pink-300">⭐</div>
            <div className="absolute bottom-2 left-8 text-sm text-pink-300">⭐</div>
          </div>

          {/* Camera Controls / Lens area */}
          <div className="w-[45%] h-full flex flex-col items-center justify-center ml-auto gap-4 sm:gap-6">
            {/* Viewfinder/Flash */}
            <div className="flex gap-2">
              <div className="w-12 sm:w-16 h-8 sm:h-10 bg-[#333] rounded-full border-2 border-[#666] shadow-inner"></div>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/80 rounded-full border border-[#aaa] shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            </div>

            {/* Lens Dial */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#e0e0e0] to-[#999] rounded-full flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.3)] border-2 border-[#ccc]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-[#2c2c2c] rounded-full border-[6px] sm:border-[8px] border-[#1a1a1a] shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] relative">
                {/* Lens reflection */}
                <div className="absolute top-2 left-2 w-4 sm:w-6 h-4 sm:h-6 bg-white/20 rounded-full blur-sm"></div>
                <div className="absolute bottom-4 right-4 w-2 sm:w-3 h-2 sm:h-3 bg-white/10 rounded-full blur-[2px]"></div>
              </div>
            </div>

            {/* Animated Keychain hanging from camera */}
            <motion.div
              className="absolute -bottom-28 sm:-bottom-32 md:-bottom-40 right-12 sm:right-20 md:right-28 origin-top z-30"
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Chain */}
              <div className="w-1 h-16 sm:h-20 bg-transparent mx-auto relative flex flex-col items-center gap-1">
                <div className="w-4 h-4 border-[3px] border-[#aaa] rounded-full"></div>
                <div className="w-4 h-4 border-[3px] border-[#aaa] rounded-full"></div>
                <div className="w-4 h-4 border-[3px] border-[#aaa] rounded-full"></div>
                <div className="w-4 h-4 border-[3px] border-[#aaa] rounded-full"></div>
              </div>
              {/* Charm */}
              <div className="text-5xl sm:text-6xl drop-shadow-lg flex flex-col items-center -mt-2">
                <span>⭐</span>
                <span className="text-4xl sm:text-5xl -mt-4">🧸</span>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

const Page3 = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden py-20">
      <BackgroundPetals />

      <div className="z-10 relative w-full max-w-7xl px-4 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">

        <PolaroidFrame rotation={-12} delay={0.2} y={-50} flowerTop={true} className="z-10 hidden md:block scale-90" />

        <PolaroidFrame rotation={5} delay={0.4} y={20} flowerTop={false} className="z-20 border-4 border-[#f1f5f9]" />

        <PolaroidFrame rotation={18} delay={0.6} y={-30} flowerTop={true} className="z-30 scale-95" />

        {/* Masking Tape Accents */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-[20%] left-[25%] w-24 h-8 bg-pink-200/50 rotate-12 z-40 hidden md:block mix-blend-multiply"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-[40%] right-[25%] w-20 h-8 bg-blue-200/50 -rotate-12 z-40 hidden md:block mix-blend-multiply"
        />
      </div>
    </div>
  )
}

import { DepthSection } from '@/components/DepthSection'

export function MemoryFrames() {
  return (
    <div className="flex flex-col w-full bg-transparent">
      <DepthSection><Page1 /></DepthSection>
      <DepthSection><Page2 /></DepthSection>
      <DepthSection><Page3 /></DepthSection>
    </div>
  )
}

