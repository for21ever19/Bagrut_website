'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import DesktopOnly from '../../../components/DesktopOnly'
import CivicsContent from '../../../components/materials/CivicsContent'
import DefaultContent from '../../../components/materials/DefaultContent'

const subjectNames: Record<string, string> = {
  history: 'История',
  civics: 'Эзрахут',
  tanakh: 'Танах',
  literature: 'Литература',
}

const civicsChapters = [
  // I. ЯДРО ЭКЗАМЕНА
  { id: 'core-exam', label: 'I. ЯДРО ЭКЗАМЕНА — максимальная ценность' },
  { id: 'human-rights', label: '1. Права человека и гражданина ⭐⭐⭐⭐⭐' },
  { id: 'democracy-principles', label: '2. Принципы демократии ⭐⭐⭐⭐⭐' },
  { id: 'democratic-political-culture', label: '3. Демократическая политическая культура ⭐⭐⭐⭐⭐' },
  { id: 'jewish-democratic-state', label: '4. Израиль как еврейское и демократическое государство ⭐⭐⭐⭐⭐' },
  { id: 'declaration-independence', label: '5. Декларация независимости ⭐⭐⭐⭐' },
  
  // II. ГОСУДАРСТВО, ЗАКОН И ВЛАСТЬ
  { id: 'state-law-power', label: 'II. ГОСУДАРСТВО, ЗАКОН И ВЛАСТЬ' },
  { id: 'basic-laws', label: '7. Основные законы и отсутствие конституции' },
  { id: 'rule-of-law', label: '8. Верховенство закона ⭐⭐⭐' },
  { id: 'illegal-order', label: '9. Незаконный приказ и обязанность неподчинения ⭐⭐⭐' },
  { id: 'knesset', label: '10. Кнессет ⭐⭐⭐' },
  { id: 'government', label: '11. Правительство ⭐⭐⭐' },
  { id: 'judicial-power', label: '12. Судебная власть ⭐⭐⭐' },
  
  // III. ОБЩЕСТВО, МЕНЬШИНСТВА, ИДЕОЛОГИИ
  { id: 'society-minorities-ideologies', label: 'III. ОБЩЕСТВО, МЕНЬШИНСТВА, ИДЕОЛОГИИ' },
  { id: 'minorities-israel', label: '13. Меньшинства в Израиле ⭐⭐⭐' },
  { id: 'nationality-nationalism', label: '14. Национальность и национализм ⭐⭐⭐' },
  { id: 'socioeconomic-approaches', label: '15. Социально-экономические подходы ⭐⭐⭐' },
  
  // IV. ПРОЦЕССЫ И МЕХАНИЗМЫ
  { id: 'processes-mechanisms', label: 'IV. ПРОЦЕССЫ И МЕХАНИЗМЫ' },
  { id: 'elections', label: '16. Выборы и избирательная система ⭐⭐' },
  { id: 'oversight-control', label: '17. Механизмы надзора и контроля ⭐⭐' },
  { id: 'duties', label: '18. Обязанности человека и гражданина ⭐⭐' },
  
  // V. НИЗКОПРИОРИТЕТНЫЕ ТЕМЫ
  { id: 'low-priority', label: 'V. НИЗКОПРИОРИТЕТНЫЕ / ПЕРИФЕРИЙНЫЕ ТЕМЫ' },
  { id: 'status-quo', label: '19. Статус-кво ⭐' },
  { id: 'citizenship-repatriation', label: '20. Гражданство и репатриация ⭐' },
  { id: 'emergency-defending-democracy', label: '21. Чрезвычайное положение и обороняющаяся демократия ⭐⭐' },
  { id: 'preference-policy', label: '22. Политика предпочтения ⭐' },
]

const defaultChapters = [
  { id: 'chapter-1', label: 'Глава 1: Введение' },
  { id: 'chapter-2', label: 'Глава 2: Основные понятия' },
  { id: 'chapter-3', label: 'Глава 3: Практические примеры' },
  { id: 'chapter-4', label: 'Глава 4: Заключение' },
]

// Функция для определения типа пункта (Римские или Арабские цифры)
function isRomanNumeralSection(label: string): boolean {
  // Проверяем, начинается ли строка с Римской цифры (I., II., III., IV., V., и т.д.)
  return /^[IVX]+\./.test(label.trim())
}

export default function LearnPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.id as string
  const subjectName = subjectNames[subjectId] || 'Предмет'
  const chapters = subjectId === 'civics' ? civicsChapters : defaultChapters
  const [activeChapter, setActiveChapter] = useState<string>('')

  // Отслеживание активного раздела при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150 // Offset для sticky header
      
      for (let i = chapters.length - 1; i >= 0; i--) {
        const element = document.getElementById(chapters[i].id)
        if (element) {
          const elementTop = element.offsetTop
          if (scrollPosition >= elementTop) {
            setActiveChapter(chapters[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Проверяем при загрузке
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [chapters])

  const handleBack = () => {
    router.push(`/subject/${subjectId}`)
  }

  const handleChapterClick = (chapterId: string) => {
    const element = document.getElementById(chapterId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveChapter(chapterId)
    }
  }

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
            className="mb-8 flex items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-3 rounded-lg bg-white border-2 border-ink shadow-hand-drawn hover:bg-accent-gold transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-6 h-6 text-ink" />
            </motion.button>
            <h1 className="text-4xl font-serif font-bold text-ink">
              {subjectName} - Учебные материалы
            </h1>
          </motion.div>

          {/* Основной контейнер с навигацией и контентом */}
          <div className="flex gap-8 max-w-7xl mx-auto">
            {/* Левый Сайдбар (Навигация) */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-1/4 min-w-[250px] sticky top-10 self-start"
            >
              <div className="bg-[#FFFCF5] border-2 border-ink rounded-lg p-6 shadow-hand-drawn">
                <h2 className="text-xl font-serif font-bold text-ink mb-4">
                  Содержание
                </h2>
                <nav className="max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pr-4">
                  {chapters.map((chapter) => {
                    const isRoman = isRomanNumeralSection(chapter.label)
                    const isActive = activeChapter === chapter.id
                    
                    // Определяем классы в зависимости от типа пункта
                    let linkClasses = "block transition-colors cursor-pointer "
                    
                    if (isRoman) {
                      // Римские цифры (I., II., III.) - главные разделы
                      linkClasses += "font-bold text-gray-800 mt-6 mb-2 text-sm "
                      if (isActive) {
                        linkClasses += "text-accent-gold border-l-2 border-accent-gold pl-3"
                      } else {
                        linkClasses += "pl-0"
                      }
                    } else {
                      // Арабские цифры (1., 2., 3.) - подпункты
                      linkClasses += "text-gray-600 font-medium text-sm py-1 "
                      if (isActive) {
                        linkClasses += "text-accent-gold border-l-2 border-accent-gold pl-3"
                      } else {
                        linkClasses += "pl-4"
                      }
                    }
                    
                    // Hover эффект
                    if (!isActive) {
                      linkClasses += "hover:text-accent-gold"
                    }
                    
                    return (
                      <a
                        key={chapter.id}
                        href={`#${chapter.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleChapterClick(chapter.id)
                        }}
                        className={linkClasses}
                      >
                        {chapter.label}
                      </a>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Правая Область (Контент) */}
            <motion.main
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 bg-[#FFFCF5] border-2 border-ink rounded-r-lg shadow-md p-8 min-h-[600px]"
            >
              {subjectId === 'civics' ? <CivicsContent /> : <DefaultContent />}
            </motion.main>
          </div>
        </motion.div>
      </AnimatePresence>
    </DesktopOnly>
  )
}

