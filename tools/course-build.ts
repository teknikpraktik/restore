// Läser content/, validerar allt mot datamodellen och bygger CourseData.
// Körs av Vite-pluginen vid bygge och i dev, och direkt av testerna.
// Alla fel samlas och rapporteras på en gång; bygget avbryts om något är fel.

import fs from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'
import type {
  Chapter,
  ChapterContent,
  CourseBuild,
  Difficulty,
  Evidence,
  Exercise,
  ExerciseContent,
  ExerciseSection,
  ExerciseSystem,
  ExerciseType,
  Measurement,
  Module,
  Page,
  QuestionKind,
  Quiz,
  Source,
  SourceType,
} from '../src/course/types.ts'
import { createMarkdown, escapeHtml, slug, theoryText, wordCount } from './markdown.ts'

/** Alla svar måste vara rätta för att ett kapitel ska markeras som klart (sedan 3.0). */
export const PASS_THRESHOLD = 1
export const QUESTIONS_MIN = 5
export const QUESTIONS_MAX = 8

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const SYSTEMS: ExerciseSystem[] = [
  'Kardiovaskulära systemet',
  'Autonoma nervsystemet',
  'Termoreglering',
  'Andning',
  'Muskler och motorik',
  'Nervsystemet och perception',
  'Stressystem',
  'Sömn och dygnsrytm',
  'Kognition och uppmärksamhet',
  'Beteende',
]

export const TYPES: ExerciseType[] = [
  'Fysiologisk mätning',
  'Belastnings- och återhämtningsförsök',
  'Andningsövning',
  'Uppmärksamhetsövning',
  'Proprioceptivt experiment',
  'Interoceptiv observation',
  'Somatisk rörelseövning',
  'Motorisk kontroll och koordination',
  'Sömn- och beteendeexperiment',
  'Kognitiv övning',
  'Vardagsförsök',
]

export const DIFFICULTIES: Difficulty[] = ['grundläggande', 'medel', 'avancerad']

const SOURCE_TYPES: SourceType[] = [
  'lärobok',
  'klassisk originalartikel',
  'översiktsartikel',
  'systematisk översikt',
  'metaanalys',
  'randomiserad kontrollerad studie',
  'observationsstudie',
  'experimentell studie',
  'metodartikel',
  'konsensusdokument',
]

const QUESTION_KINDS: QuestionKind[] = [
  'situation',
  'forstaelse',
  'tillampning',
  'slutsats',
  'begrepp',
  'orsak-verkan',
  'berakning',
  'resonemang',
]

/** Läshastighet i ord per minut för uppskattning av teorins lästid. */
export const WORDS_PER_MINUTE = 150
/** Minst en Upptäck-uppgift per så här många minuters obligatorisk teori. */
export const THEORY_MINUTES_PER_TASK = 7

/** Standardstrukturen för övningar (avsnitt 4.1). Utrustning skrivs i frontmatter. */
export const EXERCISE_SECTIONS = [
  'Syfte',
  'Teoretisk bakgrund',
  'Utrustning',
  'Genomförande',
  'Observationer',
  'Förväntat resultat',
  'Tolkning',
  'Evidensläge',
  'Begränsningar',
  'Variationer',
] as const
const OPTIONAL_EXERCISE_SECTIONS = ['Säkerhet', 'Analysfrågor']

/** Formuleringar som inte hör hemma i kursen (avsnitt 1.1). Gäller allt innehåll. */
export const FORBIDDEN_PHRASES = [
  'landa i kroppen',
  'känn in',
  'släpp lagrad stress',
  'lagrad stress',
  'inre trygghet',
  'kroppen vet',
  'lugna din vagusnerv',
  'återställ ditt nervsystem',
  'balansera ditt nervsystem',
  'detox',
  'lagras i kroppen',
  'läker nervsystemet',
  'läka nervsystemet',
  'frigör stress',
  'stress frigörs',
]

type Raw = Record<string, any>

function splitFrontmatter(raw: string): { data: Raw; body: string } {
  const text = raw.replace(/\r\n/g, '\n')
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: text.trim() }
  return { data: (parseYaml(m[1]) as Raw) ?? {}, body: m[2].trim() }
}

const familyName = (author: string) => author.replace(/\s+[A-ZÅÄÖ][A-ZÅÄÖa-z-]*$/, '').trim()

export function shortCitation(authors: string[], year: number) {
  const fam = authors.map(familyName)
  const who = fam.length === 1 ? fam[0] : fam.length === 2 ? `${fam[0]} och ${fam[1]}` : `${fam[0]} m.fl.`
  return `${who}, ${year}`
}

function formatSource(s: Omit<Source, 'citation' | 'short' | 'chapters' | 'modules'>) {
  const authors = s.authors.join(', ')
  const t = escapeHtml(s.title)
  const parts: string[] = [`${escapeHtml(authors)} (${s.year}).`]
  if (s.type === 'lärobok') {
    parts.push(`<i>${t}</i>${s.edition ? ` (${escapeHtml(s.edition)})` : ''}.`)
    if (s.publisher) parts.push(`${escapeHtml(s.publisher)}.`)
    if (s.isbn) parts.push(`ISBN ${escapeHtml(s.isbn)}.`)
  } else {
    parts.push(`${t}.`)
    let where = `<i>${escapeHtml(s.container)}</i>`
    if (s.volume) where += `, ${escapeHtml(s.volume)}`
    if (s.issue) where += `(${escapeHtml(s.issue)})`
    if (s.pages) where += `, ${escapeHtml(s.pages)}`
    parts.push(`${where}.`)
  }
  if (s.doi) parts.push(`<a href="https://doi.org/${escapeHtml(s.doi)}" rel="noopener">doi:${escapeHtml(s.doi)}</a>`)
  else if (s.url) parts.push(`<a href="${escapeHtml(s.url)}" rel="noopener">${escapeHtml(s.url)}</a>`)
  return parts.join(' ')
}

export function buildCourse(root = 'content'): CourseBuild {
  const dir = path.resolve(root)
  const errors: string[] = []
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`)
  const read = (rel: string) => fs.readFileSync(path.join(dir, rel), 'utf8')
  const exists = (rel: string) => fs.existsSync(path.join(dir, rel))
  const list = (rel: string) => (exists(rel) ? fs.readdirSync(path.join(dir, rel)) : [])

  // Språkkontroll på alla källfiler.
  const checkLanguage = (rel: string, text: string) => {
    const lower = text.toLowerCase()
    for (const p of FORBIDDEN_PHRASES) if (lower.includes(p)) err(rel, `otillåten formulering "${p}"`)
  }

  // Källor
  const rawSources = (parseYaml(read('kallor.yaml')) as Raw).kallor as Raw[]
  checkLanguage('kallor.yaml', read('kallor.yaml'))
  const sources: Record<string, Source> = {}
  for (const r of rawSources) {
    const where = `kallor.yaml (${r.id})`
    if (!r.id || !/^[\w-]+$/.test(r.id)) err(where, 'ogiltigt id')
    if (sources[r.id]) err(where, 'id förekommer två gånger')
    if (!SOURCE_TYPES.includes(r.typ)) err(where, `okänd källtyp "${r.typ}"`)
    if (!Array.isArray(r.forfattare) || r.forfattare.length === 0) err(where, 'författare saknas')
    if (!Number.isInteger(r.ar)) err(where, 'år saknas')
    if (!r.titel) err(where, 'titel saknas')
    if (r.typ !== 'lärobok' && !r.tidskrift) err(where, 'tidskrift saknas')
    if (r.doi && !/^10\.\d{4,9}\/\S+$/.test(r.doi)) err(where, 'ogiltig DOI')
    if (!r.doi && !r.isbn && !r.url) err(where, 'DOI, ISBN eller länk krävs för att källan ska kunna kontrolleras')
    const verified = r.verifierad ? { date: String(r.verifierad.datum), method: String(r.verifierad.metod) } : undefined
    if (r.verifierad && (!r.verifierad.datum || !r.verifierad.metod)) err(where, 'verifiering måste ange datum och metod')
    const base = {
      id: r.id,
      type: r.typ,
      authors: r.forfattare,
      year: r.ar,
      title: r.titel,
      container: r.tidskrift ?? '',
      volume: r.volym != null ? String(r.volym) : undefined,
      issue: r.nummer != null ? String(r.nummer) : undefined,
      pages: r.sidor != null ? String(r.sidor) : undefined,
      edition: r.upplaga,
      publisher: r.forlag,
      doi: r.doi,
      isbn: r.isbn,
      url: r.url,
      verified,
      note: r.anmarkning,
    }
    sources[r.id] = {
      ...base,
      short: shortCitation(base.authors ?? ['?'], base.year),
      citation: formatSource(base),
      chapters: [],
      modules: [],
    }
  }

  const md = createMarkdown((id) => sources[id]?.short)
  const render = (where: string, src: string) => {
    const out = md.render(src)
    out.errors.forEach((e) => err(where, e))
    return out
  }
  const inline = (where: string, src: string) => {
    const out = md.renderInline(String(src ?? ''))
    out.errors.forEach((e) => err(where, e))
    return out.html
  }

  // Övningar
  const exercises: Record<string, Exercise> = {}
  const exerciseContent: Record<string, ExerciseContent> = {}
  for (const file of list('ovningar').filter((f) => f.endsWith('.md'))) {
    const rel = `ovningar/${file}`
    const raw = read(rel)
    checkLanguage(rel, raw)
    const { data: d, body } = splitFrontmatter(raw)
    const id = file.replace(/\.md$/, '')
    if (!ID.test(id)) err(rel, 'filnamnet måste vara ett giltigt id')
    if (!d.titel) err(rel, 'titel saknas')
    if (!d.sammanfattning) err(rel, 'sammanfattning saknas')
    const systems = (d.system ?? []) as ExerciseSystem[]
    if (!systems.length || systems.some((s) => !SYSTEMS.includes(s))) err(rel, 'okänt eller saknat fysiologiskt system')
    if (!TYPES.includes(d.typ)) err(rel, `okänd övningstyp "${d.typ}"`)
    if (!Number.isFinite(d.tid) || d.tid <= 0) err(rel, 'tid i minuter saknas')
    if (!DIFFICULTIES.includes(d.svarighetsgrad)) err(rel, 'okänd svårighetsgrad')
    if (!['etablerad', 'experimentell'].includes(d.evidens)) err(rel, 'evidensläge måste vara etablerad eller experimentell')
    if (!Array.isArray(d.utrustning) || !d.utrustning.length) err(rel, 'utrustning saknas (skriv "Ingen" om ingen behövs)')

    const parts = body.split(/^## /m).filter((s) => s.trim())
    const cited: string[] = []
    const sections: ExerciseSection[] = parts.map((p) => {
      const nl = p.indexOf('\n')
      const title = (nl === -1 ? p : p.slice(0, nl)).trim()
      const out = render(rel, nl === -1 ? '' : p.slice(nl + 1))
      out.cited.forEach((c) => cited.includes(c) || cited.push(c))
      return { id: slug(title), title, html: out.html }
    })
    const equipment = sectionsWithEquipment(sections, (d.utrustning ?? []) as string[])
    const titles = equipment.map((s) => s.title)
    const standard = titles.filter((t) => !OPTIONAL_EXERCISE_SECTIONS.includes(t))
    if (standard.join('|') !== EXERCISE_SECTIONS.join('|'))
      err(rel, `avsnitten måste vara ${EXERCISE_SECTIONS.join(', ')} i den ordningen (fick ${standard.join(', ')})`)
    for (const t of titles)
      if (!EXERCISE_SECTIONS.includes(t as any) && !OPTIONAL_EXERCISE_SECTIONS.includes(t)) err(rel, `okänt avsnitt "${t}"`)

    const measurements: Measurement[] = ((d.matvarden ?? []) as Raw[]).map((m) => ({
      id: m.id,
      label: m.etikett,
      unit: m.enhet,
      kind: m.typ === 'text' ? 'text' : 'number',
    }))
    const mids = new Set<string>()
    for (const m of measurements) {
      if (!m.id || !m.label) err(rel, 'mätvärde saknar id eller etikett')
      if (mids.has(m.id)) err(rel, `mätvärdet ${m.id} förekommer två gånger`)
      mids.add(m.id)
    }

    exercises[id] = {
      id,
      title: d.titel,
      summary: d.sammanfattning,
      systems,
      type: d.typ,
      minutes: d.tid,
      difficulty: d.svarighetsgrad,
      equipment: d.utrustning ?? [],
      evidence: d.evidens as Evidence,
      measurements,
      sources: cited,
      chapters: [],
    }
    exerciseContent[id] = { sections: equipment }
  }

  // Kursplan
  const planRaw = read('kursplan.yaml')
  checkLanguage('kursplan.yaml', planRaw)
  const plan = parseYaml(planRaw) as Raw
  const modules: Module[] = []
  const chapters: Record<string, Chapter> = {}
  const quizzes: Record<string, Quiz> = {}
  const chapterContent: Record<string, ChapterContent> = {}
  const order: string[] = []
  const moduleIds = new Set<string>()

  ;(plan.moduler as Raw[]).forEach((m, mi) => {
    const mwhere = `kursplan.yaml (modul ${m.id})`
    if (!ID.test(m.id ?? '')) err(mwhere, 'ogiltigt id')
    if (moduleIds.has(m.id)) err(mwhere, 'id förekommer två gånger')
    moduleIds.add(m.id)
    if (!m.titel || !m.beskrivning) err(mwhere, 'titel och beskrivning krävs')
    if (!Array.isArray(m.mal) || !m.mal.length) err(mwhere, 'modulen saknar mål (vad deltagaren ska förstå, upptäcka eller göra)')
    const kapitel = (m.kapitel ?? []) as Raw[]
    if (!kapitel.length) err(mwhere, 'modulen saknar underkapitel')
    const mod: Module = { id: m.id, number: mi + 1, title: m.titel, description: m.beskrivning, goals: m.mal ?? [], chapters: [] }

    kapitel.forEach((k, ki) => {
      const where = `kursplan.yaml (${k.id})`
      if (!ID.test(k.id ?? '')) err(where, 'ogiltigt id')
      if (chapters[k.id]) err(where, 'id förekommer två gånger')
      if (!k.titel || !k.beskrivning) err(where, 'titel och beskrivning krävs')
      if (!Array.isArray(k.larandemal) || !k.larandemal.length) err(where, 'lärandemål saknas')
      if (!Number.isFinite(k.studietid)) err(where, 'studietid saknas')
      if (!['producerad', 'under-produktion'].includes(k.innehall)) err(where, 'innehall måste vara producerad eller under-produktion')
      if (!['klar', 'ej-producerad'].includes(k.kontroll)) err(where, 'kontroll måste vara klar eller ej-producerad')
      for (const p of k.forkunskaper ?? [])
        if (!order.includes(p)) err(where, `förkunskapen ${p} finns inte eller kommer senare i kursen`)

      const chapter: Chapter = {
        id: k.id,
        number: `${mi + 1}.${ki + 1}`,
        moduleId: m.id,
        title: k.titel,
        description: k.beskrivning,
        prerequisites: k.forkunskaper ?? [],
        objectives: k.larandemal ?? [],
        minutes: k.studietid,
        content: k.innehall,
        quiz: k.kontroll,
        exercises: k.ovningar ?? [],
        headings: [],
        sources: [],
      }

      const theoryRel = `kapitel/${k.id}.md`
      if (chapter.content === 'producerad') {
        if (!exists(theoryRel)) err(where, `producerat kapitel saknar ${theoryRel}`)
        else {
          const src = read(theoryRel)
          checkLanguage(theoryRel, src)
          const out = render(theoryRel, splitFrontmatter(src).body)
          chapterContent[k.id] = { html: out.html }
          chapter.headings = out.headings
          chapter.sources = out.cited
          const body = splitFrontmatter(src).body
          chapter.theoryWords = wordCount(theoryText(body))
          chapter.readingMinutes = Math.max(1, Math.round(chapter.theoryWords / WORDS_PER_MINUTE))
          chapter.practiceMinutes = Math.round(out.practice.reduce((a, b) => a + b, 0))
          chapter.tasks = { upptack: out.practice.length, ...out.counts }
          if (!out.headings.length) err(theoryRel, 'teorin saknar rubriker')
          // Den pedagogiska mallen: Förstå, Upptäck, Reflektera, Tillämpa.
          if (!out.practice.length) err(theoryRel, 'kapitlet saknar Upptäck-uppgift')
          if (!out.counts.reflektera) err(theoryRel, 'kapitlet saknar Reflektera-ruta')
          if (!out.counts.tillampa) err(theoryRel, 'kapitlet saknar Tillämpa-ruta')
          const needed = Math.ceil(chapter.readingMinutes / THEORY_MINUTES_PER_TASK)
          if (out.practice.length < needed)
            err(theoryRel, `${chapter.readingMinutes} minuters teori kräver minst ${needed} Upptäck-uppgifter (har ${out.practice.length})`)
        }
      } else {
        if (exists(theoryRel)) err(where, 'kapitel under produktion får inte ha en teorifil')
        if (chapter.exercises.length) err(where, 'kapitel under produktion får inte ha övningar')
        if (chapter.quiz === 'klar') err(where, 'kapitel under produktion kan inte ha en färdig kunskapskontroll')
      }

      for (const e of chapter.exercises) {
        if (!exercises[e]) err(where, `övningen ${e} finns inte`)
        else exercises[e].chapters.push(k.id)
      }

      const quizRel = `kontroller/${k.id}.yaml`
      if (chapter.quiz === 'klar') {
        if (!exists(quizRel)) err(where, `färdig kontroll saknar ${quizRel}`)
        else {
          const qsrc = read(quizRel)
          checkLanguage(quizRel, qsrc)
          quizzes[k.id] = buildQuiz(k.id, parseYaml(qsrc) as Raw, quizRel, err, inline)
        }
      } else if (exists(quizRel)) err(where, 'kontrollfil finns men kontrollen är inte markerad som klar')

      // För producerade kapitel räknas studietiden fram ur innehållet, så att delarna summerar:
      // läsning + Upptäck-uppgifter + reflektion och självtest (en minut per reflektionsruta och fråga).
      if (chapter.content === 'producerad' && chapter.readingMinutes != null) {
        chapter.reviewMinutes = (chapter.tasks?.reflektera ?? 0) + (quizzes[k.id]?.questions.length ?? 0)
        chapter.minutes = chapter.readingMinutes + (chapter.practiceMinutes ?? 0) + chapter.reviewMinutes
      }

      chapters[k.id] = chapter
      mod.chapters.push(k.id)
      order.push(k.id)
    })
    modules.push(mod)
  })

  // Källor knyts till kapitel och moduler genom citeringarna i teori och övningar.
  const attach = (sourceId: string, chapterId: string) => {
    const s = sources[sourceId]
    if (!s) return
    if (!s.chapters.includes(chapterId)) s.chapters.push(chapterId)
    const mid = chapters[chapterId].moduleId
    if (!s.modules.includes(mid)) s.modules.push(mid)
  }
  for (const id of order) {
    const c = chapters[id]
    c.sources.forEach((s) => attach(s, id))
    for (const e of c.exercises) exercises[e]?.sources.forEach((s) => attach(s, id))
  }
  // Källor som inte citeras i den publicerade texten finns kvar som underlag (Restore 3.0).
  for (const e of Object.values(exercises)) if (!e.chapters.length) err(`ovningar/${e.id}.md`, 'övningen används inte i något kapitel')

  // Sidor
  const pages: Record<string, Page> = {}
  for (const file of list('sidor').filter((f) => f.endsWith('.md'))) {
    const rel = `sidor/${file}`
    const raw = read(rel)
    checkLanguage(rel, raw)
    const { data, body } = splitFrontmatter(raw)
    const out = render(rel, body)
    const id = file.replace(/\.md$/, '')
    pages[id] = { id, title: data.titel ?? id, html: out.html, headings: out.headings }
  }

  if (errors.length) throw new Error(`Kursinnehållet innehåller fel:\n  ${errors.join('\n  ')}`)
  for (const [id, q] of Object.entries(quizzes)) chapterContent[id].quiz = q
  const quizMeta = Object.fromEntries(
    Object.entries(quizzes).map(([id, q]) => [id, { questions: q.questions.length, passThreshold: q.passThreshold }]),
  )
  return {
    meta: { modules, chapters, order, quizzes: quizMeta, exercises, sources, pages },
    chapterContent,
    exerciseContent,
  }
}

/** Lägger in avsnittet Utrustning (från frontmatter) efter Teoretisk bakgrund. */
function sectionsWithEquipment(sections: ExerciseSection[], equipment: string[]): ExerciseSection[] {
  if (sections.some((s) => s.title === 'Utrustning')) return sections
  const html = `<ul>${equipment.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`
  const at = sections.findIndex((s) => s.title === 'Teoretisk bakgrund')
  const out = [...sections]
  out.splice(at + 1, 0, { id: 'utrustning', title: 'Utrustning', html })
  return out
}

function buildQuiz(
  chapterId: string,
  raw: Raw,
  rel: string,
  err: (where: string, msg: string) => void,
  inline: (where: string, src: string) => string,
): Quiz {
  const fragor = (raw?.fragor ?? []) as Raw[]
  if (fragor.length < QUESTIONS_MIN || fragor.length > QUESTIONS_MAX)
    err(rel, `en kontroll ska ha ${QUESTIONS_MIN}–${QUESTIONS_MAX} frågor (har ${fragor.length})`)
  const ids = new Set<string>()
  const questions = fragor.map((q, i) => {
    const where = `${rel} (fråga ${i + 1})`
    if (!q.id || ids.has(q.id)) err(where, 'id saknas eller förekommer två gånger')
    ids.add(q.id)
    if (!QUESTION_KINDS.includes(q.typ)) err(where, `okänd frågetyp "${q.typ}"`)
    const alt = (q.alternativ ?? []) as string[]
    if (alt.length < 3 || alt.length > 5) err(where, 'en fråga ska ha 3–5 alternativ')
    if (new Set(alt.map((a) => String(a).trim().toLowerCase())).size !== alt.length) err(where, 'två alternativ är lika')
    const ratt = (Array.isArray(q.ratt) ? q.ratt : [q.ratt]) as number[]
    if (!ratt.length || ratt.some((r) => !Number.isInteger(r) || r < 1 || r > alt.length) || new Set(ratt).size !== ratt.length)
      err(where, 'ratt ska vara numret (1, 2, …) på rätt alternativ, eller en lista med nummer')
    if (ratt.length >= alt.length) err(where, 'minst ett alternativ måste vara fel')
    if (!q.fraga || !q.forklaring) err(where, 'fråga och förklaring krävs')
    return {
      id: q.id,
      kind: q.typ,
      prompt: inline(where, q.fraga),
      options: alt.map((a) => inline(where, a)),
      correct: ratt.map((r) => r - 1).sort((a, b) => a - b),
      multiple: Array.isArray(q.ratt),
      explanation: inline(where, q.forklaring),
    }
  })
  return { chapterId, passThreshold: PASS_THRESHOLD, questions }
}
