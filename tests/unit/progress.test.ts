import Dexie from 'dexie'
import { getExercise, modules } from '../../src/content'
import { markOpened, markPart, markTheorySeen, saveSession } from '../../src/db/repo'
import { db, type Progress, RestoreDB } from '../../src/db/schema'
import { currentModule, isIntroduced, moduleStatus, nextPart, partStatus } from '../../src/logic/progress'
import { elapsedMs, initialPlayer, tick } from '../../src/logic/player'

const p = (parts: Progress['parts'], extra: Partial<Progress> = {}): Progress => ({ moduleId: 'm05', parts, ...extra })
const d = new Date()

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('status per modul och del', () => {
  it('skiljer ej påbörjad, pågår och genomförd', () => {
    expect(moduleStatus(undefined)).toBe('todo')
    expect(moduleStatus(p({}, { openedAt: d }))).toBe('todo') // att öppna räknas inte som påbörjad
    expect(moduleStatus(p({}, { theorySeen: ['a'] }))).toBe('active')
    expect(moduleStatus(p({ teori: d }))).toBe('active')
    expect(moduleStatus(p({ teori: d, praktik: d, tillampning: d, reflektion: d }, { completedAt: d }))).toBe('done')
  })

  it('visar gjorda delar, pågående del och kvarvarande delar', () => {
    const prog = p({ teori: d, praktik: d })
    expect(partStatus(prog, 'teori')).toBe('done')
    expect(partStatus(prog, 'praktik')).toBe('done')
    expect(partStatus(prog, 'tillampning')).toBe('current')
    expect(partStatus(prog, 'reflektion')).toBe('todo')
    expect(nextPart(prog)).toBe('tillampning')
    expect(partStatus(undefined, 'teori')).toBe('todo')
  })

  it('väljer senast aktiva påbörjade modul som aktuell', () => {
    const map = {
      m01: { moduleId: 'm01', parts: { teori: d, praktik: d, tillampning: d, reflektion: d }, completedAt: d },
      m02: { moduleId: 'm02', parts: { teori: d }, updatedAt: new Date(1000) },
      m04: { moduleId: 'm04', parts: { teori: d }, updatedAt: new Date(2000) },
    }
    expect(currentModule(modules, map)?.id).toBe('m04')
    expect(currentModule(modules, { m01: map.m01 })?.id).toBe('m02')
    expect(currentModule(modules, {})?.id).toBe('m01')
  })

  it('introducerar övningar när deras modul har öppnats', () => {
    const a1 = getExercise('A1')!
    expect(isIntroduced(a1, modules, {})).toBe(false)
    expect(isIntroduced(a1, modules, { m05: p({}, { openedAt: d }) })).toBe(true)
  })
})

describe('progression sparas i IndexedDB', () => {
  it('sparar öppnad modul, lästa avsnitt och gjorda delar, och markerar modulen genomförd', async () => {
    await markOpened('m05')
    await markTheorySeen('m05', 'andning-och-stress')
    await markTheorySeen('m05', 'andning-och-stress')
    let row = await db.progress.get('m05')
    expect(row?.openedAt).toBeInstanceOf(Date)
    expect(row?.theorySeen).toEqual(['andning-och-stress'])
    expect(row?.completedAt).toBeUndefined()

    for (const part of ['teori', 'praktik', 'tillampning'] as const) await markPart('m05', part)
    expect((await db.progress.get('m05'))?.completedAt).toBeUndefined()
    await markPart('m05', 'reflektion')
    row = await db.progress.get('m05')
    expect(row?.completedAt).toBeInstanceOf(Date)
    expect(moduleStatus(row)).toBe('done')
  })

  it('sparar övningspass utan säkerhetsfält', async () => {
    const id = await saveSession({ exerciseId: 'A1', moduleId: 'm05', version: 'short', completed: true })
    expect(await db.sessions.get(id)).toMatchObject({ exerciseId: 'A1', completed: true })
    expect(Object.keys((await db.sessions.get(id))!)).not.toContain('stoppedEarlyTooMuch')
  })

  it('migrerar version 1 till den nya terminologin', async () => {
    const name = 'restore-migrering'
    const old = new Dexie(name)
    old.version(1).stores({ progress: 'moduleId', sessions: '++id, exerciseId', settings: '', experimentLog: '++id, moduleId', reflections: '++id, moduleId', ratings: '++id, occasion', plan: '' })
    await old.table('progress').put({ moduleId: 'm01', steps: { forsta: d, kann: d } })
    await old.table('sessions').add({ exerciseId: 'O1', version: 'short', completed: false, stoppedEarlyTooMuch: true, createdAt: d })
    await old.table('settings').put({ textSize: 'default', audioCaptions: true, safetyConfirmedAt: d, onboardedAt: d }, 'main')
    old.close()

    const fresh = new RestoreDB(name)
    const row = await fresh.progress.get('m01')
    expect(Object.keys(row!.parts)).toEqual(['teori', 'praktik'])
    expect(row).not.toHaveProperty('steps')
    expect(await fresh.sessions.toArray()).toEqual([expect.not.objectContaining({ stoppedEarlyTooMuch: true })])
    expect(await fresh.settings.get('main')).toEqual({ textSize: 'default', audioCaptions: true })
    fresh.close()
  })
})

describe('övningsspelaren', () => {
  const steps = [{ text: 'a', seconds: 10 }, { text: 'b', seconds: 20 }]
  it('går vidare mellan steg och blir klar efter total tid', () => {
    let s = tick(initialPlayer, steps, 12_000)
    expect(s.index).toBe(1)
    expect(elapsedMs(s, steps)).toBe(12_000)
    s = tick(s, steps, 30_000)
    expect(s.done).toBe(true)
  })
  it('står still när den är pausad', () => {
    const s = tick({ ...initialPlayer, paused: true }, steps, 50_000)
    expect(s).toEqual({ ...initialPlayer, paused: true })
  })
})
