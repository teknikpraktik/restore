import raw from 'virtual:content'

type RawFile = { data: Record<string, any>; body: string }
const files = raw as Record<string, any>

const mdFiles = (prefix: string): [string, RawFile][] =>
  Object.entries(files).filter(([k]) => k.startsWith(prefix) && k.endsWith('.md')) as [string, RawFile][]

export type Phase = { id: number; name: string; modules: string[] }
export type Card = { title: string; text: string }
export type StepKind = 'inledning' | 'inramning' | 'stopp' | 'steg' | 'avslutning'
export type ScriptStep = { kind: StepKind; seconds: number; text: string }
export type ExerciseVersion = 'short' | 'full'

export type ModuleContent = {
  id: string
  number: number
  phase: number
  title: string
  objectives: string[]
  exercises: string[]
  reflection: string[]
  estimatedMinutes: { forsta: number; kann: number; prova: number; reflektera: number }
  cards: Card[]
  prova: Record<string, any>
  reflektera: Record<string, any>
}

export type ExerciseContent = {
  id: string
  title: string
  summary: string
  positions: string[]
  scripts: Partial<Record<ExerciseVersion, ScriptStep[]>>
}

const blocks = (body: string) =>
  body.split(/\n---\n/).map((b) => b.trim()).filter(Boolean)

export function parseCards(body: string): Card[] {
  return blocks(body).map((b) => {
    const m = b.match(/^## (.+)\n+([\s\S]*)$/)
    return m ? { title: m[1].trim(), text: m[2].trim() } : { title: '', text: b }
  })
}

export function parseScripts(body: string): Partial<Record<ExerciseVersion, ScriptStep[]>> {
  const out: Partial<Record<ExerciseVersion, ScriptStep[]>> = {}
  const parts = body.split(/^@@ (kort|hel)$/m)
  for (let i = 1; i < parts.length; i += 2) {
    const version: ExerciseVersion = parts[i] === 'kort' ? 'short' : 'full'
    out[version] = blocks(parts[i + 1]).map((b) => {
      const m = b.match(/^@(\w+) (\d+)\n([\s\S]*)$/)
      if (!m) throw new Error(`Ogiltigt manusblock: ${b.slice(0, 40)}`)
      return { kind: m[1] as StepKind, seconds: Number(m[2]), text: m[3].trim() }
    })
  }
  return out
}

export const phases: Phase[] = files['phases.json']
export const sources: { id: string; text: string }[] = files['sources.json']

export function getModule(id: string): ModuleContent | undefined {
  const entry = mdFiles('modules/').find(([k, f]) => k.endsWith('/module.md') && f.data.id === id)
  if (!entry) return undefined
  const dir = entry[0].replace(/module\.md$/, '')
  const meta = entry[1].data
  return {
    ...(meta as Omit<ModuleContent, 'cards' | 'prova' | 'reflektera'>),
    cards: parseCards((files[dir + 'forsta.md'] as RawFile).body),
    prova: (files[dir + 'prova.md'] as RawFile).data,
    reflektera: (files[dir + 'reflektera.md'] as RawFile).data,
  }
}

export function getExercise(id: string): ExerciseContent | undefined {
  const entry = mdFiles('exercises/').find(([, f]) => f.data.id === id)
  if (!entry) return undefined
  const { data, body } = entry[1]
  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    positions: data.positions ?? [],
    scripts: parseScripts(body),
  }
}

export const exerciseIds = (): string[] =>
  mdFiles('exercises/').map(([, f]) => f.data.id as string)

export const totalSeconds = (steps: ScriptStep[]) => steps.reduce((s, x) => s + x.seconds, 0)

const safety = (name: string) => (files[`safety/${name}.md`] as RawFile).data

export type SelfCheckQuestion = { id: number; question: string; advice: string }
export const selfCheck = () => safety('sjalvkontroll') as {
  title: string
  intro: string
  q1Note: string
  questions: SelfCheckQuestion[]
}
export const stopRule = () => safety('stoppregel') as {
  title: string
  stopIfTitle: string
  stopIf: string[]
  doTitle: string
  do: string[]
  after: string
}
export const reactions = () => safety('reaktioner') as {
  title: string
  commonTitle: string
  common: string[]
  careTitle: string
  care: string[]
  acuteTitle: string
  acute: string[]
}
export const helpAndCare = () => safety('hjalp-och-vard') as {
  title: string
  intro: string
  contacts: { name: string; tel: string; when: string }[]
  thresholdText: string
}
