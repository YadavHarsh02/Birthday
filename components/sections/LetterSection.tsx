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
              y: "-70%", // Flies out higher
              height: "180%", // Becomes much taller like a real paper
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
              className="w-full h-full border-2 border-dashed border-pink-100 rounded-sm p-3 md:p-5 flex flex-col items-center overflow-hidden bg-[url('/noise.png')] bg-repeat"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-full h-full flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <h3 className="text-xl md:text-2xl text-pink-500 font-cursive mb-6 mt-4 text-left px-2">Dear Aliya,</h3>
                <div className="text-gray-600 text-xs md:text-sm font-serif leading-relaxed px-2 md:px-4 space-y-4 pb-8 text-left flex-1">
                  <p>I still wonder about you sometimes.</p>
                  <p>Are you doing okay? Have you finally become the woman you always wanted to be? The kind who wakes up without carrying yesterday on her shoulders? The kind who smiles because she’s happy, not because she’s trying to convince herself that she is?</p>
                  <p>I hope so.</p>
                  <p>I know we don’t belong to each other anymore. I know life keeps moving, and people keep growing in directions they never expected. But every now and then, I catch myself thinking about the girl I once knew so well.</p>
                  <p>The girl who could be stubborn and soft at the same time. The girl who carried more in her heart than she ever let anyone see. The girl whose laugh could make a bad day feel a little less heavy.</p>
                  <p>And I wonder if you’re still arguing with yourself sometimes. If your mind still keeps you awake. If you’re still trying to figure everything out while pretending you already have.</p>
                  <p>I hope you’ve been kinder to yourself than you were back then.</p>
                  <p>There are things I wish had happened differently. Things I wish I had said, and things I wish I had understood sooner. But if there’s one thing I never regretted, it was loving you.</p>
                  <p>Even now, after everything, I don’t think of you with anger. I think of you like a season that ended before I was ready for it to. Beautiful, difficult, unforgettable.</p>
                  <p>Maybe that’s what some people become.</p>
                  <p>Not strangers. Not lovers. Just a part of your heart that time never quite manages to erase.</p>
                  <p>I hope you’re sleeping well. I hope you’re smiling more. I hope life is being gentle with you.</p>
                  <p>And if it isn’t, I hope you’ve learned how strong you’ve always been.</p>
                  <p className="pt-4 font-semibold">I still wish the best for you takli.</p>
                  <p className="font-semibold">I always will.</p>
                  <div className="text-center pt-6 text-4xl">❤️</div>
                </div>
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
