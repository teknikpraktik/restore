import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  type Chapter,
  chapterHref,
  chapterSources,
  EVIDENCE_LABEL,
  exerciseHref,
  formatMinutes,
  getChapter,
  getExercise,
  getModule,
  getQuizMeta,
  moduleHref,
  neighbours,
  useChapterContent,
} from '../course'
import { setLastChapter, useProgress } from '../progress/store'
import { CheckMark, formatDate, Loading, NotFoundContent, PageTitle, Prose, useTitle } from '../ui/common'
import { Quiz } from '../ui/Quiz'

type TocItem = { id: string; text: string; level: 2 | 3 }

export function ChapterPage() {
  const { chapterId } = useParams()
  const chapter = getChapter(chapterId)
  if (!chapter)
    return (
      <NotFoundContent title="Underkapitlet finns inte">
        <p>
          Det finns inget underkapitel med den här adressen. Kursen fick en ny struktur i Restore 2.0, och adresser från
          den tidigare versionen leder inte längre till innehåll.
        </p>
      </NotFoundContent>
    )
  return <ChapterView key={chapter.id} chapter={chapter} />
}

function ChapterView({ chapter }: { chapter: Chapter }) {
  const module = getModule(chapter.moduleId)!
  const progress = useProgress()
  const produced = chapter.content === 'producerad'
  useTitle(`${chapter.number} ${chapter.title}`)

  useEffect(() => {
    if (produced) setLastChapter(chapter.id)
  }, [chapter.id, produced])

  const passedAt = progress.chapters[chapter.id]?.passedAt
  const quiz = chapter.quiz === 'klar' ? getQuizMeta(chapter.id) : undefined
  const content = useChapterContent(produced ? chapter.id : undefined)
  const exercises = chapter.exercises.map(getExercise).filter((e) => !!e)
  const sources = chapterSources(chapter)
  const exercisesHeading = exercises.length === 1 ? 'Längre övning' : 'Längre övningar'

  const toc: TocItem[] = produced
    ? [
        { id: 'larandemal', text: 'Lärandemål', level: 2 },
        ...chapter.headings,
        ...(exercises.length ? [{ id: 'ovningar', text: exercisesHeading, level: 2 as const }] : []),
        ...(quiz ? [{ id: 'sjalvtest', text: 'Självtest', level: 2 as const }] : []),
        ...(sources.length ? [{ id: 'referenser', text: 'Referenser', level: 2 as const }] : []),
      ]
    : []

  return (
    <div className={`chapter ${toc.length ? 'has-toc' : ''}`}>
      <article className="chapter-article">
        <PageTitle
          eyebrow={
            <Link to={moduleHref(module.id)}>
              Modul {module.number} · {module.title}
            </Link>
          }
        >
          <span className="chapter-number">{chapter.number}</span> {chapter.title}
        </PageTitle>
        <p className="lead">{chapter.description}</p>

        {produced ? (
          <p className="chapter-meta">
            Läsning cirka {chapter.readingMinutes ?? 1} min
            {chapter.practiceMinutes ? ` · Övningar cirka ${chapter.practiceMinutes} min` : ''}
            {chapter.reviewMinutes ? ` · Reflektion och självtest cirka ${chapter.reviewMinutes} min` : ''}
            {` · Totalt cirka ${formatMinutes(chapter.minutes)}`}
          </p>
        ) : (
          <div className="notice" role="note">
            <p className="notice-title">Innehållet är under produktion</p>
            <p>
              Underkapitlet ingår i kursplanen men är ännu inte skrivet. Här visas ämnesbeskrivningen och de planerade
              lärandemålen. Självtest och övningar publiceras när innehållet är färdigt och granskat.
            </p>
          </div>
        )}

        {passedAt && (
          <p className="chapter-passed">
            <CheckMark label="Godkänd" /> Självtestet godkänt {formatDate(passedAt)}
          </p>
        )}

        {toc.length > 0 && <MobileToc items={toc} />}

        <section aria-labelledby="larandemal" className="chapter-section">
          <h2 id="larandemal">{produced ? 'Lärandemål' : 'Planerade lärandemål'}</h2>
          <p>Efter kapitlet ska du kunna:</p>
          <ol className="objectives">
            {chapter.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
        </section>

        {produced && <Loading state={content}>{(c) => <Prose html={c.html} className="theory" />}</Loading>}

        {exercises.length > 0 && (
          <section aria-labelledby="ovningar" className="chapter-section">
            <h2 id="ovningar">{exercisesHeading}</h2>
            <p>
              {exercises.length === 1
                ? 'Den här övningen tar lite längre tid och kan göras senare, till exempel under veckan. Den finns också i övningsbiblioteket, där du kan anteckna vad du märkte.'
                : 'De här övningarna tar lite längre tid och kan göras senare, till exempel under veckan. De finns också i övningsbiblioteket, där du kan anteckna vad du märkte.'}
            </p>
            <ol className="exercise-list">
              {exercises.map((e) => {
                const done = progress.exercises[e.id]?.length ?? 0
                return (
                  <li key={e.id} className="exercise-item">
                    <h3>
                      <Link to={`${exerciseHref(e.id)}?kapitel=${chapter.id}`}>{e.title}</Link>
                    </h3>
                    <p>{e.summary}</p>
                    <p className="meta">
                      {e.type} · cirka {e.minutes} min · {e.difficulty} · {EVIDENCE_LABEL[e.evidence]}
                      {done > 0 && ` · Registrerad ${done} ${done === 1 ? 'gång' : 'gånger'}`}
                    </p>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        {quiz && (
          <section aria-labelledby="sjalvtest" className="chapter-section">
            <h2 id="sjalvtest">Självtest</h2>
            <Loading state={content}>
              {(c) => c.quiz && <Quiz quiz={c.quiz} theoryAnchor={chapter.headings[0]?.id ?? 'larandemal'} />}
            </Loading>
          </section>
        )}

        {sources.length > 0 && (
          <section aria-labelledby="referenser" className="chapter-section">
            <h2 id="referenser">Referenser</h2>
            <ol className="references">
              {sources.map((s) => (
                <li key={s.id} id={`kalla-${s.id}`}>
                  <span dangerouslySetInnerHTML={{ __html: s.citation }} />{' '}
                  <span className="reference-type">
                    {s.type}
                    {s.verified ? '' : ' · overifierad'}
                  </span>
                </li>
              ))}
            </ol>
            <p className="small">
              Uppgifter om hur varje källa har kontrollerats finns i <Link to="/kallor">källförteckningen</Link>.
            </p>
          </section>
        )}

        <ChapterPager id={chapter.id} />
      </article>
      {toc.length > 0 && <Toc items={toc} />}
    </div>
  )
}

function ChapterPager({ id }: { id: string }) {
  const { prev, next } = neighbours(id)
  return (
    <nav className="pager" aria-label="Föregående och nästa underkapitel">
      {prev ? (
        <Link to={chapterHref(prev.id)} className="pager-prev">
          <span className="pager-label">Föregående</span>
          <span>
            {prev.number} {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={chapterHref(next.id)} className="pager-next">
          <span className="pager-label">Nästa</span>
          <span>
            {next.number} {next.title}
          </span>
        </Link>
      )}
    </nav>
  )
}

/** Markerar den rubrik som senast passerats i läsytan. */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | undefined>()
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const obs = new IntersectionObserver(
      () => {
        const passed = els.filter((e) => e.getBoundingClientRect().top < 120)
        setActive(passed.length ? passed[passed.length - 1].id : els[0]?.id)
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] },
    )
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [ids.join('|')])
  return active
}

function Toc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((i) => i.id))
  return (
    <aside className="toc" aria-label="Innehåll i underkapitlet">
      <p className="toc-title">I kapitlet</p>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={`toc-l${i.level}`}>
            <a href={`#${i.id}`} aria-current={active === i.id ? 'location' : undefined}>
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function MobileToc({ items }: { items: TocItem[] }) {
  return (
    <details className="toc-mobile">
      <summary>Innehåll i kapitlet</summary>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={`toc-l${i.level}`}>
            <a href={`#${i.id}`}>{i.text}</a>
          </li>
        ))}
      </ul>
    </details>
  )
}
