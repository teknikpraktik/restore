import type { Exercise, Module } from '../content'
import type { ProgressMap } from '../db/repo'
import type { Progress } from '../db/schema'
import { PARTS, type Part } from '../model'

export type ModuleStatus = 'done' | 'active' | 'todo'
export type PartStatus = 'done' | 'current' | 'todo'

export const isStarted = (p?: Progress) =>
  !!p && (PARTS.some((x) => p.parts?.[x]) || (p.theorySeen?.length ?? 0) > 0)

export const moduleStatus = (p?: Progress): ModuleStatus =>
  p?.completedAt ? 'done' : isStarted(p) ? 'active' : 'todo'

export const nextPart = (p?: Progress): Part | null => PARTS.find((x) => !p?.parts?.[x]) ?? null

export const partStatus = (p: Progress | undefined, part: Part): PartStatus => {
  if (p?.parts?.[part]) return 'done'
  if (isStarted(p) && nextPart(p) === part) return 'current'
  return 'todo'
}

/** Den modul användaren arbetar med: senast aktiva påbörjade, annars första som inte är genomförd. */
export function currentModule(mods: Module[], map: ProgressMap): Module | null {
  const active = mods
    .filter((m) => moduleStatus(map[m.id]) === 'active')
    .sort((a, b) => (map[b.id]?.updatedAt?.getTime() ?? 0) - (map[a.id]?.updatedAt?.getTime() ?? 0))
  return active[0] ?? mods.find((m) => moduleStatus(map[m.id]) !== 'done') ?? null
}

export const modulesDone = (mods: Module[], map: ProgressMap) =>
  mods.filter((m) => moduleStatus(map[m.id]) === 'done').length

export const partsDone = (mods: Module[], map: ProgressMap) =>
  mods.reduce((n, m) => n + PARTS.filter((x) => map[m.id]?.parts?.[x]).length, 0)

export const courseStarted = (mods: Module[], map: ProgressMap) => mods.some((m) => isStarted(map[m.id]))

export const partRoute = (moduleId: string, part: Part) => `/kurs/${moduleId}/${part}`

/** En övning är introducerad när någon av dess moduler har öppnats eller påbörjats. */
export const isIntroduced = (e: Exercise, mods: Module[], map: ProgressMap) =>
  e.modules.some((n) => {
    const m = mods.find((x) => x.number === n)
    const p = m && map[m.id]
    return !!p && (!!p.openedAt || isStarted(p))
  })
