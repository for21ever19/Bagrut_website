'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white border-2 border-ink px-6 py-4 rounded-lg shadow-hand-drawn">
            <p className="text-ink font-sans font-semibold">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}





