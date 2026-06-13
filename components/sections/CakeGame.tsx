'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { FiRotateCcw } from 'react-icons/fi'

interface Decoration {
  id: string
  type: 'sprinkle' | 'candle' | 'frosting' | 'cherry'
  x: number
  y: number
  rotation: number
  lit?: boolean
}

const decorationEmojis = {
  sprinkle: '🎨',
  candle: '🕯️',
  frosting: '🧁',
  cherry: '🍒',
}

export function CakeGame() {
  const { ref, isVisible } = useScrollReveal(0.3)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [decorations, setDecorations] = useState<Decoration[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'sprinkle' | 'candle' | 'frosting' | 'cherry'>('sprinkle')
  const [celebrated, setCelebrated] = useState(false)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingId || celebrated) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newDecoration: Decoration = {
      id: `${Date.now()}-${Math.random()}`,
      type: selectedType,
      x,
      y,
      rotation: Math.random() * 360,
      lit: selectedType === 'candle' ? false : undefined,
    }

    setDecorations([...decorations, newDecoration])
  }

  const handleDragStart = (id: string) => {
    setDraggingId(id)
  }

  const handleDrag = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setDecorations(
      decorations.map((d) =>
        d.id === id
          ? {
              ...d,
              x: Math.max(0, Math.min(x, rect.width)),
              y: Math.max(0, Math.min(y, rect.height)),
            }
          : d
      )
    )
  }

  const handleDragEnd = () => {
    setDraggingId(null)
  }

  const toggleCandle = (id: string) => {
    setDecorations(
      decorations.map((d) =>
        d.id === id && d.type === 'candle'
          ? { ...d, lit: !d.lit }
          : d
      )
    )
  }

  const resetGame = () => {
    setDecorations([])
    setCelebrated(false)
  }

  const celebrate = () => {
    if (decorations.length === 0) return
    setCelebrated(true)
  }

  return (
    <section
      ref={ref}
      className="py-20 px-6 bg-gradient-to-b from-primary/5 to-secondary/5 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Decorate the Birthday Cake
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Click on the cake canvas to add decorations, then celebrate!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg"
        >
          {/* Decoration Type Selector */}
          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            {(Object.keys(decorationEmojis) as Array<keyof typeof decorationEmojis>).map((type) => (
              <motion.button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl mr-2">{decorationEmojis[type]}</span>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Canvas */}
          <motion.div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="relative h-96 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg overflow-hidden cursor-crosshair shadow-inner border-4 border-orange-300 mb-8"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Cake shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl opacity-20">🎂</div>
            </div>

            {/* Decorations */}
            <AnimatePresence>
              {decorations.map((decoration) => (
                <motion.div
                  key={decoration.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    left: decoration.x,
                    top: decoration.y,
                    transform: `translate(-50%, -50%) rotate(${decoration.rotation}deg)`,
                  }}
                  onMouseDown={() => handleDragStart(decoration.id)}
                  onMouseMove={(e) => handleDrag(decoration.id, e)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (decoration.type === 'candle') {
                        toggleCandle(decoration.id)
                      }
                    }}
                    className="text-4xl hover:scale-110 transition-transform"
                    whileHover={{ scale: 1.2 }}
                  >
                    {decoration.type === 'candle' && decoration.lit ? '🔥' : decorationEmojis[decoration.type]}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {decorations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-center opacity-60">
                  Click to add decorations
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              onClick={celebrate}
              disabled={decorations.length === 0}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              whileHover={{ scale: decorations.length > 0 ? 1.05 : 1 }}
              whileTap={{ scale: decorations.length > 0 ? 0.95 : 1 }}
            >
              Celebrate! 🎉
            </motion.button>
            <motion.button
              onClick={resetGame}
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRotateCcw /> Reset
            </motion.button>
          </div>

          {/* Celebration Message */}
          <AnimatePresence>
            {celebrated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg text-center"
              >
                <p className="text-2xl font-bold mb-2">What a beautiful cake! 🎂</p>
                <p className="text-sm opacity-90">Scroll down to see the grand finale...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
