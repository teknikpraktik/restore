import fs from 'node:fs'
import path from 'node:path'
import { exerciseIds, getExercise, getModule, selfCheck, stopRule, reactions } from '../../src/content'

const spec = fs.readFileSync('PRODUKTSPECIFIKATION.md', 'utf8').replace(/\r\n/g, '\n')

const wordCount = (s: string) => s.trim().split(/\s+/).length

describe('innehåll', () => {
  it('Förstå-korten i modul 1 är 5–8 st och högst 60 ord', () => {
    const { cards } = getModule('m01')!
    expect(cards.length).toBeGreaterThanOrEqual(5)
    expect(cards.length).toBeLessThanOrEqual(8)
    for (const c of cards) expect(wordCount(c.text), c.title).toBeLessThanOrEqual(60)
  })

  it('självkontrollen är ordagrant lika med specifikationen 6.1', () => {
    const section = spec.slice(spec.indexOf('### 6.1 Självkontroll'), spec.indexOf('### 6.2 Stoppregel'))
    const rows = [...section.matchAll(/^\| (\d+) \| (.+?) \| (.+) \|$/gm)]
    const { questions, intro } = selfCheck()
    expect(rows).toHaveLength(10)
    expect(questions).toHaveLength(10)
    expect(section).toContain(intro)
    rows.forEach(([, id, question, advice]) => {
      const q = questions.find((x) => x.id === Number(id))!
      expect(q.question).toBe(question)
      if (id === '1') expect(advice).toContain(`"${q.advice}"`)
      else expect(q.advice).toBe(advice)
    })
  })

  it('stoppregel och reaktioner är ordagrant lika med specifikationen', () => {
    const stop = stopRule()
    const s62 = spec.slice(spec.indexOf('### 6.2'), spec.indexOf('### 6.3'))
    for (const line of [...stop.stopIf, stop.after, stop.stopIfTitle, stop.doTitle]) expect(s62).toContain(line)
    stop.do.forEach((line, i) => expect(s62).toContain(`${i + 1}. ${line}`))
    const s63 = spec.slice(spec.indexOf('### 6.3'), spec.indexOf('### 6.4'))
    const r = reactions()
    for (const line of [...r.common, ...r.care, ...r.acute, r.commonTitle, r.careTitle, r.acuteTitle]) {
      expect(s63).toContain(line)
    }
  })

  it('övningsmanus har inramning, stoppregel och avslutning (spec 5.2)', () => {
    for (const id of exerciseIds()) {
      const kinds = Object.values(getExercise(id)!.scripts)[0]!.map((s) => s.kind)
      expect(kinds.at(-1)).toBe('avslutning')
      if (id === 'O1') expect(kinds).toEqual(expect.arrayContaining(['inledning', 'inramning', 'stopp', 'steg', 'avslutning']))
    }
    const o1 = getExercise('O1')!.scripts.short!
    expect(o1.find((s) => s.kind === 'inramning')!.text).toBe('Du kan ha ögonen öppna hela tiden. Du kan sluta när du vill.')
  })
})

// Sökning enligt spec 12.3 och 12.2 i allt innehåll.
const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))

const FORBIDDEN = [
  /\bbotar\b/i, /\bbota\b/i, /\bläker\b/i, /\bläka\b/i, /\bläkning\b/i,
  /lagras i (kroppen|nervsystemet)/i, /lagrad stress/i, /släpp(a|er)? (ut )?(lagrad|trauma)/i,
  /fastnat/i, /dysreglera/i, /vagus/i, /binjur/i, /njur(ar|arna)/i, /hormon/i,
  /säker(t|a)? i alla lägen/i, /streak/i, /poäng/i, /\bbadge/i, /fantastisk/i, /\bgrym\b/i,
]

describe('förbjudna påståenden (spec 12.3) och ton (12.2) i content/', () => {
  for (const file of walk('content').filter((f) => f.endsWith('.md'))) {
    it(path.basename(file), () => {
      const text = fs.readFileSync(file, 'utf8')
      for (const re of FORBIDDEN) expect(text, String(re)).not.toMatch(re)
      expect(text).not.toContain('!')
    })
  }
})
