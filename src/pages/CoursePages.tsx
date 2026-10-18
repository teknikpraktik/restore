import { Link, useParams } from 'react-router-dom'
import {
  chapterHref,
  course,
  formatMinutes,
  getModule,
  moduleChapters,
  moduleHref,
  modules,
  producedChapters,
  chapterOrder,
} from '../course'
import { getState, isPassed, useProgress } from '../progress/store'
import { CheckMark, NotFoundContent, PageTitle, Prose, useTitle } from '../ui/common'

/** Var användaren bör fortsätta: senast öppnade kapitel, annars första ej godkända producerade kapitel. */
export function continueTarget(state = getState()) {
  const produced = producedChapters()
  const notPassed = produced.find((c) => !isPassed(state, c.id))
  if (state.lastChapter && course.chapters[state.lastChapter]) {
    const last = course.chapters[state.lastChapter]
    if (!isPassed(state, last.id) || !notPassed) return last
  }
  return notPassed ?? produced[0] ?? course.chapters[chapterOrder[0]]
}

export function HomePage() {
  useTitle('Restore')
  const progress = useProgress()
  const started = Object.keys(progress.chapters).length > 0 || !!progress.lastChapter
  const target = continueTarget(progress)
  const page = course.pages.start
  const total = chapterOrder.length
  const produced = producedChapters()

  return (
    <div className="page home">
      <header className="home-head">
        <h1 tabIndex={-1}>Restore</h1>
        <p className="home-tagline">Ett praktiskt och vetenskapligt förankrat program för stress och återhämtning.</p>
        <p>
          <Link to={chapterHref(target.id)} className="button button-large">
            {started ? 'Fortsätt utbildningen' : 'Börja utbildningen'}
          </Link>
          {started && (
            <span className="home-continue">
              {' '}
              {target.number} {target.title}
            </span>
          )}
        </p>
      </header>

      <Prose html={page.html} />

      <section aria-labelledby="kunskapsomraden" className="home-modules">
        <h2 id="kunskapsomraden">Kursens moduler</h2>
        <p>
          Kursen består av {modules.length} moduler med sammanlagt {total} underkapitel, från hur kroppen
          fungerar till en personlig plan för vardagen.
        </p>
        <ol className="module-list">
          {modules.map((m) => (
            <li key={m.id}>
              <Link to={moduleHref(m.id)} className="module-list-title">
                <span className="module-list-number">{m.number}</span>
                {m.title}
              </Link>
              <p>{m.description}</p>
              <p className="meta">{m.chapters.length} underkapitel</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="status" className="home-status">
        <h2 id="status">Innehållets status</h2>
        <p>
          Hela kursstrukturen är publicerad och alla underkapitel kan öppnas. Färdigproducerat innehåll med teori,
          övningar och självtest finns i dag för {produced.length} av {total} underkapitel:
        </p>
        <ul>
          {produced.map((c) => (
            <li key={c.id}>
              <Link to={chapterHref(c.id)}>
                {c.number} {c.title}
              </Link>
            </li>
          ))}
        </ul>
        <p>Övriga underkapitel visar ämnesbeskrivning och planerade lärandemål och är märkta som under produktion.</p>
      </section>
    </div>
  )
}

export function CourseOverviewPage() {
  useTitle('Kursens innehåll')
  const progress = useProgress()
  return (
    <div className="page">
      <PageTitle>Kursens innehåll</PageTitle>
      <p className="lead">
        {modules.length} moduler och {chapterOrder.length} underkapitel. Underkapitel med grön bock har godkänd
        självtest. Underkapitel i grå text är under produktion.
      </p>
      {modules.map((m) => (
        <section key={m.id} className="overview-module" aria-labelledby={`modul-${m.id}`}>
          <h2 id={`modul-${m.id}`}>
            <Link to={moduleHref(m.id)}>
              <span className="module-list-number">{m.number}</span>
              {m.title}
            </Link>
          </h2>
          <p>{m.description}</p>
          <ChapterTable chapters={moduleChapters(m)} passed={(id) => isPassed(progress, id)} />
        </section>
      ))}
    </div>
  )
}

function ChapterTable({
  chapters,
  passed,
  detailed = false,
}: {
  chapters: ReturnType<typeof moduleChapters>
  passed: (id: string) => boolean
  detailed?: boolean
}) {
  return (
    <ol className="chapter-table">
      {chapters.map((c) => (
        <li key={c.id} className={c.content === 'producerad' ? '' : 'is-planned'}>
          <span className="chapter-table-number">{c.number}</span>
          <span className="chapter-table-main">
            <Link to={chapterHref(c.id)}>{c.title}</Link>
            {detailed && <span className="chapter-table-desc">{c.description}</span>}
          </span>
          <span className="chapter-table-status">
            {passed(c.id) ? (
              <>
                <CheckMark label="Godkänd" /> Godkänd
              </>
            ) : c.content === 'producerad' ? (
              `cirka ${formatMinutes(c.minutes)}`
            ) : (
              'Under produktion'
            )}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function ModulePage() {
  const { moduleId } = useParams()
  const m = getModule(moduleId)
  const progress = useProgress()
  useTitle(m ? `Modul ${m.number} ${m.title}` : 'Modulen finns inte')
  if (!m) return <NotFoundContent title="Modulen finns inte" />
  const chapters = moduleChapters(m)
  const produced = chapters.filter((c) => c.content === 'producerad').length
  const passed = chapters.filter((c) => isPassed(progress, c.id)).length
  return (
    <div className="page">
      <PageTitle eyebrow={`Modul ${m.number} av ${modules.length}`}>{m.title}</PageTitle>
      <p className="lead">{m.description}</p>
      <p className="chapter-meta">
        {chapters.length} underkapitel · {produced} färdigproducerade · {passed} klara
      </p>
      {m.goals.length > 0 && (
        <>
          <h2>Efter modulen</h2>
          <ul className="objectives">
            {m.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </>
      )}
      <h2>Underkapitel</h2>
      <ChapterTable chapters={chapters} passed={(id) => isPassed(progress, id)} detailed />
    </div>
  )
}
