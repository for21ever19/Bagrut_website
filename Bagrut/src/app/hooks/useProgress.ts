'use client'

import { useState, useEffect, useCallback } from 'react'

// Тип для прогресса по одному предмету
export type SubjectProgress = {
  totalQuestionsAnswered: number
  correctAnswers: number
  wrongQuestionIds: number[] // ID вопросов, где были ошибки (для повторения)
  history: { date: string; score: number; total: number }[] // История попыток
}

// Тип для всего прогресса пользователя
export type UserProgress = {
  [subjectId: string]: SubjectProgress
}

const STORAGE_KEY = 'bagrut_user_progress'

// Функция для безопасного чтения из localStorage
function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    
    const parsed = JSON.parse(stored) as UserProgress
    // Валидация структуры данных
    if (typeof parsed !== 'object' || parsed === null) {
      return {}
    }
    return parsed
  } catch (error) {
    console.error('Ошибка при чтении прогресса из localStorage:', error)
    return {}
  }
}

// Функция для безопасной записи в localStorage
function saveStoredProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Ошибка при сохранении прогресса в localStorage:', error)
  }
}

/**
 * Хук для управления прогрессом пользователя
 * Сохраняет результаты тренировок в LocalStorage
 */
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({})

  // Инициализация: загрузка данных из localStorage при монтировании
  useEffect(() => {
    const stored = getStoredProgress()
    setProgress(stored)
  }, [])

  /**
   * Сохраняет результат тренировки
   * @param subjectId - ID предмета (например, 'civics', 'history')
   * @param correctAnswers - Количество правильных ответов
   * @param totalQuestions - Общее количество вопросов
   * @param wrongQuestionIds - Массив ID вопросов, на которые даны неправильные ответы в этой сессии
   * @param allQuestionIdsInSession - Все ID вопросов в текущей сессии (для правильного удаления из wrongQuestionIds)
   */
  const saveResult = useCallback((
    subjectId: string,
    correctAnswers: number,
    totalQuestions: number,
    wrongQuestionIds: number[],
    allQuestionIdsInSession: number[]
  ) => {
    setProgress((prevProgress) => {
      const currentSubject = prevProgress[subjectId] || {
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        wrongQuestionIds: [],
        history: [],
      }

      // Обновляем общую статистику
      const updatedSubject: SubjectProgress = {
        totalQuestionsAnswered: currentSubject.totalQuestionsAnswered + totalQuestions,
        correctAnswers: currentSubject.correctAnswers + correctAnswers,
        wrongQuestionIds: [...currentSubject.wrongQuestionIds],
        history: [...currentSubject.history],
      }

      // Создаем Set для быстрого поиска неправильных ID
      const wrongIdsSet = new Set(wrongQuestionIds)

      // Обрабатываем каждый вопрос из текущей сессии
      allQuestionIdsInSession.forEach((questionId) => {
        if (wrongIdsSet.has(questionId)) {
          // Вопрос был отвечен неправильно - добавляем в список (если еще нет)
          if (!updatedSubject.wrongQuestionIds.includes(questionId)) {
            updatedSubject.wrongQuestionIds.push(questionId)
          }
        } else {
          // Вопрос был отвечен правильно - удаляем из списка неправильных (если был там)
          const index = updatedSubject.wrongQuestionIds.indexOf(questionId)
          if (index > -1) {
            updatedSubject.wrongQuestionIds.splice(index, 1)
          }
        }
      })

      // Добавляем запись в историю
      updatedSubject.history.push({
        date: new Date().toISOString(),
        score: correctAnswers,
        total: totalQuestions,
      })

      // Обновляем прогресс
      const updatedProgress: UserProgress = {
        ...prevProgress,
        [subjectId]: updatedSubject,
      }

      // Сохраняем в localStorage
      saveStoredProgress(updatedProgress)

      return updatedProgress
    })
  }, [])

  /**
   * Получает прогресс по конкретному предмету
   */
  const getSubjectProgress = useCallback((subjectId: string): SubjectProgress | null => {
    return progress[subjectId] || null
  }, [progress])

  /**
   * Удаляет вопрос из списка ошибок (когда пользователь отвечает правильно в режиме "Работа над ошибками")
   * @param subjectId - ID предмета
   * @param questionId - ID вопроса, который был отвечен правильно
   */
  const resolveMistake = useCallback((subjectId: string, questionId: number) => {
    setProgress((prevProgress) => {
      const currentSubject = prevProgress[subjectId]
      
      // Если предмета нет или в нем нет ошибок, ничего не делаем
      if (!currentSubject || !currentSubject.wrongQuestionIds.includes(questionId)) {
        return prevProgress
      }

      // Удаляем ID вопроса из списка ошибок
      const updatedSubject: SubjectProgress = {
        ...currentSubject,
        wrongQuestionIds: currentSubject.wrongQuestionIds.filter((id) => id !== questionId),
      }

      // Обновляем прогресс
      const updatedProgress: UserProgress = {
        ...prevProgress,
        [subjectId]: updatedSubject,
      }

      // Сохраняем в localStorage
      saveStoredProgress(updatedProgress)

      return updatedProgress
    })
  }, [])

  /**
   * Очищает весь прогресс (для тестирования)
   */
  const clearProgress = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      setProgress({})
    }
  }, [])

  return {
    progress,
    saveResult,
    getSubjectProgress,
    resolveMistake,
    clearProgress,
  }
}

