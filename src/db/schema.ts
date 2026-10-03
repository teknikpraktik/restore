import Dexie, { type Table } from 'dexie'
import type { ExerciseVersion, Part } from '../model'

// Datamodellen följer spec 9.2 med de ändringar som beskrivs i docs/omstart.md.

export type Progress = {
  moduleId: string
  openedAt?: Date
  updatedAt?: Date
  theorySeen?: string[] // id för teoriavsnitt som har visats
  parts: Partial<Record<Part, Date>>
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
  moduleId?: string
  version: ExerciseVersion
  completed: boolean
  noticed?: 'yes' | 'no' | 'unsure'
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
  textSize: 'default' | 'large'
  audioCaptions: boolean
}

export const defaultSettings: Settings = { textSize: 'default', audioCaptions: true }

const STORES = {
  progress: 'moduleId',
  experimentLog: '++id, moduleId',
  reflections: '++id, moduleId',
  ratings: '++id, occasion',
  sessions: '++id, exerciseId',
  plan: '',
  settings: '',
}

const OLD_STEP: Record<string, Part> = { forsta: 'teori', kann: 'praktik', prova: 'tillampning', reflektera: 'reflektion' }

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
    this.version(1).stores(STORES)
    // Version 2: ny terminologi för modulens delar, borttagna säkerhetsfält.
    this.version(2)
      .stores(STORES)
      .upgrade(async (tx) => {
        await tx.table('progress').toCollection().modify((p: any) => {
          if (p.steps) {
            p.parts = Object.fromEntries(Object.entries(p.steps).map(([k, v]) => [OLD_STEP[k] ?? k, v]))
            delete p.steps
          }
          p.parts ??= {}
          p.updatedAt ??= p.completedAt
        })
        await tx.table('sessions').toCollection().modify((s: any) => {
          delete s.stoppedEarlyTooMuch
          delete s.after
        })
        await tx.table('settings').toCollection().modify((s: any) => {
          delete s.safetyConfirmedAt
          delete s.onboardedAt
        })
      })
  }
}

export const db = new RestoreDB()
