import { useLiveQuery } from 'dexie-react-hooks'
import { PARTS, type Part } from '../model'
import { db, defaultSettings, type ExerciseSession, type Plan, type Progress, type Rating, type Reflection, type Settings } from './schema'

export type ProgressMap = Record<string, Progress | undefined>

const SETTINGS_KEY = 'main'
const PLAN_KEY = 'main'

async function updateProgress(moduleId: string, fn: (p: Progress) => void) {
  await db.transaction('rw', db.progress, async () => {
    const p: Progress = (await db.progress.get(moduleId)) ?? { moduleId, parts: {} }
    fn(p)
    await db.progress.put(p)
  })
}

/** Modulen har öppnats. Räknas inte som påbörjad. */
export const markOpened = (moduleId: string) =>
  updateProgress(moduleId, (p) => {
    p.openedAt ??= new Date()
  })

export const markTheorySeen = (moduleId: string, sectionId: string) =>
  updateProgress(moduleId, (p) => {
    if (p.theorySeen?.includes(sectionId)) return
    p.theorySeen = [...(p.theorySeen ?? []), sectionId]
    p.updatedAt = new Date()
  })

export const markPart = (moduleId: string, part: Part) =>
  updateProgress(moduleId, (p) => {
    p.parts[part] ??= new Date()
    p.updatedAt = new Date()
    if (PARTS.every((x) => p.parts[x])) p.completedAt ??= new Date()
  })

export const saveSession = (s: Omit<ExerciseSession, 'id' | 'createdAt'>) =>
  db.sessions.add({ ...s, createdAt: new Date() })

export const setNoticed = (id: number, noticed: ExerciseSession['noticed']) => db.sessions.update(id, { noticed })

export const today = () => new Date().toLocaleDateString('sv-SE')

export async function logExperimentToday(moduleId: string) {
  const date = today()
  const exists = await db.experimentLog.where('moduleId').equals(moduleId).filter((e) => e.date === date).count()
  if (!exists) await db.experimentLog.add({ moduleId, date })
}

export const saveReflection = (r: Omit<Reflection, 'id' | 'createdAt'>) =>
  db.reflections.add({ ...r, createdAt: new Date() })

export async function latestReflection(moduleId: string) {
  const all = await db.reflections.where('moduleId').equals(moduleId).toArray()
  return all.at(-1)
}

export const saveRating = (r: Omit<Rating, 'id' | 'createdAt'>) => db.ratings.add({ ...r, createdAt: new Date() })

export async function getSettings(): Promise<Settings> {
  return { ...defaultSettings, ...(await db.settings.get(SETTINGS_KEY)) }
}

export async function updateSettings(patch: Partial<Settings>) {
  await db.settings.put({ ...(await getSettings()), ...patch }, SETTINGS_KEY)
}

export const getPlan = () => db.plan.get(PLAN_KEY)
export const savePlan = (p: Omit<Plan, 'updatedAt'>) => db.plan.put({ ...p, updatedAt: new Date() }, PLAN_KEY)

export async function exportAll() {
  const out: Record<string, unknown> = { app: 'Restore', exportedAt: new Date().toISOString() }
  for (const t of db.tables) out[t.name] = await t.toArray()
  return out
}

export const deleteAll = () => Promise.all(db.tables.map((t) => t.clear()))

// Hooks. Returnerar undefined medan data läses, så att vyer inte blinkar med fel status.

export const useProgressMap = (): ProgressMap | undefined =>
  useLiveQuery(async () => Object.fromEntries((await db.progress.toArray()).map((p) => [p.moduleId, p])))

export const useCompletedCounts = (): Record<string, number> | undefined =>
  useLiveQuery(async () => {
    const counts: Record<string, number> = {}
    await db.sessions.filter((s) => s.completed).each((s) => {
      counts[s.exerciseId] = (counts[s.exerciseId] ?? 0) + 1
    })
    return counts
  })

export const useSettings = () => useLiveQuery(getSettings)
