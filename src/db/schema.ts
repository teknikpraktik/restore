import Dexie, { type Table } from 'dexie'

// Datamodellen följer spec 9.2. Självkontrollens svar har ingen tabell och får aldrig få någon.

export type StepName = 'forsta' | 'kann' | 'prova' | 'reflektera'

export type Progress = {
  moduleId: string
  steps: Partial<Record<StepName, Date>>
  completedAt?: Date
}
export type ExperimentLog = { id?: number; moduleId: string; date: string }
export type Reflection = {
  id?: number
  moduleId: string
  answers: string[]
  usefulness?: 1 | 2 | 3 | 4 | 5
  createdAt: Date
}
export type Rating = {
  id?: number
  occasion: 'm01' | 'm09' | 'm13' | 'm17' | 'extra'
  stress: number
  sleep: number
  recovery: number
  createdAt: Date
}
export type ExerciseSession = {
  id?: number
  exerciseId: string
  version: 'short' | 'full'
  completed: boolean
  stoppedEarlyTooMuch?: boolean
  after?: 'calmer' | 'same' | 'worse'
  createdAt: Date
}
export type Plan = {
  tools: string[]
  habits: string[]
  warningSigns: string
  actions: string
  contacts: string
  updatedAt: Date
}
export type Settings = {
  reminders?: { days: number[]; time: string }
  safetyConfirmedAt?: Date
  onboardedAt?: Date
  textSize: 'default' | 'large'
  audioCaptions: boolean
}

export const defaultSettings: Settings = { textSize: 'default', audioCaptions: true }

export class RestoreDB extends Dexie {
  progress!: Table<Progress, string>
  experimentLog!: Table<ExperimentLog, number>
  reflections!: Table<Reflection, number>
  ratings!: Table<Rating, number>
  sessions!: Table<ExerciseSession, number>
  plan!: Table<Plan, string>
  settings!: Table<Settings, string>

  constructor(name = 'restore') {
    super(name)
    this.version(1).stores({
      progress: 'moduleId',
      experimentLog: '++id, moduleId',
      reflections: '++id, moduleId',
      ratings: '++id, occasion',
      sessions: '++id, exerciseId',
      plan: '',
      settings: '',
    })
  }
}

export const db = new RestoreDB()
