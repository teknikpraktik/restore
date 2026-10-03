import { db, defaultSettings, type ExerciseSession, type Rating, type Reflection, type Settings, type StepName } from './schema'

const STEPS: StepName[] = ['forsta', 'kann', 'prova', 'reflektera']
const SETTINGS_KEY = 'main'

export const stepOrder = STEPS

export async function markStep(moduleId: string, step: StepName) {
  await db.transaction('rw', db.progress, async () => {
    const p = (await db.progress.get(moduleId)) ?? { moduleId, steps: {} }
    p.steps[step] = p.steps[step] ?? new Date()
    if (STEPS.every((s) => p.steps[s])) p.completedAt = p.completedAt ?? new Date()
    await db.progress.put(p)
  })
}

export const getProgress = (moduleId: string) => db.progress.get(moduleId)

export const isModuleDone = async (moduleId: string) => !!(await db.progress.get(moduleId))?.completedAt

export async function getSettings(): Promise<Settings> {
  return { ...defaultSettings, ...(await db.settings.get(SETTINGS_KEY)) }
}

export async function updateSettings(patch: Partial<Settings>) {
  await db.settings.put({ ...(await getSettings()), ...patch }, SETTINGS_KEY)
}

export const saveReflection = (r: Omit<Reflection, 'id' | 'createdAt'>) =>
  db.reflections.add({ ...r, createdAt: new Date() })

export const saveRating = (r: Omit<Rating, 'id' | 'createdAt'>) =>
  db.ratings.add({ ...r, createdAt: new Date() })

export const saveSession = (s: Omit<ExerciseSession, 'id' | 'createdAt'>) =>
  db.sessions.add({ ...s, createdAt: new Date() })

export const nextStep = (steps: Partial<Record<StepName, Date>> | undefined): StepName | null =>
  STEPS.find((s) => !steps?.[s]) ?? null
