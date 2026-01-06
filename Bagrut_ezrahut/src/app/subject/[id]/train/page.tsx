'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { X, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import DesktopOnly from '../../../components/ui/DesktopOnly'
import { allQuestions, Question } from '../../../../data/subjects/ezrahut'

// Fisher-Yates Shuffle алгоритм для качественного перемешивания массива
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Функция для выборки случайных вопросов
function getRandomQuestions(allQuestions: Question[], count: number): Question[] {
  if (allQuestions.length <= count) {
    return shuffleArray(allQuestions)
  }
  const shuffled = shuffleArray(allQuestions)
  return shuffled.slice(0, count)
}

const subjectNames: Record<string, string> = {
  history: 'История',
  civics: 'Эзрахут',
  tanakh: 'Танах',
  literature: 'Литература',
}

export default function TrainPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.id as string
  const subjectName = subjectNames[subjectId] || 'Предмет'

  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Генерация случайных вопросов только на клиенте (предотвращение hydration mismatch)
  useEffect(() => {
    const randomQuestions = getRandomQuestions(allQuestions, 10)
    setQuestions(randomQuestions)
    setIsLoading(false)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return // Предотвращаем повторный выбор

    setSelectedAnswer(answer)
    setShowExplanation(true)

    if (answer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsFinished(true)
    }
  }

  const handleBack = () => {
    router.push(`/subject/${subjectId}`)
  }

  const handleRestart = () => {
    // Генерируем новые случайные вопросы при перезапуске
    const randomQuestions = getRandomQuestions(allQuestions, 10)
    setQuestions(randomQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setCorrectAnswers(0)
    setIsFinished(false)
    setShowExplanation(false)
  }

  if (isFinished) {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    return (
      <DesktopOnly>
        <div className="min-h-screen bg-canvas p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6"
              >
                {percentage >= 70 ? (
                  <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-24 h-24 text-orange-500 mx-auto" />
                )}
              </motion.div>

              <h1 className="text-4xl font-serif font-bold text-ink mb-4">
                Тест завершен!
              </h1>
              <p className="text-2xl text-ink mb-2">
                Правильных ответов: {correctAnswers} из {totalQuestions}
              </p>
              <p className="text-xl text-ink opacity-70 mb-8">
                Результат: {percentage}%
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className="px-6 py-3 bg-accent-gold text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Пройти снова
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-6 py-3 bg-ink text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Назад к предмету
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </DesktopOnly>
    )
  }

  // Состояние загрузки
  if (isLoading || questions.length === 0) {
    return (
      <DesktopOnly>
        <div className="min-h-screen bg-canvas p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 text-center"
          >
            <Loader2 className="w-12 h-12 text-accent-gold animate-spin mx-auto mb-4" />
            <p className="text-ink font-semibold">Загрузка вопросов...</p>
          </motion.div>
        </div>
      </DesktopOnly>
    )
  }

  return (
    <DesktopOnly>
      <div className="min-h-screen bg-canvas p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8"
        >
          {/* Хедер */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Назад"
            >
              <X className="w-6 h-6 text-ink" />
            </motion.button>
            <div className="flex-1 mx-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-ink">
                  Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                </span>
                <span className="text-sm text-ink opacity-70">
                  {subjectName}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-accent-gold h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Вопрос */}
          <h2 className="text-xl font-serif font-bold text-ink mb-6">
            {currentQuestion.question}
          </h2>

          {/* Варианты ответов */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrect = option === currentQuestion.correctAnswer
              const isWrong = isSelected && !isCorrect

              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all cursor-pointer "
              
              if (!selectedAnswer) {
                buttonClass += "bg-white border-ink hover:bg-gray-50 hover:border-accent-gold"
              } else if (isCorrect) {
                buttonClass += "bg-green-100 border-green-500"
              } else if (isWrong) {
                buttonClass += "bg-red-100 border-red-500"
              } else {
                buttonClass += "bg-gray-50 border-gray-300 opacity-60"
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!!selectedAnswer}
                  className={buttonClass}
                  whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                  whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                >
                  <span className="font-sans text-ink">{option}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Пояснение */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
              >
                <p className="text-sm font-semibold text-ink mb-2">Пояснение:</p>
                <p className="text-ink opacity-80">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка "Далее" */}
          <AnimatePresence>
            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-6 py-3 bg-accent-gold text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'Далее' : 'Завершить тест'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DesktopOnly>
  )
}

