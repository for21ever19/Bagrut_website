'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import DesktopOnly from './components/ui/DesktopOnly'
import HandDrawnFolder from './components/features/backpack/HandDrawnFolder'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface Subject {
  id: string
  label: string
  color: string
  position: Position
  delay: number
  imageSrc: string
}

const subjects: Subject[] = [
  {
    id: 'history',
    label: 'История',
    color: '#E6B89C',
    position: 'top-left', // Слева-Сверху
    delay: 0.2,
    imageSrc: '/Bagrut_website/images/folders/folder-history.png',
  },
  {
    id: 'civics',
    label: 'Эзрахут',
    color: '#9FB8AD',
    position: 'bottom-left', // Слева-Снизу
    delay: 0.4,
    imageSrc: '/Bagrut_website/images/folders/folder-civics.png',
  },
  {
    id: 'tanakh',
    label: 'Танах',
    color: '#D4C5A8',
    position: 'top-right', // Справа-Сверху
    delay: 0.3,
    imageSrc: '/Bagrut_website/images/folders/folder-tanakh.png',
  },
  {
    id: 'literature',
    label: 'Литература',
    color: '#C7B2BE',
    position: 'bottom-right', // Справа-Снизу
    delay: 0.5,
    imageSrc: '/Bagrut_website/images/folders/folder-lit.png',
  },
]

export default function Home() {
  return (
    <DesktopOnly>
      <div className="h-screen w-screen bg-canvas overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full flex items-center justify-center relative"
        >
          {/* Центральный контейнер с фиксированными размерами */}
          <div className="relative w-[900px] h-[700px] flex items-center justify-center">
            {/* Центральное изображение рюкзака */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
              className="relative z-0 pointer-events-none"
            >
              <Image
                src="/Bagrut_website/images/backpack.png"
                alt="Рюкзак"
                width={625}
                height={625}
                className="object-contain mix-blend-multiply"
                priority
              />
            </motion.div>

            {/* Папки предметов - позиционируются абсолютно относительно контейнера */}
            {subjects.map((subject) => (
              <HandDrawnFolder
                key={subject.id}
                color={subject.color}
                label={subject.label}
                subjectId={subject.id}
                position={subject.position}
                delay={subject.delay}
                imageSrc={subject.imageSrc}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </DesktopOnly>
  )
}

