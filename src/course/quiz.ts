import type { Quiz } from './types'

/** Valda alternativ per fråga. Null eller tom lista betyder obesvarad. */
export type Answers = (number[] | null)[]

export type QuizResult = {
  correct: number
  total: number
  /** Andel rätt, 0–1. */
  score: number
  passed: boolean
  perQuestion: boolean[]
}

/** Rättar ett självtest. Obesvarade frågor räknas som fel. */
export function gradeQuiz(quiz: Quiz, answers: Answers): QuizResult {
  // En fråga är rätt besvarad bara om exakt de rätta alternativen är valda.
  const perQuestion = quiz.questions.map((q, i) => {
    const a = [...new Set(answers[i] ?? [])].sort((x, y) => x - y)
    return a.length === q.correct.length && a.every((v, j) => v === q.correct[j])
  })
  const correct = perQuestion.filter(Boolean).length
  const total = quiz.questions.length
  // Heltalsjämförelse så att till exempel 4 av 5 (exakt 80 %) blir godkänt utan avrundningsfel.
  const passed = total > 0 && correct * 100 >= Math.round(quiz.passThreshold * 100) * total
  return { correct, total, score: total ? correct / total : 0, passed, perQuestion }
}

/** Minsta antal rätta svar som krävs för godkänt. */
export const requiredCorrect = (quiz: Quiz) => Math.ceil(quiz.passThreshold * quiz.questions.length - 1e-9)
