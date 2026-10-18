// Kursmanifestet och innehållskompilatorn: struktur, validering och språk.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildCourse, FORBIDDEN_PHRASES } from '../../tools/course-build'
import { createMarkdown, theoryText, wordCount } from '../../tools/markdown'

const built = buildCourse('content')
const { meta } = built

/** Kopierar content/ till en temporär katalog, ändrar en fil och bygger. */
function buildWith(rel: string, change: (s: string) => string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'restore-'))
  fs.cpSync('content', dir, { recursive: true })
  const file = path.join(dir, rel)
  fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')))
  try {
    return () => buildCourse(dir)
  } finally {
    setTimeout(() => fs.rmSync(dir, { recursive: true, force: true }), 0)
  }
}

describe('kursstruktur', () => {
  it('har 12–16 moduler med underkapitel i varje', () => {
    expect(meta.modules.length).toBeGreaterThanOrEqual(12)
    expect(meta.modules.length).toBeLessThanOrEqual(16)
    for (const m of meta.modules) expect(m.chapters.length).toBeGreaterThanOrEqual(5)
  })

  it('har unika id och numrering räknad från ordningen', () => {
    expect(new Set(meta.order).size).toBe(meta.order.length)
    const first = meta.chapters[meta.order[0]]
    expect(first.number).toBe('1.1')
    expect(first.id).toBe('homeostas-och-negativ-aterkoppling')
    const m2 = meta.modules[1]
    expect(meta.chapters[m2.chapters[0]].number).toBe('2.1')
  })

  it('ger varje underkapitel de fält som kursplanen kräver', () => {
    for (const id of meta.order) {
      const c = meta.chapters[id]
      expect(c.title, id).toBeTruthy()
      expect(c.description, id).toBeTruthy()
      expect(c.objectives.length, id).toBeGreaterThan(0)
      expect(c.minutes, id).toBeGreaterThan(0)
      expect(['producerad', 'under-produktion']).toContain(c.content)
      expect(['klar', 'ej-producerad']).toContain(c.quiz)
      for (const p of c.prerequisites) expect(meta.order.indexOf(p)).toBeLessThan(meta.order.indexOf(id))
    }
  })

  it('har inga övningar eller kontroller i kapitel som inte är producerade', () => {
    for (const id of meta.order) {
      const c = meta.chapters[id]
      if (c.content === 'producerad') continue
      expect(c.exercises, id).toEqual([])
      expect(c.quiz, id).toBe('ej-producerad')
      expect(meta.quizzes[id], id).toBeUndefined()
      expect(built.chapterContent[id], id).toBeUndefined()
    }
  })

  it('har ett fullständigt första underkapitel', () => {
    const id = 'homeostas-och-negativ-aterkoppling'
    const c = meta.chapters[id]
    expect(c.content).toBe('producerad')
    expect(c.quiz).toBe('klar')
    expect(c.readingMinutes).toBeLessThanOrEqual(5)
    expect(c.headings.length).toBeGreaterThanOrEqual(3)
    expect(c.sources.length).toBeGreaterThanOrEqual(5)
    expect(c.tasks!.upptack).toBeGreaterThanOrEqual(2)
    expect(c.tasks!.reflektera).toBeGreaterThanOrEqual(1)
    expect(c.tasks!.tillampa).toBeGreaterThanOrEqual(1)
    const content = built.chapterContent[id]
    expect(content.html).toContain('box-upptack')
    expect(content.quiz!.questions.length).toBeGreaterThanOrEqual(5)
    expect(content.quiz!.questions.length).toBeLessThanOrEqual(8)
    expect(content.quiz!.passThreshold).toBe(1)
  })

  it('har övningar med hela standardstrukturen', () => {
    for (const [id, e] of Object.entries(built.exerciseContent)) {
      const titles = e.sections.map((s) => s.title)
      for (const t of ['Syfte', 'Teoretisk bakgrund', 'Utrustning', 'Genomförande', 'Observationer', 'Förväntat resultat', 'Tolkning', 'Evidensläge', 'Begränsningar', 'Variationer'])
        expect(titles, id).toContain(t)
      expect(meta.exercises[id].chapters.length, id).toBeGreaterThan(0)
    }
  })

  it('har kontrollerbara källor kopplade till modulerna där de citeras', () => {
    for (const s of Object.values(meta.sources)) {
      expect(s.doi || s.isbn || s.url, s.id).toBeTruthy()
      // Källor som inte citeras i publicerad text får finnas kvar som underlag.
      expect(s.modules.length, s.id).toBe(new Set(s.chapters.map((c) => meta.chapters[c].moduleId)).size)
    }
  })
})

describe('validering', () => {
  it('avvisar en källhänvisning som inte finns', () => {
    const run = buildWith('kapitel/homeostas-och-negativ-aterkoppling.md', (s) => s + '\n\nPåhittad uppgift [@finnsinte2099].')
    expect(run).toThrow(/Okänd källa: finnsinte2099/)
  })

  it('avvisar en kontroll till ett kapitel som inte är producerat', () => {
    const run = buildWith('kursplan.yaml', (s) =>
      s.replace(/(id: centrala-och-perifera-nervsystemet[\s\S]*?kontroll: )ej-producerad/, '$1klar'),
    )
    expect(run).toThrow(/kan inte ha en färdig kunskapskontroll/)
  })

  it('avvisar en kontroll med för få frågor', () => {
    const run = buildWith('kontroller/homeostas-och-negativ-aterkoppling.yaml', (s) => {
      const parts = s.split(/\n(?=  - id: )/)
      return parts.slice(0, 4).join('\n') + '\n'
    })
    expect(run).toThrow(/5–8 frågor/)
  })

  it('avvisar en övning som saknar ett standardavsnitt', () => {
    const run = buildWith('ovningar/ortostatisk-pulsrespons.md', (s) => s.replace('## Begränsningar', '## Övrigt'))
    expect(run).toThrow(/avsnitten måste vara/)
  })

  it('avvisar förkunskaper som kommer senare i kursen', () => {
    const run = buildWith('kursplan.yaml', (s) =>
      s.replace('forkunskaper: [homeostas-och-negativ-aterkoppling]\n', 'forkunskaper: [langsiktig-uppfoljning]\n'),
    )
    expect(run).toThrow(/kommer senare i kursen/)
  })
})

describe('pedagogisk mall', () => {
  it('ger alla producerade kapitel Förstå, Upptäck, Reflektera och Tillämpa', () => {
    for (const id of meta.order) {
      const c = meta.chapters[id]
      if (c.content !== 'producerad') continue
      expect(c.tasks!.upptack, id).toBeGreaterThanOrEqual(Math.ceil(c.readingMinutes! / 7))
      expect(c.tasks!.reflektera, id).toBeGreaterThan(0)
      expect(c.tasks!.tillampa, id).toBeGreaterThan(0)
      expect(c.practiceMinutes, id).toBeGreaterThan(0)
    }
  })

  it('har en färdig modul 1 där alla kapitel kan godkännas', () => {
    const m1 = meta.modules[0]
    expect(m1.title).toBe('Kroppen söker balans')
    expect(m1.goals.length).toBeGreaterThan(0)
    for (const id of m1.chapters) {
      expect(meta.chapters[id].content, id).toBe('producerad')
      expect(meta.quizzes[id].questions, id).toBe(5)
    }
  })

  it('ger varje modul mål', () => {
    for (const m of meta.modules) expect(m.goals.length, m.id).toBeGreaterThan(0)
  })

  it('avvisar ett producerat kapitel utan Upptäck-uppgift', () => {
    const run = buildWith('kapitel/din-normala-variation.md', (s) => s.replace(/::: upptack[^\n]*\n[\s\S]*?\n:::\n/g, ''))
    expect(run).toThrow(/Upptäck/)
  })

  it('avvisar en Upptäck-uppgift utan tidsangivelse', () => {
    const run = buildWith('kapitel/din-normala-variation.md', (s) => s.replace('::: upptack 2 min Tre mätningar i rad', '::: upptack Tre mätningar i rad'))
    expect(run).toThrow(/saknar tidsangivelse/)
  })
})

describe('språk', () => {
  it('innehåller inga terapeutiska eller kommersiella formuleringar', () => {
    const run = buildWith('sidor/om.md', (s) => s + '\nHär kan du landa i kroppen.')
    expect(run).toThrow(/otillåten formulering "landa i kroppen"/)
    expect(FORBIDDEN_PHRASES).toContain('lugna din vagusnerv')
  })
})

describe('Markdown', () => {
  const md = createMarkdown((id) => (id === 'a2020' ? 'Andersson, 2020' : undefined))

  it('renderar källhänvisningar och samlar citerade källor', () => {
    const out = md.render('Text [@a2020, s. 4].')
    expect(out.html).toContain('href="#kalla-a2020"')
    expect(out.html).toContain('Andersson, 2020, s. 4')
    expect(out.cited).toEqual(['a2020'])
    expect(md.render('$\Delta y = d$').html).toContain('class="katex')
  })

  it('renderar illustrationer med alternativtext, bildtext och källa', () => {
    const out = md.render('::: figur\nbild: /illustrationer/x.webp\nalt: Reglerkrets\nbildtext: Figur 1\nkalla: Egen\n:::')
    expect(out.html).toContain('<figure class="figure">')
    expect(out.html).toContain('alt="Reglerkrets"')
    expect(out.html).toContain('Källa: Egen')
  })

  it('kräver alternativtext för illustrationer', () => {
    const out = md.render('::: figur\nbild: /x.webp\n:::')
    expect(out.errors).toContain('Illustration saknar bild eller alt')
  })

  it('räknar inte uppgifter, reflektion och fördjupning som obligatorisk teori', () => {
    const src = 'Ett två tre.\n\n::: upptack 3 min Prova\nfyra fem sex sju\n:::\n\n::: fordjupning Mer\nåtta nio\n:::\n'
    expect(wordCount(theoryText(src))).toBe(3)
    const out = md.render(src)
    expect(out.practice).toEqual([3])
    expect(out.html).toContain('<details class="fordjupning">')
    expect(out.html).toContain('Upptäck · 3 min')
  })

  it('ger rubriker id och märker breda tabeller', () => {
    const out = md.render('## Två ord\n\n| a | b | c | d |\n| - | - | - | - |\n| 1 | 2 | 3 | 4 |')
    expect(out.headings).toEqual([{ id: 'tva-ord', text: 'Två ord', level: 2 }])
    expect(out.html).toContain('class="table-stack"')
    expect(out.html).toContain('data-label="c"')
  })
})
