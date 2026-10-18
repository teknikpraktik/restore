// Progression lagras lokalt i webbläsaren (localStorage). Ingen inloggning och ingen
// synkronisering mellan enheter. Formatet är versionerat så att det kan migreras senare.

import { useSyncExternalStore } from 'react'
import { getChapter, isPassable, type Quiz } from '../course'
import { type Answers, gradeQuiz, type QuizResult } from '../course/quiz'

export const STORAGE_KEY = 'restore.progression'
export const FORMAT_VERSION = 1

export type QuizAttempt = { at: string; correct: number; total: number; passed: boolean }
export type ChapterProgress = { attempts: QuizAttempt[]; passedAt?: string }
export type ExerciseEntry = { at: string; values: Record<string, string>; note: string }

export type ProgressState = {
  version: typeof FORMAT_VERSION
  chapters: Record<string, ChapterProgress>
  exercises: Record<string, ExerciseEntry[]>
  /** Senast öppnade kapitel, för Fortsätt utbildningen. */
  lastChapter?: string
}

export const emptyState = (): ProgressState => ({ version: FORMAT_VERSION, chapters: {}, exercises: {} })

const isObj = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Kontrollerar och normaliserar data från lagring eller import. Kastar vid ogiltigt format. */
export function parseState(input: unknown): ProgressState {
  if (!isObj(input) || input.version !== FORMAT_VERSION) throw new Error('Okänt eller saknat formatversionsnummer')
  if (!isObj(input.chapters) || !isObj(input.exercises)) throw new Error('Filen saknar progressionsdata')
  const chapters: Record<string, ChapterProgress> = {}
  for (const [id, c] of Object.entries(input.chapters)) {
    if (!isObj(c) || !Array.isArray(c.attempts)) throw new Error(`Ogiltig post för ${id}`)
    const attempts = c.attempts.map((a: any) => {
      if (!isObj(a) || typeof a.at !== 'string' || !Number.isInteger(a.correct) || !Number.isInteger(a.total))
        throw new Error(`Ogiltigt försök för ${id}`)
      return { at: a.at, correct: a.correct, total: a.total, passed: a.passed === true }
    })
    const passedAt = typeof c.passedAt === 'string' ? c.passedAt : undefined
    // Ett kapitel räknas som godkänt bara om det finns ett godkänt försök och kapitlet går att godkänna.
    const valid = passedAt && attempts.some((a: QuizAttempt) => a.passed) && isPassable(getChapter(id))
    chapters[id] = { attempts, ...(valid ? { passedAt } : {}) }
  }
  const exercises: Record<string, ExerciseEntry[]> = {}
  for (const [id, list] of Object.entries(input.exercises)) {
    if (!Array.isArray(list)) throw new Error(`Ogiltig övningslogg för ${id}`)
    exercises[id] = list.map((e: any) => {
      if (!isObj(e) || typeof e.at !== 'string') throw new Error(`Ogiltig registrering för ${id}`)
      const values: Record<string, string> = {}
      if (isObj(e.values)) for (const [k, v] of Object.entries(e.values)) values[k] = String(v)
      return { at: e.at, values, note: typeof e.note === 'string' ? e.note : '' }
    })
  }
  const lastChapter = typeof input.lastChapter === 'string' ? input.lastChapter : undefined
  return { version: FORMAT_VERSION, chapters, exercises, ...(lastChapter ? { lastChapter } : {}) }
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseState(JSON.parse(raw)) : emptyState()
  } catch {
    return emptyState()
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function commit(next: ProgressState) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Lagring kan vara avstängd (privat läge). Progressionen gäller då bara sessionen.
  }
  listeners.forEach((l) => l())
}

export const getState = () => state
export const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
/** Läser om från lagringen, till exempel efter ändring i en annan flik. */
export function reloadFromStorage() {
  state = load()
  listeners.forEach((l) => l())
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getState, getState)
}

export const isPassed = (s: ProgressState, chapterId: string) => !!s.chapters[chapterId]?.passedAt

/**
 * Rättar och registrerar ett försök. Kapitel som inte är färdigproducerade kan inte
 * godkännas; då registreras ingenting och funktionen returnerar null.
 */
export function submitQuiz(quiz: Quiz, answers: Answers, now = new Date()): QuizResult | null {
  const chapterId = quiz.chapterId
  const chapter = getChapter(chapterId)
  if (!isPassable(chapter)) return null
  const result = gradeQuiz(quiz, answers)
  const at = now.toISOString()
  const prev = state.chapters[chapterId] ?? { attempts: [] }
  const attempt: QuizAttempt = { at, correct: result.correct, total: result.total, passed: result.passed }
  commit({
    ...state,
    chapters: {
      ...state.chapters,
      // Ett tidigare godkännande står kvar även om ett senare försök blir underkänt.
      [chapterId]: { attempts: [...prev.attempts, attempt], passedAt: prev.passedAt ?? (result.passed ? at : undefined) },
    },
  })
  return result
}

export function recordExercise(exerciseId: string, entry: Omit<ExerciseEntry, 'at'>, now = new Date()) {
  const list = state.exercises[exerciseId] ?? []
  commit({ ...state, exercises: { ...state.exercises, [exerciseId]: [...list, { ...entry, at: now.toISOString() }] } })
}

export function removeExerciseEntry(exerciseId: string, at: string) {
  const list = (state.exercises[exerciseId] ?? []).filter((e) => e.at !== at)
  commit({ ...state, exercises: { ...state.exercises, [exerciseId]: list } })
}

export function setLastChapter(chapterId: string) {
  if (state.lastChapter !== chapterId) commit({ ...state, lastChapter: chapterId })
}

export function resetProgress() {
  commit(emptyState())
}

export function exportProgress(): string {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString(), app: 'Restore' }, null, 2)
}

/** Ersätter progressionen med innehållet i en exporterad fil. Kastar vid ogiltigt innehåll. */
export function importProgress(text: string) {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Filen är inte giltig JSON')
  }
  commit(parseState(parsed))
}
