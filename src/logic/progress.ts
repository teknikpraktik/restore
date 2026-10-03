import type { StepName } from '../db/schema'
import { stepOrder } from '../db/repo'

export const STEP_LABEL: Record<StepName, string> = {
  forsta: 'Förstå',
  kann: 'Känn efter',
  prova: 'Prova',
  reflektera: 'Reflektera',
}

export const stepRoute = (moduleId: string, step: StepName, exerciseId: string) => {
  switch (step) {
    case 'forsta': return `/modul/${moduleId}/forsta`
    case 'kann': return `/ovning/${exerciseId}?modul=${moduleId}`
    case 'prova': return `/modul/${moduleId}/prova`
    case 'reflektera': return `/modul/${moduleId}/reflektera`
  }
}

export const percentDone = (steps: Partial<Record<StepName, Date>> | undefined) =>
  Math.round((stepOrder.filter((s) => steps?.[s]).length / stepOrder.length) * 100)
