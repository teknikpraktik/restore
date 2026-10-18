// Rättning, progression, persistens, export och återställning.
import { getChapter, isPassable, loadChapterContent, type Quiz } from '../../src/course'
import { gradeQuiz, requiredCorrect } from '../../src/course/quiz'
import {
  exportProgress,
  getState,
  importProgress,
  isPassed,
  recordExercise,
  reloadFromStorage,
  resetProgress,
  STORAGE_KEY,
  submitQuiz,
} from '../../src/progress/store'

const FIRST = 'homeostas-och-negativ-aterkoppling'
const PLANNED = 'baroreflexen'

let quiz: Quiz
const correctAnswers = () => quiz.questions.map((q) => q.correct)
const wrongAnswers = () => quiz.questions.map((q) => (q.correct + 1) % q.options.length)
/** Svar med exakt n rätta. */
const withCorrect = (n: number) => quiz.questions.map((q, i) => (i < n ? q.correct : (q.correct + 1) % q.options.length))

beforeAll(async () => {
  quiz = (await loadChapterContent(FIRST)).quiz!
})

beforeEach(() => {
  localStorage.clear()
  resetProgress()
})

const fake = (n: number): Quiz => ({
  chapterId: 'x',
  passThreshold: 0.8,
  questions: Array.from({ length: n }, (_, i) => ({ id: `q${i}`, kind: 'begrepp', prompt: '', options: ['a', 'b', 'c'], correct: 0, explanation: '' })),
})

describe('rättning', () => {
  it('kräver minst 80 procent rätt', () => {
    const five = fake(5)
    expect(gradeQuiz(five, [0, 0, 0, 0, 1]).passed).toBe(true) // 4 av 5 = exakt 80 %
    expect(gradeQuiz(five, [0, 0, 0, 1, 1]).passed).toBe(false)
    const eight = fake(8)
    expect(requiredCorrect(eight)).toBe(7)
    expect(gradeQuiz(eight, [0, 0, 0, 0, 0, 0, 0, 1]).passed).toBe(true)
    expect(gradeQuiz(eight, [0, 0, 0, 0, 0, 0, 1, 1]).passed).toBe(false)
  })

  it('räknar obesvarade frågor som fel', () => {
    const r = gradeQuiz(fake(5), [0, 0, 0, null, null])
    expect(r.correct).toBe(3)
    expect(r.perQuestion).toEqual([true, true, true, false, false])
  })

  it('rättar kapitlets riktiga kontroll', () => {
    expect(gradeQuiz(quiz, correctAnswers())).toMatchObject({ correct: quiz.questions.length, passed: true })
    expect(gradeQuiz(quiz, wrongAnswers())).toMatchObject({ correct: 0, passed: false })
  })
})

describe('progression', () => {
  it('ger godkänt kapitel efter godkänd kontroll', () => {
    expect(isPassed(getState(), FIRST)).toBe(false)
    const r = submitQuiz(quiz, correctAnswers())
    expect(r?.passed).toBe(true)
    expect(isPassed(getState(), FIRST)).toBe(true)
  })

  it('markerar inte underkänd kontroll som godkänd men registrerar försöket', () => {
    const r = submitQuiz(quiz, withCorrect(requiredCorrect(quiz) - 1))
    expect(r?.passed).toBe(false)
    expect(isPassed(getState(), FIRST)).toBe(false)
    expect(getState().chapters[FIRST].attempts).toHaveLength(1)
  })

  it('behåller ett godkännande när ett senare försök blir underkänt', () => {
    submitQuiz(quiz, correctAnswers())
    submitQuiz(quiz, wrongAnswers())
    expect(isPassed(getState(), FIRST)).toBe(true)
    expect(getState().chapters[FIRST].attempts).toHaveLength(2)
  })

  it('kan inte godkänna ett kapitel som inte är färdigproducerat', () => {
    expect(isPassable(getChapter(PLANNED))).toBe(false)
    const r = submitQuiz({ ...quiz, chapterId: PLANNED }, correctAnswers())
    expect(r).toBeNull()
    expect(isPassed(getState(), PLANNED)).toBe(false)
    expect(getState().chapters[PLANNED]).toBeUndefined()
  })

  it('registrerar övningar separat från kunskapskontrollen', () => {
    recordExercise('ortostatisk-pulsrespons', { values: { liggande: '62' }, note: '' })
    expect(getState().exercises['ortostatisk-pulsrespons']).toHaveLength(1)
    expect(isPassed(getState(), FIRST)).toBe(false)
  })
})

describe('persistens', () => {
  it('sparar i localStorage och läser in igen', () => {
    submitQuiz(quiz, correctAnswers())
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).chapters[FIRST].passedAt).toBeTruthy()
    const saved = localStorage.getItem(STORAGE_KEY)!
    resetProgress()
    localStorage.setItem(STORAGE_KEY, saved)
    reloadFromStorage()
    expect(isPassed(getState(), FIRST)).toBe(true)
  })

  it('tål trasig data i lagringen', () => {
    localStorage.setItem(STORAGE_KEY, '{inte json')
    reloadFromStorage()
    expect(getState().chapters).toEqual({})
  })

  it('återställer progressionen', () => {
    submitQuiz(quiz, correctAnswers())
    recordExercise('ortostatisk-pulsrespons', { values: {}, note: 'x' })
    resetProgress()
    expect(isPassed(getState(), FIRST)).toBe(false)
    expect(getState().exercises).toEqual({})
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).chapters).toEqual({})
  })

  it('exporterar och läser in progression', () => {
    submitQuiz(quiz, correctAnswers())
    const file = exportProgress()
    resetProgress()
    importProgress(file)
    expect(isPassed(getState(), FIRST)).toBe(true)
  })

  it('avvisar ogiltiga filer utan att ändra något', () => {
    submitQuiz(quiz, correctAnswers())
    expect(() => importProgress('inte json')).toThrow(/JSON/)
    expect(() => importProgress('{"version": 99}')).toThrow()
    expect(isPassed(getState(), FIRST)).toBe(true)
  })

  it('läser progression sparad i Restore 2.0, även med kapitel som har tagits bort', () => {
    const fromV2 = {
      version: 1,
      chapters: {
        [FIRST]: { attempts: [{ at: '2026-10-18T10:00:00.000Z', correct: 8, total: 8, passed: true }], passedAt: '2026-10-18T10:00:00.000Z' },
        termoreglering: { attempts: [{ at: '2026-10-18T11:00:00.000Z', correct: 1, total: 8, passed: false }] },
      },
      exercises: { 'ortostatisk-pulsrespons': [{ at: '2026-10-18T12:00:00.000Z', values: { liggande: '60', topp: '84' }, note: '' }] },
      lastChapter: 'termoreglering',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fromV2))
    reloadFromStorage()
    expect(isPassed(getState(), FIRST)).toBe(true)
    expect(getState().exercises['ortostatisk-pulsrespons'][0].values.liggande).toBe('60')
  })

  it('godtar inte godkännande av ej producerade kapitel vid inläsning', () => {
    importProgress(
      JSON.stringify({
        version: 1,
        chapters: { [PLANNED]: { attempts: [{ at: '2026-01-01T00:00:00Z', correct: 8, total: 8, passed: true }], passedAt: '2026-01-01T00:00:00Z' } },
        exercises: {},
      }),
    )
    expect(isPassed(getState(), PLANNED)).toBe(false)
  })
})
