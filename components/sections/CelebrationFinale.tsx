'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Sparkles } from '@/components/Sparkles'

export function CelebrationFinale() {
  const { ref, isVisible } = useScrollReveal(0.3)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Handle resize
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const celebrationMessages = [
    { emoji: '🎉', text: 'Happy Birthday!' },
    { emoji: '🎂', text: 'Make a Wish!' },
    { emoji: '🎈', text: 'Celebrate Life!' },
    { emoji: '✨', text: 'You&apos;re Awesome!' },
    { emoji: '💖', text: 'Spread Joy!' },
    { emoji: '🌟', text: 'Shine Bright!' },
  ]

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden"
    >
      {/* Confetti */}
      {isVisible && <Confetti width={windowDimensions.width} height={windowDimensions.height} />}

      {/* Sparkles Effect */}
      {isVisible && <Sparkles />}

      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            🎊 You&apos;re Amazing! 🎊
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 text-white/90 text-pretty"
        >
          Thank you for being the wonderful person that you are. May your year ahead be filled with incredible moments, 
          endless laughter, and all the happiness you deserve.
        </motion.p>

        {/* Celebration Messages Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {celebrationMessages.map((msg, index) => (
            <motion.div
              key={index}
              className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{
                delay: 0.8 + index * 0.1,
                duration: 0.6,
                type: 'spring',
              }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <div className="text-4xl mb-2">{msg.emoji}</div>
              <p className="font-semibold text-white">{msg.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-4">Here&apos;s to You</h3>
          <p className="text-lg text-white/80 leading-relaxed mb-6">
            Today celebrates the person you are and all that you bring to the world. Your kindness, strength, and 
            uniqueness make a difference. As you celebrate another year of life, know that you are loved, appreciated, 
            and truly special.
          </p>
          <p className="text-xl font-semibold text-primary-foreground">
            Cheers to a fantastic year ahead! 🥂
          </p>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                width: Math.random() * 200 + 100,
                height: Math.random() * 200 + 100,
                left: Math.random() * 100,
                top: Math.random() * 100,
                background: i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
