'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface HandDrawnFolderProps {
  color: string
  label: string
  subjectId: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  delay?: number
  imageSrc: string
}

export default function HandDrawnFolder({
  color,
  label,
  subjectId,
  position,
  delay = 0,
  imageSrc,
}: HandDrawnFolderProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/subject/${subjectId}`)
  }

  // Определяем позиционирование на основе строки позиции
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-10 left-0'
      case 'top-right':
        return 'top-10 right-0'
      case 'bottom-left':
        return 'bottom-10 left-0'
      case 'bottom-right':
        return 'bottom-10 right-0'
      default:
        return 'top-10 left-0'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`absolute ${getPositionClasses()} z-20 cursor-pointer`}
      whileHover={{
        scale: 1.05,
        rotate: [0, -2, 2, -1, 0],
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 10,
        },
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={handleClick}
    >
      <div className="relative">
        {/* PNG изображение папки - тень уже нарисована художником */}
        <Image
          src={imageSrc}
          alt={label}
          width={180}
          height={180}
          className="object-contain"
        />
        
        {/* Текст метки */}
        <div
          className="absolute bottom-[-35px] left-1/2 transform -translate-x-1/2 whitespace-nowrap font-sans text-[15px] font-semibold text-ink"
          style={{
            textShadow: '1px 1px 0px #F9E4D4',
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  )
}

