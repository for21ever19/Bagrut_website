'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { X, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import DesktopOnly from '../../../components/ui/DesktopOnly'
import { allQuestions as ezrahutQuestions, Question } from '../../../../data/subjects/ezrahut'
import { allQuestions as literatureQuestions } from '../../../../data/subjects/literature'
import { useProgress } from '../../../hooks/useProgress'

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

// Компонент для отображения состояния загрузки в Suspense fallback
function LoadingFallback() {
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

function TrainPageContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const subjectId = params.id as string
  const subjectName = subjectNames[subjectId] || 'Предмет'
  
  // Получаем mode из searchParams, но также проверяем URL напрямую для надежности
  const modeFromParams = searchParams.get('mode')
  const modeFromUrl = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('mode')
    : null
  const mode = modeFromParams || modeFromUrl // 'mistakes' или null

  // Хук для управления прогрессом
  const { saveResult, getSubjectProgress, resolveMistake, progress: userProgress } = useProgress()
  
  // Динамический выбор источника вопросов на основе subjectId
  const allQuestions = subjectId === 'literature' ? literatureQuestions : ezrahutQuestions

  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionsLoaded, setQuestionsLoaded] = useState(false) // Флаг для предотвращения перезагрузки во время тренировки
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [wrongQuestionIds, setWrongQuestionIds] = useState<number[]>([]) // ID вопросов с неправильными ответами в текущей сессии
  const [initialQuestionsCount, setInitialQuestionsCount] = useState<number>(0) // Исходное количество вопросов для отслеживания

  // Сброс флага загрузки при изменении режима или subjectId
  useEffect(() => {
    setQuestionsLoaded(false)
  }, [mode, subjectId])

  // Загрузка вопросов в зависимости от режима
  useEffect(() => {
    console.log('[DEBUG useEffect questions] Срабатывание:', { 
      mode, 
      subjectId, 
      userProgressKeys: Object.keys(userProgress), 
      questionsLoaded,
      questionsLength: questions.length,
      isFinished,
      currentQuestionIndex,
      correctAnswers
    })
    
    // КРИТИЧНО: Если вопросы уже загружены и тренировка началась, не перезагружаем их
    // Это предотвращает изменение вопросов во время ответа пользователя
    // Дополнительная проверка: если тест в процессе (есть текущий вопрос), не перезагружаем
    if (questionsLoaded && questions.length > 0 && !isFinished && currentQuestionIndex < questions.length) {
      console.log('[DEBUG useEffect questions] Questions already loaded and training in progress, skipping reload', {
        questionsLength: questions.length,
        currentQuestionIndex,
        isFinished
      })
      return
    }
    
    // КРИТИЧНО: Не загружаем вопросы, пока не определили режим точно
    // Если mode === null, но в URL есть ?mode=mistakes, ждем следующего рендера
    if (mode === null && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const urlMode = urlParams.get('mode')
      if (urlMode === 'mistakes') {
        // URL содержит mode=mistakes, но searchParams еще не готов - ждем
        console.log('[DEBUG] Mode is null but URL has mistakes, waiting...')
        return
      }
    }
    
    // Если режим ошибок, загружаем только вопросы из списка ошибок
    if (mode === 'mistakes') {
      console.log('[DEBUG] Mistakes mode detected')
      // Режим "Работа над ошибками"
      const subjectProgress = userProgress[subjectId]
      const storedWrongQuestionIds = subjectProgress?.wrongQuestionIds || []
      
      console.log('[DEBUG] Subject progress:', { 
        hasProgress: !!subjectProgress, 
        wrongQuestionIdsCount: storedWrongQuestionIds.length,
        wrongQuestionIds: storedWrongQuestionIds 
      })
      
      // Улучшенная проверка: ждем, пока прогресс загрузится из localStorage
      // Проверяем не только пустоту объекта, но и наличие данных для конкретного предмета
      // Если объект пустой ИЛИ предмета нет в прогрессе (но прогресс уже загружен), обрабатываем
      const isProgressLoaded = Object.keys(userProgress).length > 0 || 
                                (typeof window !== 'undefined' && localStorage.getItem('bagrut_user_progress') !== null)
      
      console.log('[DEBUG] Progress loaded:', isProgressLoaded)
      
      // Если прогресс еще не загружен, ждем
      if (!isProgressLoaded) {
        console.log('[DEBUG] Progress not loaded yet, waiting...')
        return // Ждем загрузки прогресса
      }
      
      // Теперь проверяем наличие ошибок для этого предмета
      if (storedWrongQuestionIds.length === 0) {
        // Нет ошибок - но НЕ очищаем вопросы, если тест в процессе ИЛИ только что завершился
        // Если тест уже завершен, не трогаем вопросы - они нужны для расчета процента
        console.log('[DEBUG useEffect questions] No mistakes found, checking if test is in progress', {
          isFinished,
          currentQuestionIndex,
          questionsLength: questions.length,
          questionsLoaded,
          initialQuestionsCount
        })
        
        // КРИТИЧНО: Если тест завершен, НЕ очищаем вопросы - они нужны для экрана завершения
        if (isFinished) {
          console.log('[DEBUG useEffect questions] Test finished, keeping questions for result screen')
          return
        }
        
        // Если тест в процессе (есть текущий вопрос), не трогаем вопросы
        if (questionsLoaded && questions.length > 0 && currentQuestionIndex < questions.length) {
          console.log('[DEBUG useEffect questions] Test in progress, not clearing questions')
          return
        }
        
        // Иначе - показываем пустое состояние (тест еще не начат)
        console.log('[DEBUG useEffect questions] No mistakes found, showing empty state')
        setQuestions([])
        setIsLoading(false)
        return
      }

      // Приводим все ID к числу для надежного сравнения (на случай если из localStorage пришли строки)
      // Фильтруем невалидные ID (NaN, null, undefined)
      const wrongIdsAsNumbers = storedWrongQuestionIds
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0)
      
      console.log('[DEBUG] Filtering questions:', {
        wrongIdsAsNumbers,
        wrongIdsAsNumbersFirst10: wrongIdsAsNumbers.slice(0, 10),
        allQuestionsCount: allQuestions.length,
        expectedMistakesCount: wrongIdsAsNumbers.length,
        allQuestionsFirst10Ids: allQuestions.slice(0, 10).map(q => q.id)
      })
      
      // Используем Set для быстрого поиска вместо includes()
      const wrongIdsSet = new Set(wrongIdsAsNumbers)
      console.log('[DEBUG] Wrong IDs Set size:', wrongIdsSet.size)
      
      // Счетчик для логирования первых совпадений
      let matchCount = 0
      
      // Фильтруем вопросы, оставляя только те, что есть в списке ошибок
      // Строгая проверка: только вопросы, чьи ID точно совпадают
      const filteredQuestions = allQuestions.filter((q) => {
        const questionId = Number(q.id)
        const isMatch = wrongIdsSet.has(questionId)
        // Логируем первые несколько совпадений для отладки
        if (isMatch && matchCount < 3) {
          console.log('[DEBUG] Match found:', { questionId, qId: q.id, type: typeof q.id })
          matchCount++
        }
        return isMatch
      })
      
      // КРИТИЧНО: Дедуплицируем вопросы по ID (на случай если в базе есть дубликаты)
      // Используем Map для хранения только первого вхождения каждого ID
      const uniqueQuestionsMap = new Map<number, Question>()
      filteredQuestions.forEach((q) => {
        const questionId = Number(q.id)
        if (!uniqueQuestionsMap.has(questionId)) {
          uniqueQuestionsMap.set(questionId, q)
        }
      })
      
      // Преобразуем Map обратно в массив
      const mistakesQuestions = Array.from(uniqueQuestionsMap.values())
      
      console.log('[DEBUG] Filtered questions:', {
        filteredCountBeforeDedup: filteredQuestions.length,
        filteredCountAfterDedup: mistakesQuestions.length,
        expectedCount: wrongIdsAsNumbers.length,
        match: mistakesQuestions.length === wrongIdsAsNumbers.length,
        filteredIds: mistakesQuestions.map(q => q.id).slice(0, 10)
      })
      
      // ВАЖНО: Если после фильтрации получили пустой массив, значит фильтрация не сработала
      // Это не должно происходить, если есть ошибки, но на всякий случай проверяем
      if (mistakesQuestions.length === 0) {
        console.warn('Фильтрация не вернула вопросы. Ожидалось:', wrongIdsAsNumbers.length, 'вопросов')
        console.warn('ID ошибок:', wrongIdsAsNumbers)
        console.warn('Всего вопросов в базе:', allQuestions.length)
        setQuestions([])
        setIsLoading(false)
        return
      }
      
      // КРИТИЧНО: Проверяем, что мы не загрузили все вопросы случайно
      if (mistakesQuestions.length === allQuestions.length) {
        console.error('ОШИБКА: Загружены все вопросы вместо фильтрованных!')
        console.error('Ожидалось вопросов:', wrongIdsAsNumbers.length)
        console.error('Получено вопросов:', mistakesQuestions.length)
        console.error('ID ошибок:', wrongIdsAsNumbers)
        // Не загружаем вопросы, показываем ошибку
        setQuestions([])
        setIsLoading(false)
        return
      }
      
      // КРИТИЧНО: Проверяем, что количество отфильтрованных вопросов не превышает ожидаемое более чем в 2 раза
      // Это защита от случаев, когда фильтрация работает неправильно
      if (mistakesQuestions.length > wrongIdsAsNumbers.length * 2) {
        console.error('ОШИБКА: Отфильтровано слишком много вопросов!')
        console.error('Ожидалось вопросов:', wrongIdsAsNumbers.length)
        console.error('Получено вопросов:', mistakesQuestions.length)
        console.error('ID ошибок:', wrongIdsAsNumbers)
        console.error('Отфильтрованные ID:', mistakesQuestions.map(q => q.id))
        // Не загружаем вопросы, показываем ошибку
        setQuestions([])
        setIsLoading(false)
        return
      }
      
      // Перемешиваем вопросы для разнообразия
      const shuffledMistakes = shuffleArray(mistakesQuestions)
      console.log('[DEBUG] Setting questions (mistakes mode):', shuffledMistakes.length)
      setQuestions(shuffledMistakes)
      setInitialQuestionsCount(shuffledMistakes.length) // Сохраняем исходное количество
      setIsLoading(false)
      setQuestionsLoaded(true) // Отмечаем, что вопросы загружены
    } else if (mode === null || mode !== 'mistakes') {
      // Обычный режим - случайные 10 вопросов
      // КРИТИЧНО: Загружаем вопросы ТОЛЬКО если mode точно не 'mistakes'
      console.log('[DEBUG] Normal mode, loading 10 random questions')
      const randomQuestions = getRandomQuestions(allQuestions, 10)
      console.log('[DEBUG] Setting questions (normal mode):', randomQuestions.length)
      setQuestions(randomQuestions)
      setInitialQuestionsCount(randomQuestions.length) // Сохраняем исходное количество
      setIsLoading(false)
      setQuestionsLoaded(true) // Отмечаем, что вопросы загружены
    } else {
      console.log('[DEBUG] Mode is null and URL does not have mistakes, waiting...')
    }
    // Если mode не определен (null), не загружаем вопросы - ждем следующего рендера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, subjectId, userProgress])

  // Синхронизация индекса с массивом вопросов
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      // Если индекс выходит за границы, сбрасываем его
      setCurrentQuestionIndex(0)
    }
  }, [questions, currentQuestionIndex])

  // Сохранение результатов при завершении теста
  useEffect(() => {
    console.log('[DEBUG saveResult useEffect] Срабатывание:', {
      isFinished,
      questionsLength: questions.length,
      initialQuestionsCount,
      correctAnswers,
      totalQuestions: questions.length,
      wrongQuestionIdsCount: wrongQuestionIds.length,
      mode,
      willSave: isFinished && questions.length > 0
    })
    if (isFinished && questions.length > 0) {
      const allQuestionIds = questions.map((q) => q.id)
      const totalQuestionsCount = questions.length
      console.log('[DEBUG saveResult useEffect] Сохранение результатов:', {
        subjectId,
        correctAnswers,
        totalQuestionsCount,
        wrongQuestionIds,
        allQuestionIds
      })
      saveResult(
        subjectId,
        correctAnswers,
        totalQuestionsCount,
        wrongQuestionIds,
        allQuestionIds
      )
    } else if (isFinished && questions.length === 0) {
      console.warn('[DEBUG saveResult useEffect] ПРОБЛЕМА: isFinished=true, но questions.length=0!', {
        correctAnswers,
        initialQuestionsCount,
        mode,
        userProgressWrongIds: userProgress[subjectId]?.wrongQuestionIds?.length || 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]) // Сохраняем только один раз при завершении теста

  const currentQuestion = questions[currentQuestionIndex]
  // Используем initialQuestionsCount как fallback, если questions.length = 0
  const totalQuestions = questions.length > 0 ? questions.length : initialQuestionsCount
  const progressPercent = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0
  
  // Логирование для отслеживания расхождения между initialQuestionsCount и questions.length
  if (initialQuestionsCount > 0 && questions.length !== initialQuestionsCount && !isFinished) {
    console.warn('[DEBUG] РАСХОЖДЕНИЕ: initialQuestionsCount !== questions.length', {
      initialQuestionsCount,
      questionsLength: questions.length,
      isFinished,
      currentQuestionIndex,
      correctAnswers,
      mode
    })
  }
  
  // Защита от undefined: если currentQuestion не существует, показываем загрузку
  if (!currentQuestion && questions.length > 0) {
    // Вопросы есть, но индекс невалидный - сбрасываем
    return (
      <DesktopOnly>
        <div className="min-h-screen bg-canvas p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 text-center"
          >
            <Loader2 className="w-12 h-12 text-accent-gold animate-spin mx-auto mb-4" />
            <p className="text-ink font-semibold">Загрузка вопроса...</p>
          </motion.div>
        </div>
      </DesktopOnly>
    )
  }

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return // Предотвращаем повторный выбор
    
    // Защита от undefined
    if (!currentQuestion) {
      console.error('handleAnswerSelect: currentQuestion is undefined')
      return
    }

    console.log('[DEBUG handleAnswerSelect] Начало:', {
      answer,
      correctAnswer: currentQuestion.correctAnswer,
      currentQuestionIndex,
      totalQuestions: questions.length,
      correctAnswers,
      isFinished,
      mode,
      questionsLoaded
    })

    setSelectedAnswer(answer)
    setShowExplanation(true)

    if (answer === currentQuestion.correctAnswer) {
      const newCorrectAnswers = correctAnswers + 1
      console.log('[DEBUG handleAnswerSelect] Правильный ответ:', {
        oldCorrectAnswers: correctAnswers,
        newCorrectAnswers,
        questionId: currentQuestion.id,
        isLastQuestion: currentQuestionIndex === questions.length - 1
      })
      setCorrectAnswers(newCorrectAnswers)
      
      // Если мы в режиме "Работа над ошибками" и ответ правильный, удаляем вопрос из списка ошибок
      if (mode === 'mistakes') {
        console.log('[DEBUG handleAnswerSelect] Вызываю resolveMistake:', {
          subjectId,
          questionId: currentQuestion.id,
          currentWrongIds: userProgress[subjectId]?.wrongQuestionIds?.length || 0
        })
        resolveMistake(subjectId, currentQuestion.id)
      }
    } else {
      // Добавляем ID вопроса в список неправильных ответов (если еще нет)
      setWrongQuestionIds((prev) => {
        if (!prev.includes(currentQuestion.id)) {
          return [...prev, currentQuestion.id]
        }
        return prev
      })
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      console.log('[DEBUG handleNext] Завершение теста:', {
        currentQuestionIndex,
        totalQuestions: questions.length,
        initialQuestionsCount,
        correctAnswers,
        questionsLength: questions.length,
        isFinished,
        mode,
        wrongQuestionIdsCount: wrongQuestionIds.length
      })
      setIsFinished(true)
    }
  }

  const handleBack = () => {
    router.push(`/subject/${subjectId}`)
  }

  const handleRestart = () => {
    // Сбрасываем флаг загрузки при перезапуске
    setQuestionsLoaded(false)
    
    if (mode === 'mistakes') {
      // В режиме ошибок перезагружаем вопросы из списка ошибок
      const subjectProgress = userProgress[subjectId]
      const storedWrongQuestionIds = subjectProgress?.wrongQuestionIds || []
      
      if (storedWrongQuestionIds.length === 0) {
        setQuestions([])
      } else {
        // Приводим все ID к числу для надежного сравнения и фильтруем невалидные
        const wrongIdsAsNumbers = storedWrongQuestionIds
          .map((id) => Number(id))
          .filter((id) => !isNaN(id) && id > 0)
        
        // Используем Set для быстрого поиска (как в основном useEffect)
        const wrongIdsSet = new Set(wrongIdsAsNumbers)
        
        // Строгая фильтрация: только вопросы с ID из списка ошибок
        const filteredQuestions = allQuestions.filter((q) => {
          const questionId = Number(q.id)
          return wrongIdsSet.has(questionId)
        })
        
        // КРИТИЧНО: Дедуплицируем вопросы по ID (на случай если в базе есть дубликаты)
        const uniqueQuestionsMap = new Map<number, Question>()
        filteredQuestions.forEach((q) => {
          const questionId = Number(q.id)
          if (!uniqueQuestionsMap.has(questionId)) {
            uniqueQuestionsMap.set(questionId, q)
          }
        })
        
        // Преобразуем Map обратно в массив
        const mistakesQuestions = Array.from(uniqueQuestionsMap.values())
        
        // Проверка: не загружаем, если отфильтровано слишком много
        if (mistakesQuestions.length > wrongIdsAsNumbers.length * 2) {
          console.error('[handleRestart] ОШИБКА: Отфильтровано слишком много вопросов!')
          setQuestions([])
          return
        }
        
        const shuffledMistakes = shuffleArray(mistakesQuestions)
        setQuestions(shuffledMistakes)
        setInitialQuestionsCount(shuffledMistakes.length) // Сохраняем исходное количество
        setQuestionsLoaded(true) // Отмечаем, что вопросы загружены
      }
    } else {
      // Обычный режим - генерируем новые случайные вопросы
      const randomQuestions = getRandomQuestions(allQuestions, 10)
      setQuestions(randomQuestions)
      setInitialQuestionsCount(randomQuestions.length) // Сохраняем исходное количество
      setQuestionsLoaded(true) // Отмечаем, что вопросы загружены
    }
    
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setCorrectAnswers(0)
    setIsFinished(false)
    setShowExplanation(false)
    setWrongQuestionIds([]) // Сбрасываем список неправильных ответов
    setInitialQuestionsCount(0) // Сбрасываем исходное количество
  }

  if (isFinished) {
    // Используем initialQuestionsCount если questions.length = 0
    // Если оба равны 0, но correctAnswers > 0, значит все вопросы были правильно отвечены
    // В этом случае считаем процент как 100%
    let effectiveTotalQuestions = totalQuestions > 0 ? totalQuestions : initialQuestionsCount
    
    // Дополнительная защита: если effectiveTotalQuestions = 0, но correctAnswers > 0,
    // значит все вопросы были правильно отвечены (в режиме mistakes они удаляются)
    if (effectiveTotalQuestions === 0 && correctAnswers > 0) {
      console.warn('[DEBUG render isFinished] effectiveTotalQuestions=0, но correctAnswers>0, используем correctAnswers как total')
      effectiveTotalQuestions = correctAnswers
    }
    
    const percentage = effectiveTotalQuestions > 0 
      ? Math.round((correctAnswers / effectiveTotalQuestions) * 100)
      : (correctAnswers > 0 ? 100 : 0) // Если все правильно отвечены, но totalQuestions=0, показываем 100%
    
    console.log('[DEBUG render isFinished] Рендер экрана завершения:', {
      correctAnswers,
      totalQuestions,
      initialQuestionsCount,
      effectiveTotalQuestions,
      questionsLength: questions.length,
      percentage,
      isNaN: isNaN(percentage),
      isFinite: isFinite(percentage),
      mode,
      wrongQuestionIdsCount: wrongQuestionIds.length,
      userProgressWrongIds: userProgress[subjectId]?.wrongQuestionIds?.length || 0,
      calculation: `${correctAnswers} / ${effectiveTotalQuestions} = ${percentage}%`
    })
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
                Правильных ответов: {correctAnswers} из {totalQuestions > 0 ? totalQuestions : initialQuestionsCount}
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
  if (isLoading) {
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

  // Если режим ошибок, но ошибок нет
  if (mode === 'mistakes' && questions.length === 0) {
    return (
      <DesktopOnly>
        <div className="min-h-screen bg-canvas p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>
            <h1 className="text-4xl font-serif font-bold text-ink mb-4">
              Отличная работа!
            </h1>
            <p className="text-xl text-ink opacity-70 mb-8">
              Ошибок нет. Вы ответили правильно на все вопросы!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-6 py-3 bg-accent-gold text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Вернуться
            </motion.button>
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
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Лейбл раздела (если есть) */}
          {currentQuestion.label && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-semibold rounded-full">
                {currentQuestion.label}
              </span>
            </div>
          )}

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

export default function TrainPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrainPageContent />
    </Suspense>
  )
}
