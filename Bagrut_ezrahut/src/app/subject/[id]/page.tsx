'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { Home } from 'lucide-react'
import Link from 'next/link'
import DesktopOnly from '../../components/ui/DesktopOnly'

const subjectNames: Record<string, string> = {
  history: 'История',
  civics: 'Эзрахут',
  tanakh: 'Танах',
  literature: 'Литература',
}

export default function SubjectPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.id as string
  const subjectName = subjectNames[subjectId] || 'Предмет'

  return (
    <DesktopOnly>
      <AnimatePresence mode="wait">
        <motion.div
          key={subjectId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen bg-canvas p-8"
        >
          {/* Хедер */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 flex items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="p-3 rounded-lg bg-white border-2 border-ink shadow-hand-drawn hover:bg-accent-gold transition-colors"
              aria-label="На главную"
            >
              <Home className="w-6 h-6 text-ink" />
            </motion.button>
            <h1 className="text-4xl font-serif font-bold text-ink">
              {subjectName}
            </h1>
          </motion.div>

          {/* Контентная область */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
              className="grid grid-cols-2 gap-8"
            >
              {/* Карточка "Учебные материалы" */}
              <Link href={`/subject/${subjectId}/learn`}>
                <motion.div
                  initial={{ opacity: 0, x: -20, rotate: -1 }}
                  animate={{ opacity: 1, x: 0, rotate: -1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FFFCF5] border-2 border-ink p-8 rounded-lg cursor-pointer relative overflow-hidden"
                  style={{
                    boxShadow: '4px 4px 0px rgba(107, 102, 68, 0.2)',
                    borderRadius: '8px 10px 9px 8px', // Слегка неидеальный border-radius
                  }}
                >
                {/* Декоративные линии как в тетради */}
                <div className="absolute top-0 left-0 w-full h-1 bg-ink opacity-10" />
                <div className="absolute top-8 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-16 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-24 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-32 left-0 w-full h-px bg-ink opacity-5" />

                <h2 className="text-2xl font-serif font-bold text-ink mb-4 relative z-10">
                  Учебные материалы
                </h2>
                <p className="text-ink opacity-70 relative z-10 text-lg">
                  Изучайте материалы по предмету
                </p>
                </motion.div>
              </Link>

              {/* Карточка "Тренировка" */}
              <Link href={`/subject/${subjectId}/train`}>
                <motion.div
                  initial={{ opacity: 0, x: 20, rotate: 1 }}
                  animate={{ opacity: 1, x: 0, rotate: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FFFCF5] border-2 border-ink p-8 rounded-lg cursor-pointer relative overflow-hidden"
                  style={{
                    boxShadow: '4px 4px 0px rgba(107, 102, 68, 0.2)',
                    borderRadius: '9px 8px 10px 8px', // Слегка неидеальный border-radius
                  }}
                >
                {/* Декоративные линии как в тетради */}
                <div className="absolute top-0 left-0 w-full h-1 bg-ink opacity-10" />
                <div className="absolute top-8 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-16 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-24 left-0 w-full h-px bg-ink opacity-5" />
                <div className="absolute top-32 left-0 w-full h-px bg-ink opacity-5" />

                <h2 className="text-2xl font-serif font-bold text-ink mb-4 relative z-10">
                  Тренировка
                </h2>
                <p className="text-ink opacity-70 relative z-10 text-lg">
                  Практикуйтесь и проверяйте знания
                </p>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </DesktopOnly>
  )
}

