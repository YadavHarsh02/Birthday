'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import Image from 'next/image'

export function HeroSection() {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)

    // Stop confetti after 7 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 7000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          colors={['#ffb6c1', '#ffc0cb', '#ff69b4', '#fff0f5', '#ffd700']}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />
      )}

      {/* Quilted Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(45deg, transparent 49%, #ffb6c1 49%, #ffb6c1 51%, transparent 51%), 
                            linear-gradient(-45deg, transparent 49%, #ffb6c1 49%, #ffb6c1 51%, transparent 51%)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating Petals/Hearts in background (Continuous) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute text-pink-300 text-2xl"
            initial={{
              top: '-10%',
              left: `${Math.random() * 100}%`,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              top: '110%',
              rotate: 360,
              x: Math.sin(i) * 100
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            🌸
          </motion.div>
        ))}
      </motion.div>

      {/* Container for Card and Pop-outs */}
      <div className="relative z-10">

        {/* Pop-out Toys & Dolls */}
        <motion.div
          className="absolute -top-16 -left-12 text-6xl drop-shadow-lg"
          initial={{ scale: 0, x: 50, y: 50, rotate: -30 }}
          animate={{ scale: 1, x: 0, y: 0, rotate: -15 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.5 }}
        >
          🧸
        </motion.div>

        <motion.div
          className="absolute -top-12 -right-10 text-6xl drop-shadow-lg"
          initial={{ scale: 0, x: -50, y: 50, rotate: 30 }}
          animate={{ scale: 1, x: 0, y: 0, rotate: 15 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.7 }}
        >
          🪆
        </motion.div>

        <motion.div
          className="absolute top-1/3 -left-16 text-5xl drop-shadow-lg"
          initial={{ scale: 0, x: 50 }}
          animate={{ scale: 1, x: 0, rotate: -25 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.9 }}
        >
          🎀
        </motion.div>

        <motion.div
          className="absolute top-1/3 -right-16 text-5xl drop-shadow-lg"
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0, rotate: 25 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 1.1 }}
        >
          🎁
        </motion.div>

        <motion.div
          className="absolute -bottom-10 -left-6 text-6xl drop-shadow-lg"
          initial={{ scale: 0, x: 30, y: -30 }}
          animate={{ scale: 1, x: 0, y: 0, rotate: -10 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 1.3 }}
        >
          🐰
        </motion.div>

        <motion.div
          className="absolute -bottom-10 -right-6 text-6xl drop-shadow-lg"
          initial={{ scale: 0, x: -30, y: -30 }}
          animate={{ scale: 1, x: 0, y: 0, rotate: 10 }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 1.5 }}
        >
          🐈
        </motion.div>

        {/* Central Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            duration: 1
          }}
          className="relative bg-[#fefdfc] w-[90vw] max-w-[600px] p-8 md:p-12 rounded-3xl shadow-[0_0_40px_rgba(255,182,193,0.4)] border-2 border-pink-100 flex flex-col items-center text-center"
        >
          {/* Glowing Aura behind the bear */}
          <div className="absolute top-12 w-48 h-48 bg-pink-300/30 rounded-full blur-2xl z-0 pointer-events-none"></div>

          {/* Cute Bear Image */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative z-10 w-40 h-40 md:w-48 md:h-48 mb-6"
          >
            <div className="w-full h-full relative rounded-full overflow-hidden border-4 border-pink-50 bg-white shadow-inner">
              <Image
                src="/cute-bear.png"
                alt="Cute Bear"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating hearts near bear */}
            <motion.div
              className="absolute -bottom-2 -right-4 text-3xl"
              animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💖
            </motion.div>
            <motion.div
              className="absolute top-4 -left-6 text-2xl"
              animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            >
              💕
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-[#333] mb-2 font-sans tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Happy Birthday,
          </motion.h1>

          <motion.h2
            className="text-5xl md:text-6xl font-cursive text-pink-400 mb-6 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Beautiful ❤️🎉
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-2 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Moon with no scars.. haina?
          </motion.p>
          <motion.p
            className="text-md md:text-lg text-pink-300 mb-10 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            I made this for my Cotton Candy🌸
          </motion.p>

          <motion.button
            className="bg-[#eb5b77] hover:bg-[#d44863] text-white px-8 py-3 rounded-full font-bold text-lg shadow-[0_4px_15px_rgba(235,91,119,0.4)] transition-all flex items-center gap-2 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 2, duration: 0.6 }}
            onClick={() => {
              // Smooth scroll to milestone section
              document.getElementById('milestone')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Tap here to see!!!
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </motion.button>

        </motion.div>
      </div>
    </section>
  )
}
