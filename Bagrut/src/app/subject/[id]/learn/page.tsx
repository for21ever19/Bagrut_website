'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import DesktopOnly from '../../../components/ui/DesktopOnly'
import CivicsContent from '../../../components/features/subjects/materials/CivicsContent'
import LiteratureContent from '../../../components/features/subjects/materials/LiteratureContent'
import DefaultContent from '../../../components/features/subjects/materials/DefaultContent'

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

const literatureChapters = [
  // Поэзия еврейского Средневековья
  { id: 'medieval-poetry', label: 'Поэзия еврейского Средневековья' },
  { id: 'medieval-intro', label: 'Поэзия еврейского Средневековья (Введение)' },
  { id: 'sleeping-childhood', label: '«Спящая в объятиях детства»' },
  { id: 'heart-east', label: '«Сердце моё на Востоке»' },
  { id: 'look-sun', label: '«Посмотри на солнце»' },
  { id: 'humble-spirit', label: '«Шфаль руах» — «Смирен духом»' },
  
  // Деяния мудрецов
  { id: 'maase-hachamim', label: 'Деяния мудрецов' },
  { id: 'rabbi-yanai-merchant', label: '«Рабби Янай и торговец»' },
  { id: 'mar-ukva-wife', label: '«Мар Уква и его жена»' },
  
  // Новая поэзия
  { id: 'new-poetry', label: 'Новая поэзия' },
  { id: 'look-earth', label: '«Смотри, земля»' },
  { id: 'pine', label: '«Сосна»' },
  { id: 'meeting-half-meeting', label: '«Пéгиша, хáци пéгиша»' },
  { id: 'sad-melody', label: '«Зéмер нóга»' },
  { id: 'melody-returns', label: '«Ещё возвращается напев»' },
  { id: 'swimmers', label: '«Пловцы»' },
  { id: 'black-gold-forehead', label: '«Твой лоб увенчан чёрным золотом»' },
  
  // Бялик
  { id: 'bialik', label: 'Бялик' },
  { id: 'light-not-free', label: '«Я не получил свет даром»' },
  { id: 'sat-window', label: '«Она сидела у окна»' },
  { id: 'alone', label: '«Левáди»' },
  { id: 'bring-under-wing', label: '«Введи меня под крыло твоё»' },
  
  // Тоска
  { id: 'toska', label: 'Тоска' },
  { id: 'toska-chekhov', label: '«Тоска»' },
  
  // Госпожа и торговец
  { id: 'mistress-merchant', label: 'Госпожа и торговец' },
  { id: 'mistress-merchant-agnon', label: '«Госпожа и торговец»' },
  
  // Слепая
  { id: 'blind', label: 'Слепая' },
  { id: 'blind-steinberg', label: '«Слепая»' },
  
  // Хизо Батата
  { id: 'hizo-batata', label: 'Хизо Батата' },
  { id: 'hizo-batata-bardogo', label: '«Хизо Батата»' },
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

// Функция для определения главных разделов литературы
function isLiteratureMainSection(label: string): boolean {
  // Главные разделы - это названия разделов без кавычек и без "(Введение)"
  // Примеры главных: "Поэзия еврейского Средневековья", "Деяния мудрецов", "Бялик"
  // Примеры подразделов: "«Спящая в объятиях детства»", "Поэзия еврейского Средневековья (Введение)"
  const mainSections = [
    'Поэзия еврейского Средневековья',
    'Деяния мудрецов',
    'Новая поэзия',
    'Бялик',
    'Тоска',
    'Госпожа и торговец',
    'Слепая',
    'Хизо Батата'
  ]
  return mainSections.includes(label)
}

export default function LearnPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.id as string
  const subjectName = subjectNames[subjectId] || 'Предмет'
  const chapters = subjectId === 'civics' 
    ? civicsChapters 
    : subjectId === 'literature' 
    ? literatureChapters 
    : defaultChapters
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
                    const isLiteratureMain = subjectId === 'literature' && isLiteratureMainSection(chapter.label)
                    const isActive = activeChapter === chapter.id
                    
                    // Определяем классы в зависимости от типа пункта
                    let linkClasses = "block transition-colors cursor-pointer "
                    
                    if (isRoman || isLiteratureMain) {
                      // Римские цифры (I., II., III.) или главные разделы литературы - главные разделы
                      linkClasses += "font-bold text-gray-800 mt-6 mb-2 text-sm "
                      if (isActive) {
                        linkClasses += "text-accent-gold border-l-2 border-accent-gold pl-3"
                      } else {
                        linkClasses += "pl-0"
                      }
                    } else {
                      // Арабские цифры (1., 2., 3.) или подпункты литературы - подпункты
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
              {subjectId === 'civics' ? (
                <CivicsContent />
              ) : subjectId === 'literature' ? (
                <LiteratureContent />
              ) : (
                <DefaultContent />
              )}
            </motion.main>
          </div>
        </motion.div>
      </AnimatePresence>
    </DesktopOnly>
  )
}

