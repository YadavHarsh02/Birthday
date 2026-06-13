'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

function AnimatedNumber({ value, duration = 2 }: { value: number, duration?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: duration, ease: "easeOut" })
      return controls.stop
    }
  }, [isInView, count, value, duration])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

export function MilestoneSection() {
  return (
    <section id="milestone" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">

      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: 'url(/cute-bear.png)',
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="relative z-10 bg-[#fefdfc] w-[92vw] max-w-[650px] p-10 md:p-16 rounded-[40px] shadow-[0_0_60px_rgba(255,182,193,0.35)] border border-pink-50 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.4, bounce: 0.6 }}
          className="bg-[#fdbf11] text-white text-xs md:text-sm font-extrabold tracking-widest uppercase px-6 py-2 rounded-full mb-10 shadow-sm"
        >
          ✨ Pawryyyyy!!! ✨
        </motion.div>

        <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">You turned</h3>

        <div className="text-8xl md:text-[11rem] font-black text-[#f04f32] leading-none mb-4 tracking-tighter drop-shadow-sm">
          <AnimatedNumber value={21} duration={2.5} />
        </div>

        <h3 className="text-xl md:text-2xl text-gray-800 font-semibold mb-12 flex items-center justify-center gap-2">
          today <span className="text-3xl">🍰</span>
        </h3>

        {/* Divider */}
        <div className="w-[80%] h-px bg-gray-200 mb-12 relative flex justify-center items-center">
          <div className="bg-[#fefdfc] px-4 text-pink-200 text-xl">
            🌸
          </div>
        </div>

        <p className="text-md md:text-lg text-gray-500 mb-4 font-semibold tracking-wide">
          You've been doin badmoshi for..
        </p>

        <div className="flex items-baseline justify-center gap-3">
          <span className="text-5xl md:text-7xl font-extrabold text-[#b82343]">
            <AnimatedNumber value={7670} duration={3.5} />
          </span>
          <span className="text-xl md:text-2xl text-gray-500 font-semibold">days</span>
        </div>
      </motion.div>

      {/* Floating Toys */}
      <motion.div
        className="absolute top-[15%] left-[5%] md:left-[15%] text-7xl drop-shadow-xl"
        initial={{ y: 0, rotate: -10 }}
        animate={{ y: [0, -30, 0], rotate: [-10, 5, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🦄
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] right-[5%] md:right-[15%] text-7xl drop-shadow-xl"
        initial={{ y: 0, rotate: 15 }}
        animate={{ y: [0, 25, 0], rotate: [15, -5, 15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🧸
      </motion.div>
      <motion.div
        className="absolute top-[25%] right-[8%] md:right-[20%] text-6xl drop-shadow-xl"
        initial={{ y: 0, rotate: 20 }}
        animate={{ y: [0, -20, 0], rotate: [20, 0, 20] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        🪆
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] left-[8%] md:left-[20%] text-6xl drop-shadow-xl"
        initial={{ y: 0, rotate: -20 }}
        animate={{ y: [0, 20, 0], rotate: [-20, 0, -20] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        🎀
      </motion.div>
    </section>
  )
}
