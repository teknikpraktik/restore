import data, { chapterLoaders, exerciseLoaders } from 'virtual:course'
import { useEffect, useState } from 'react'
import type { Chapter, ChapterContent, CourseMeta, Exercise, ExerciseContent, Module, Source } from './types'

export * from './types'

export const course: CourseMeta = data
export const modules: Module[] = course.modules
export const chapterOrder: string[] = course.order

export const getChapter = (id: string | undefined): Chapter | undefined => (id ? course.chapters[id] : undefined)
export const getModule = (id: string | undefined): Module | undefined => modules.find((m) => m.id === id)
export const getExercise = (id: string | undefined): Exercise | undefined => (id ? course.exercises[id] : undefined)
export const getSource = (id: string): Source | undefined => course.sources[id]
export const getQuizMeta = (chapterId: string) => course.quizzes[chapterId]

export const moduleChapters = (m: Module) => m.chapters.map((id) => course.chapters[id])
export const allChapters = () => chapterOrder.map((id) => course.chapters[id])
export const producedChapters = () => allChapters().filter((c) => c.content === 'producerad')
export const allExercises = () => Object.values(course.exercises).sort((a, b) => a.title.localeCompare(b.title, 'sv'))

/** Ett kapitel kan godkännas bara om både innehåll och självtest är färdigproducerade. */
export const isPassable = (c: Chapter | undefined) =>
  !!c && c.content === 'producerad' && c.quiz === 'klar' && !!course.quizzes[c.id] && !!chapterLoaders[c.id]

// Teori, självtester och övningstexter ligger i egna filer som laddas när de behövs.

const chapterCache = new Map<string, Promise<ChapterContent>>()
const exerciseCache = new Map<string, Promise<ExerciseContent>>()

export function loadChapterContent(id: string): Promise<ChapterContent> {
  const load = chapterLoaders[id]
  if (!load) return Promise.reject(new Error(`Kapitlet ${id} har inget producerat innehåll`))
  if (!chapterCache.has(id)) chapterCache.set(id, load().then((m) => m.default))
  return chapterCache.get(id)!
}

export function loadExerciseContent(id: string): Promise<ExerciseContent> {
  const load = exerciseLoaders[id]
  if (!load) return Promise.reject(new Error(`Övningen ${id} finns inte`))
  if (!exerciseCache.has(id)) exerciseCache.set(id, load().then((m) => m.default))
  return exerciseCache.get(id)!
}

export type Loaded<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; error: Error }

function useLoaded<T>(key: string | undefined, load: (id: string) => Promise<T>): Loaded<T> {
  const [state, setState] = useState<{ key?: string; value: Loaded<T> }>({ value: { status: 'loading' } })
  useEffect(() => {
    if (!key) return
    let alive = true
    load(key).then(
      (data) => alive && setState({ key, value: { status: 'ready', data } }),
      (error) => alive && setState({ key, value: { status: 'error', error } }),
    )
    return () => {
      alive = false
    }
  }, [key])
  return state.key === key ? state.value : { status: 'loading' }
}

export const useChapterContent = (id: string | undefined) => useLoaded(id, loadChapterContent)
export const useExerciseContent = (id: string | undefined) => useLoaded(id, loadExerciseContent)

export function neighbours(id: string) {
  const i = chapterOrder.indexOf(id)
  return {
    prev: i > 0 ? course.chapters[chapterOrder[i - 1]] : undefined,
    next: i >= 0 && i < chapterOrder.length - 1 ? course.chapters[chapterOrder[i + 1]] : undefined,
  }
}

/** Källor som hör till ett kapitel: teorins och övningarnas, i citeringsordning. */
export function chapterSources(c: Chapter): Source[] {
  const ids = [...c.sources]
  for (const e of c.exercises) for (const s of course.exercises[e]?.sources ?? []) if (!ids.includes(s)) ids.push(s)
  return ids.map((id) => course.sources[id]).filter(Boolean)
}

export const sortSources = (list: Source[]) =>
  [...list].sort((a, b) => a.short.localeCompare(b.short, 'sv') || a.year - b.year)

export const chapterHref = (id: string) => `/kurs/${id}`
export const exerciseHref = (id: string) => `/ovningar/${id}`
export const moduleHref = (id: string) => `/kurs/modul/${id}`

export const formatMinutes = (min: number) => {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
