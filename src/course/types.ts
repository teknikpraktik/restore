// Datamodell för kursen. Samma typer används av byggsteget (tools/course-build.ts),
// som läser och validerar content/, och av gränssnittet.

export type ContentStatus = 'producerad' | 'under-produktion'
export type QuizStatus = 'klar' | 'ej-producerad'
export type Evidence = 'etablerad' | 'experimentell'

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  etablerad: 'Etablerad kunskap',
  experimentell: 'Experimentell metod',
}

export type Heading = { id: string; text: string; level: 2 | 3 }

export type Module = {
  id: string
  number: number
  title: string
  description: string
  chapters: string[]
}

export type Chapter = {
  id: string
  /** Visningsnummer, till exempel "1.1". Räknas fram från ordningen i kursplanen. */
  number: string
  moduleId: string
  title: string
  description: string
  prerequisites: string[]
  objectives: string[]
  /** Ungefärlig studietid i minuter enligt kursplanen. */
  minutes: number
  content: ContentStatus
  quiz: QuizStatus
  exercises: string[]
  headings: Heading[]
  /** Källor som citeras i teorin, i den ordning de först förekommer. */
  sources: string[]
  /** Läsning av teorin i minuter, räknat på ordantal. */
  readingMinutes?: number
}

export type QuestionKind = 'begrepp' | 'orsak-verkan' | 'tillampning' | 'berakning' | 'resonemang'

export const QUESTION_KIND_LABEL: Record<QuestionKind, string> = {
  begrepp: 'Begreppsfråga',
  'orsak-verkan': 'Orsak och verkan',
  tillampning: 'Tillämpning',
  berakning: 'Beräkning',
  resonemang: 'Fysiologiskt resonemang',
}

export type QuizQuestion = {
  id: string
  kind: QuestionKind
  /** Frågetext som HTML (kan innehålla formler). */
  prompt: string
  options: string[]
  /** Index för rätt alternativ. */
  correct: number
  explanation: string
}

export type Quiz = {
  chapterId: string
  /** Andel rätt som krävs för godkänt. */
  passThreshold: number
  questions: QuizQuestion[]
}

export type ExerciseSystem =
  | 'Kardiovaskulära systemet'
  | 'Autonoma nervsystemet'
  | 'Termoreglering'
  | 'Andning'
  | 'Muskler och motorik'
  | 'Nervsystemet och perception'
  | 'Stressystem'
  | 'Sömn och dygnsrytm'
  | 'Kognition och uppmärksamhet'
  | 'Beteende'

export type ExerciseType =
  | 'Fysiologisk mätning'
  | 'Belastnings- och återhämtningsförsök'
  | 'Andningsövning'
  | 'Uppmärksamhetsövning'
  | 'Proprioceptivt experiment'
  | 'Interoceptiv observation'
  | 'Somatisk rörelseövning'
  | 'Motorisk kontroll och koordination'
  | 'Sömn- och beteendeexperiment'
  | 'Kognitiv övning'
  | 'Vardagsförsök'

export type Difficulty = 'grundläggande' | 'medel' | 'avancerad'

export type Measurement = {
  id: string
  label: string
  unit?: string
  kind: 'number' | 'text'
}

export type ExerciseSection = { id: string; title: string; html: string }

export type Exercise = {
  id: string
  title: string
  summary: string
  systems: ExerciseSystem[]
  type: ExerciseType
  minutes: number
  difficulty: Difficulty
  equipment: string[]
  evidence: Evidence
  measurements: Measurement[]
  sources: string[]
  /** Kapitel som använder övningen. Räknas fram från kursplanen. */
  chapters: string[]
}

export type SourceType =
  | 'lärobok'
  | 'klassisk originalartikel'
  | 'översiktsartikel'
  | 'systematisk översikt'
  | 'metaanalys'
  | 'randomiserad kontrollerad studie'
  | 'observationsstudie'
  | 'experimentell studie'
  | 'metodartikel'
  | 'konsensusdokument'

export type Verification = { date: string; method: string }

export type Source = {
  id: string
  type: SourceType
  authors: string[]
  year: number
  title: string
  container: string
  volume?: string
  issue?: string
  pages?: string
  edition?: string
  publisher?: string
  doi?: string
  isbn?: string
  url?: string
  /** Hur och när uppgifterna kontrollerades. Saknas för overifierade källor. */
  verified?: Verification
  note?: string
  /** "Cannon, 1929" */
  short: string
  /** Formaterad referens som HTML. */
  citation: string
  chapters: string[]
  modules: string[]
}

export type Page = { id: string; title: string; html: string; headings: Heading[] }

/** Det som laddas när ett producerat kapitel öppnas. */
export type ChapterContent = { html: string; quiz?: Quiz }
/** Det som laddas när en övning öppnas. */
export type ExerciseContent = { sections: ExerciseSection[] }

/** Kursens metadata. Ingår i huvudpaketet och räcker för meny, översikter och progression. */
export type CourseMeta = {
  modules: Module[]
  chapters: Record<string, Chapter>
  /** Alla kapitel-id i kursordning. */
  order: string[]
  /** Antal frågor och godkäntgräns för varje färdig kunskapskontroll. */
  quizzes: Record<string, { questions: number; passThreshold: number }>
  exercises: Record<string, Exercise>
  sources: Record<string, Source>
  pages: Record<string, Page>
}

/** Hela kursen efter bygget: metadata och det innehåll som laddas vid behov. */
export type CourseBuild = {
  meta: CourseMeta
  chapterContent: Record<string, ChapterContent>
  exerciseContent: Record<string, ExerciseContent>
}
