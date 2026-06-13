'use client'

import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="flex items-center justify-center gap-2 text-lg font-semibold mb-2">
            Made with <FiHeart className="text-secondary" size={20} /> for a special day
          </p>
          <p className="text-background/70 mb-4">
            This birthday microsite was created to celebrate you and all the joy you bring to the world.
          </p>
          <p className="text-sm text-background/60">
            © 2024 A Birthday Celebration. All moments are priceless.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
