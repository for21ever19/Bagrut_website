// Импорт всех JSON файлов с вопросами по литературе
import q1 from './questions/1.json'
import q2 from './questions/2.json'
import q3 from './questions/3.json'
import q4 from './questions/4.json'
import q5 from './questions/5.json'
import q6 from './questions/6.json'
import q7 from './questions/7.json'
import q8 from './questions/8.json'
import q9 from './questions/9.json'
import q10 from './questions/10.json'
import q11 from './questions/11.json'
import q12 from './questions/12.json'
import q13 from './questions/13.json'
import q14 from './questions/14.json'
import q15 from './questions/15.json'
import q16 from './questions/16.json'
import q17 from './questions/17.json'
import q18 from './questions/18.json'
import q19 from './questions/19.json'
import q20 from './questions/20.json'
import q21 from './questions/21.json'
import q22 from './questions/22.json'

// Интерфейс для вопроса (совместим с ezrahut)
export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  label?: string
}

// Интерфейс для вопросов из JSON (формат литературы)
interface LiteratureQuestionRaw {
  label: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

// Функция конвертации: correct_answer (число - индекс) → correctAnswer (строка)
function convertQuestion(q: LiteratureQuestionRaw, id: number): Question {
  return {
    id,
    question: q.question,
    options: q.options,
    correctAnswer: q.options[q.correct_answer],
    explanation: q.explanation,
    label: q.label
  }
}

// Объединение всех вопросов с автогенерацией ID
let currentId = 1
export const allQuestions: Question[] = [
  ...(q1 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q2 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q3 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q4 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q5 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q6 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q7 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q8 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q9 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q10 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q11 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q12 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q13 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q14 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q15 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q16 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q17 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q18 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q19 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q20 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q21 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
  ...(q22 as LiteratureQuestionRaw[]).map(q => convertQuestion(q, currentId++)),
]

// Экспорт общего количества вопросов
export const totalQuestionsCount = allQuestions.length
