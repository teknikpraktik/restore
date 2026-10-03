import raw from 'virtual:content'
import { type ExerciseVersion, type Part } from '../model'
import { parseSections, type Section, wordCount } from './markdown'

type RawFile = { data: Record<string, any>; body: string }
const files = raw as Record<string, any>
const mdFiles = (prefix: string) =>
  Object.entries(files).filter(([k]) => k.startsWith(prefix) && k.endsWith('.md')) as [string, RawFile][]

export type Phase = { id: number; name: string; description: string; modules: string[] }

export type Application = {
  title: string
  purpose: string
  steps: string[]
  days: number
  kind?: 'reason' | 'plan'
}

export type Module = {
  id: string
  number: number
  phase: number
  title: string
  intro: string
  objectives: string[]
  exercises: string[]
  application: Application
  reflection: string[]
  measurement: boolean
  sources: string[]
  theory: Section[]
}

export type ExerciseStep = { text: string; weight: number }

export type Exercise = {
  id: string
  title: string
  category: string
  intensity: 'low' | 'moderate'
  durations?: Record<ExerciseVersion, number>
  combination: boolean
  positions: string[]
  modules: number[]
  purpose: string
  safety?: string
  steps: ExerciseStep[]
}

export type Source = { id: string; short: string; text: string }

export const phases: Phase[] = files['phases.json']
export const sources: Source[] = files['sources.json']

export const modules: Module[] = mdFiles('modules/')
  .filter(([k]) => k.endsWith('/module.md'))
  .map(([k, f]) => {
    const theory = files[k.replace(/module\.md$/, 'teori.md')] as RawFile | undefined
    return { ...(f.data as Omit<Module, 'theory'>), theory: theory ? parseSections(theory.body) : [] }
  })
  .sort((a, b) => a.number - b.number)

export const getModule = (id: string | undefined) => modules.find((m) => m.id === id)
export const getModuleByNumber = (n: number) => modules.find((m) => m.number === n)
export const getPhase = (id: number) => phases.find((p) => p.id === id)!

const parseStep = (s: string): ExerciseStep => {
  const m = s.match(/^\[(\d+)\] (.+)$/)
  return m ? { weight: Number(m[1]), text: m[2] } : { weight: 1, text: s }
}

export const exercises: Exercise[] = mdFiles('exercises/').map(([, f]) => ({
  ...(f.data as Omit<Exercise, 'steps' | 'combination'>),
  combination: !!f.data.combination,
  steps: (f.data.steps as string[]).map(parseStep),
}))

export const getExercise = (id: string | undefined) => exercises.find((e) => e.id === id)

export const CATEGORIES = ['Andning', 'Rörelse', 'Uppmärksamhet', 'Vardag']

export const getSource = (id: string) => sources.find((s) => s.id === id)

export type Concept = { term: string; text: string; sources: string[]; module: string }
export const concepts: Concept[] = (files['knowledge/begrepp.md'] as RawFile).data.concepts

const page = (path: string) => {
  const f = files[path] as RawFile
  return { ...f.data, sections: parseSections(f.body) } as {
    title: string
    contacts?: { name: string; tel: string; when: string }[]
    sections: Section[]
  }
}
export const aboutPage = page('about/om-restore.md')
export const notEnoughPage = page('about/nar-restore-inte-racker.md')

// Tidsuppskattningar

export const exerciseMinutes = (e: Exercise, v: ExerciseVersion) =>
  e.durations ? Math.max(1, Math.round(e.durations[v] / 60)) : 0

export const theoryMinutes = (m: Module) => Math.max(2, Math.ceil(wordCount(m.theory) / 180))

export function partMinutes(m: Module, part: Part) {
  switch (part) {
    case 'teori':
      return theoryMinutes(m)
    case 'praktik': {
      const first = getExercise(m.exercises[0])
      return first?.durations ? exerciseMinutes(first, 'short') : 5
    }
    case 'tillampning':
      return 2
    case 'reflektion':
      return 4
  }
}

/** Fördelar övningens tid på stegen efter deras vikt. */
export function timeline(e: Exercise, v: ExerciseVersion) {
  const total = e.durations?.[v] ?? 0
  const weights = e.steps.reduce((s, x) => s + x.weight, 0)
  return e.steps.map((s) => ({ text: s.text, seconds: Math.round((total * s.weight) / weights) }))
}
