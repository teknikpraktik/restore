import { CATEGORIES, exercises, getExercise, getSource, modules, phases, timeline } from '../../src/content'
import { parseSections } from '../../src/content/markdown'

describe('kursens struktur', () => {
  it('har sex faser och 17 moduler i ordning', () => {
    expect(phases).toHaveLength(6)
    expect(modules.map((m) => m.number)).toEqual(Array.from({ length: 17 }, (_, i) => i + 1))
    expect(phases.flatMap((p) => p.modules)).toEqual(modules.map((m) => m.id))
    for (const p of phases) for (const id of p.modules) expect(modules.find((m) => m.id === id)?.phase).toBe(p.id)
  })

  it.each(modules.map((m) => [m.id, m] as const))('%s har teori, praktik, tillämpning och reflektion', (_, m) => {
    expect(m.intro.length).toBeGreaterThan(40)
    expect(m.objectives.length).toBeGreaterThanOrEqual(2)
    expect(m.theory.length).toBeGreaterThanOrEqual(3)
    expect(m.exercises.length).toBeGreaterThanOrEqual(1)
    for (const id of m.exercises) expect(getExercise(id), id).toBeDefined()
    expect(m.application.title).toBeTruthy()
    expect(m.application.steps.length).toBeGreaterThanOrEqual(2)
    expect(m.reflection).toHaveLength(3)
    for (const s of m.theory.flatMap((x) => x.sources)) expect(getSource(s), s).toBeDefined()
  })

  it('kopplar varje övning till rätt moduler åt båda hållen', () => {
    for (const e of exercises) {
      for (const n of e.modules) expect(modules[n - 1].exercises, `${e.id} i modul ${n}`).toContain(e.id)
    }
    for (const m of modules) for (const id of m.exercises) expect(getExercise(id)!.modules).toContain(m.number)
  })

  it('ger varje övning kategori, syfte och kort och lång version', () => {
    for (const e of exercises) {
      expect(CATEGORIES).toContain(e.category)
      expect(e.purpose.length).toBeGreaterThan(30)
      if (e.combination) continue
      expect(e.durations!.full).toBeGreaterThan(e.durations!.short)
      const total = timeline(e, 'short').reduce((s, x) => s + x.seconds, 0)
      expect(Math.abs(total - e.durations!.short)).toBeLessThanOrEqual(e.steps.length)
    }
  })

  it('har ingen Landa nu-övning', () => {
    expect(exercises.find((e) => e.id === 'N1')).toBeUndefined()
    expect(getExercise('O1')!.title).toBe('Orientera dig i rummet')
  })
})

describe('textformatet', () => {
  it('tolkar avsnitt, stycken, listor, diagram, faktarutor och källor', () => {
    const [a, b] = parseSections(
      [
        '## Första',
        'Rad ett',
        'fortsätter.',
        '',
        ':::flow Krav | Reaktion | Återhämtning',
        '',
        ':::fakta Rubrik',
        'Text i rutan.',
        ':::',
        '',
        'Källor: K1, K2',
        '',
        '## Andra',
        '- a',
        '- b',
        '',
        '1. ett',
        '2. två',
      ].join('\n'),
    )
    expect(a.id).toBe('forsta')
    expect(a.blocks).toEqual([
      { type: 'p', text: 'Rad ett fortsätter.' },
      { type: 'flow', items: ['Krav', 'Reaktion', 'Återhämtning'] },
      { type: 'fact', title: 'Rubrik', text: 'Text i rutan.' },
    ])
    expect(a.sources).toEqual(['K1', 'K2'])
    expect(b.blocks).toEqual([
      { type: 'ul', items: ['a', 'b'] },
      { type: 'ol', items: ['ett', 'två'] },
    ])
  })
})
