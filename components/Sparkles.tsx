'use client'

import { useEffect, useRef } from 'react'

export function Sparkles({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle system
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
    }

    const particles: Particle[] = []

    const createSparkle = (x: number, y: number) => {
      const count = Math.random() * 20 + 10
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * Math.PI * 2)
        const velocity = Math.random() * 3 + 1
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          maxLife: 1,
          size: Math.random() * 2 + 1,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.life -= 1 / 60

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Draw particle
        ctx.fillStyle = `rgba(255, 215, 0, ${p.life * 0.8})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Periodically create sparkles
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height * 0.5
        createSparkle(x, y)
      }
    }, 500)

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none ${className}`} />
}
