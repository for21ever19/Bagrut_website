// Импорт всех JSON файлов с вопросами
import q1_1 from './questions/1.1.json'
import q1_2_10 from './questions/1.2-1.10.json'
import q2 from './questions/2.json'
import q3 from './questions/3.json'
import q4 from './questions/4.json'
import q5 from './questions/5.json'
import q7 from './questions/7.json'
import q8 from './questions/8.json'
import q9 from './questions/9.json'
import q10_11 from './questions/10-11.json'
import q12_13 from './questions/12-13.json'
import q14_15 from './questions/14-15.json'
import q16_17_18 from './questions/16-17-18.json'
import q19_20_21_22 from './questions/19-20-21-22.json'

// Интерфейс для вопроса
export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  label?: string
}

// Объединение всех вопросов в один массив
export const allQuestions: Question[] = [
  ...(q1_1 as Question[]),
  ...(q1_2_10 as Question[]),
  ...(q2 as Question[]),
  ...(q3 as Question[]),
  ...(q4 as Question[]),
  ...(q5 as Question[]),
  ...(q7 as Question[]),
  ...(q8 as Question[]),
  ...(q9 as Question[]),
  ...(q10_11 as Question[]),
  ...(q12_13 as Question[]),
  ...(q14_15 as Question[]),
  ...(q16_17_18 as Question[]),
  ...(q19_20_21_22 as Question[]),
]

// Экспорт общего количества вопросов
export const totalQuestionsCount = allQuestions.length





