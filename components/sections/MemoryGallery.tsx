'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const memories = [
  {
    id: 1,
    title: 'First Memories',
    description: 'Remember when we first met? Time flies when we&apos;re together.',
    emoji: '📸',
  },
  {
    id: 2,
    title: 'Amazing Adventures',
    description: 'Every moment with you is an adventure I cherish forever.',
    emoji: '🌍',
  },
  {
    id: 3,
    title: 'Laughs & Joy',
    description: 'Your laughter is contagious and fills our days with warmth.',
    emoji: '😂',
  },
  {
    id: 4,
    title: 'Growing Together',
    description: 'Watching you grow and achieve your dreams inspires me every day.',
    emoji: '🌱',
  },
  {
    id: 5,
    title: 'Special Moments',
    description: 'From big celebrations to quiet moments, they all matter.',
    emoji: '✨',
  },
  {
    id: 6,
    title: 'Forever Grateful',
    description: 'For having you in my life, today and always.',
    emoji: '❤️',
  },
]

export function MemoryGallery() {
  const { ref, isVisible } = useScrollReveal(0.2)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      ref={ref}
      className="py-20 px-6 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Favorite Memories
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Celebrating all the beautiful moments that make you special
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              variants={itemVariants}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/20 hover:border-primary/30 transition-all group"
              whileHover={{ y: -8, shadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {memory.emoji}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{memory.title}</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">{memory.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-10 right-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10"></div>
    </section>
  )
}
