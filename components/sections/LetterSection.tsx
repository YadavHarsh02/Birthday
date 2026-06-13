"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'

// A simple floating 3D glowing orb/heart representation to add depth
const FloatingOrbs = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-3, 1, -2]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#ffb6c1" emissive="#ff6b8b" emissiveIntensity={0.5} roughness={0.2} metalness={0.1} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <mesh position={[3, -2, -1]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#e6e6fa" emissive="#d8bfd8" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[0, 3, -3]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#ffdab9" emissive="#ffcba4" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </>
  )
}

export function LetterSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    // Fixed clipping issue: changed overflow-hidden to overflow-visible overflow-x-hidden
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-transparent overflow-visible overflow-x-hidden py-20 z-10">

      {/* Premium 3D Background using Three.js */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffb6c1" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#e6e6fa" />

          <FloatingOrbs />

          {/* Magical glowing dust particles */}
          <Sparkles count={150} scale={12} size={6} speed={0.4} opacity={0.6} color="#ffb6c1" />
          <Sparkles count={50} scale={10} size={10} speed={0.2} opacity={0.4} color="#ffffff" />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="z-10 text-center mb-24 md:mb-32 mt-10"
      >
        <h2 className="text-3xl md:text-5xl font-cursive text-pink-400 drop-shadow-sm font-bold tracking-wide relative z-20">
          As always, a letter for you...
        </h2>
      </motion.div>

      {/* Envelope Container */}
      <div className="relative z-20 w-[320px] h-[220px] sm:w-[400px] sm:h-[260px] md:w-[500px] md:h-[320px] perspective-[1500px]">

        {/* Envelope Wrapper */}
        <motion.div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} // Fixed toggle logic
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={isOpen ? { scale: 0.95, y: 80 } : (isHovered ? { scale: 1.02 } : { scale: 1, y: 0 })}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Envelope Back */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb6c1] to-[#ff9aa2] rounded-xl shadow-[0_20px_40px_rgba(255,182,193,0.5)]"></div>

          {/* The Letter inside */}
          <motion.div
            className="absolute left-[5%] right-[5%] bottom-2 bg-[#fefdfc] rounded-md shadow-inner flex items-center justify-center border border-pink-50 p-6 md:p-8"
            initial={{ height: "90%", y: 0, zIndex: 10, scale: 1 }}
            animate={isOpen ? {
              y: "-45%", // Peeks out gracefully instead of flying away
              height: "100%", // Stays a reasonable size
              zIndex: 40,
              scale: 1.05, // Slight pop out effect
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
            } : {
              y: 0,
              height: "90%",
              zIndex: 10,
              scale: 1,
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)"
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: isOpen ? 0.4 : 0 }}
            style={{ transformOrigin: "bottom center" }}
          >
            {/* Letter Content */}
            <motion.div
              className="w-full h-full border-2 border-dashed border-pink-100 rounded-sm p-4 flex flex-col items-center justify-center text-center overflow-hidden bg-[url('/noise.png')] bg-repeat"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-full h-full flex flex-col"
              >
                <h3 className="text-xl md:text-2xl text-pink-500 font-cursive mb-2 mt-2">My Dearest...</h3>
                <p className="text-gray-500 text-xs md:text-sm italic flex-1 flex items-center justify-center font-cursive leading-relaxed px-2">
                  [ Your heartfelt letter goes here. ]
                </p>
                <span className="text-4xl mt-4">❤️</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Side Flaps */}
          <div
            className="absolute inset-0 bg-[#ffb6c1] z-20 pointer-events-none drop-shadow-sm"
            style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
          ></div>
          <div
            className="absolute inset-0 bg-[#ffb6c1] z-20 pointer-events-none drop-shadow-sm"
            style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
          ></div>

          {/* Bottom Flap */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#ff9aa2] to-[#ffb6c1] z-30 pointer-events-none drop-shadow-md rounded-b-xl"
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 45%)' }}
          ></div>

          {/* Top Flap (Animated 3D) */}
          <motion.div
            className="absolute inset-0 z-50 origin-top transform-style-3d pointer-events-none"
            initial={{ rotateX: 0 }}
            animate={isOpen ? { rotateX: -180, zIndex: 5 } : { rotateX: 0, zIndex: 50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Front of Top Flap */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#ff8da1] to-[#ffb6c1] backface-hidden drop-shadow-lg rounded-t-xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                backgroundImage: 'radial-gradient(#ff6b8b 1.5px, transparent 1.5px)',
                backgroundSize: '10px 10px' // Dotted pattern
              }}
            >
              {/* Heart Seal (Only visible when closed) */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-[45%] translate-y-1/2 text-3xl md:text-4xl drop-shadow-md z-50 flex items-center justify-center"
                animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-pink-100">
                  <span className="text-xl md:text-2xl mt-[2px]">💌</span>
                </div>
              </motion.div>
            </div>

            {/* Back of Top Flap (Inside envelope, visible when open) */}
            <div
              className="absolute inset-0 bg-[#ff9aa2] rounded-t-xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                transform: 'rotateX(180deg)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            ></div>
          </motion.div>

        </motion.div>

      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="mt-16 text-gray-500 font-medium tracking-wide z-20 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
      >
        Tap on the envelope to open your letter ❤️
      </motion.p>

    </section>
  )
}
