import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  allChapters,
  chapterHref,
  course,
  exerciseHref,
  getChapter,
  getExercise,
  moduleChapters,
  modules,
  producedChapters,
  sortSources,
} from '../course'
import { exportProgress, importProgress, isPassed, resetProgress, useProgress } from '../progress/store'
import { CheckMark, formatDate, PageTitle, Prose, useTitle } from '../ui/common'

export function ProgressPage() {
  useTitle('Min progression')
  const progress = useProgress()
  const chapters = allChapters()
  const produced = producedChapters()
  const passed = chapters.filter((c) => isPassed(progress, c.id))
  const attempts = Object.entries(progress.chapters)
    .flatMap(([id, c]) => c.attempts.map((a) => ({ ...a, id })))
    .sort((a, b) => b.at.localeCompare(a.at))
  const exerciseLogs = Object.entries(progress.exercises).filter(([, l]) => l.length > 0)
  const registrations = exerciseLogs.reduce((n, [, l]) => n + l.length, 0)

  return (
    <div className="page">
      <PageTitle>Min progression</PageTitle>
      <p className="lead">
        En översikt över godkända underkapitel, genomförda kunskapskontroller och registrerade laborationer.
        Uppgifterna finns bara i den här webbläsaren.
      </p>

      <dl className="summary">
        <div>
          <dt>Godkända underkapitel</dt>
          <dd>
            {passed.length} av {produced.length} färdigproducerade ({chapters.length} i kursplanen)
          </dd>
        </div>
        <div>
          <dt>Genomförda kunskapskontroller</dt>
          <dd>{attempts.length} försök</dd>
        </div>
        <div>
          <dt>Registrerade laborationer</dt>
          <dd>
            {registrations} genomföranden av {exerciseLogs.length} olika övningar
          </dd>
        </div>
        <div>
          <dt>Total progression</dt>
          <dd>
            {Math.round((passed.length / chapters.length) * 100)} % av hela kursen ({passed.length} av {chapters.length}{' '}
            underkapitel)
          </dd>
        </div>
      </dl>

      <h2>Per modul</h2>
      <div className="table-wrap">
        <table className="progress-table">
          <thead>
            <tr>
              <th scope="col">Modul</th>
              <th scope="col">Underkapitel</th>
              <th scope="col">Producerade</th>
              <th scope="col">Godkända</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const cs = moduleChapters(m)
              return (
                <tr key={m.id}>
                  <td>
                    {m.number}. {m.title}
                  </td>
                  <td>{cs.length}</td>
                  <td>{cs.filter((c) => c.content === 'producerad').length}</td>
                  <td>{cs.filter((c) => isPassed(progress, c.id)).length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2>Godkända underkapitel</h2>
      {passed.length ? (
        <ul className="plain-list">
          {passed.map((c) => (
            <li key={c.id}>
              <CheckMark label="Godkänd" />{' '}
              <Link to={chapterHref(c.id)}>
                {c.number} {c.title}
              </Link>{' '}
              <span className="meta">godkänd {formatDate(progress.chapters[c.id].passedAt!)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga underkapitel är godkända ännu.</p>
      )}

      <h2>Genomförda kunskapskontroller</h2>
      {attempts.length ? (
        <ul className="plain-list">
          {attempts.map((a) => {
            const c = getChapter(a.id)
            return (
              <li key={`${a.id}-${a.at}`}>
                {formatDate(a.at, true)}: {c ? `${c.number} ${c.title}` : a.id}, {a.correct} av {a.total} rätt,{' '}
                {a.passed ? 'godkänt' : 'inte godkänt'}
              </li>
            )
          })}
        </ul>
      ) : (
        <p>Inga kunskapskontroller genomförda ännu.</p>
      )}

      <h2>Registrerade laborationer</h2>
      <p className="small">
        Registrerade laborationer redovisas separat. En godkänd kunskapskontroll visar förståelse av teorin, inte att
        en praktisk färdighet behärskas.
      </p>
      {exerciseLogs.length ? (
        <ul className="plain-list">
          {exerciseLogs.map(([id, list]) => {
            const e = getExercise(id)
            return (
              <li key={id}>
                {e ? <Link to={exerciseHref(id)}>{e.title}</Link> : id}: {list.length}{' '}
                {list.length === 1 ? 'gång' : 'gånger'}, senast {formatDate(list[list.length - 1].at)}
              </li>
            )
          })}
        </ul>
      ) : (
        <p>Inga laborationer registrerade ännu.</p>
      )}

      <p>
        <Link to="/installningar">Exportera, läs in eller återställ progressionen</Link>
      </p>
    </div>
  )
}

export function SourcesPage() {
  useTitle('Källor')
  const [q, setQ] = useState('')
  const all = Object.values(course.sources)
  const needle = q.trim().toLowerCase()
  const match = (s: (typeof all)[number]) =>
    !needle ||
    [s.title, s.authors.join(' '), s.container, String(s.year), s.doi ?? '', s.type].join(' ').toLowerCase().includes(needle)
  const unverified = all.filter((s) => !s.verified).length

  return (
    <div className="page">
      <PageTitle>Källor</PageTitle>
      <p className="lead">
        Samtliga källor som citeras i kursens teori och laborationer, ordnade per modul. Varje källa har DOI, ISBN eller
        länk så att den kan kontrolleras.
      </p>
      <p>
        {all.length} källor. {unverified === 0 ? 'Alla källor har kontrollerats.' : `${unverified} källor är overifierade.`}{' '}
        För varje källa anges när och hur de bibliografiska uppgifterna kontrollerades. Att en referens är kontrollerad
        betyder att den finns och att uppgifterna stämmer, inte att alla studiens slutsatser är okontroversiella.
      </p>
      <label className="search">
        <span>Sök i källförteckningen</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Författare, titel, år eller DOI" />
      </label>

      {modules.map((m) => {
        const list = sortSources(all.filter((s) => s.modules.includes(m.id) && match(s)))
        if (!list.length) return null
        return (
          <section key={m.id} aria-labelledby={`kallor-${m.id}`} className="sources-module">
            <h2 id={`kallor-${m.id}`}>
              Modul {m.number}. {m.title}
            </h2>
            <ol className="references">
              {list.map((s) => (
                <li key={s.id} id={`kalla-${s.id}`}>
                  <span dangerouslySetInnerHTML={{ __html: s.citation }} />
                  <span className="reference-meta">
                    {s.type} · Används i{' '}
                    {s.chapters.map((c, i) => (
                      <span key={c}>
                        {i > 0 && ', '}
                        <Link to={chapterHref(c)}>{getChapter(c)!.number}</Link>
                      </span>
                    ))}
                  </span>
                  <span className="reference-meta">
                    {s.verified ? `Kontrollerad ${s.verified.date}: ${s.verified.method}` : 'Overifierad källa.'}
                    {s.note ? ` ${s.note}` : ''}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )
      })}
      {needle && !all.some(match) && <p>Inga källor matchar sökningen.</p>}
    </div>
  )
}

export function AboutPage() {
  const page = course.pages.om
  useTitle(page.title)
  return (
    <div className="page narrow">
      <PageTitle>{page.title}</PageTitle>
      <Prose html={page.html} />
    </div>
  )
}

export function SettingsPage() {
  useTitle('Inställningar')
  const progress = useProgress()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const hasData = Object.keys(progress.chapters).length > 0 || Object.keys(progress.exercises).length > 0

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `restore-progression-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Progressionen har exporterats till en fil.')
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      importProgress(await file.text())
      setMessage('Progressionen har lästs in från filen.')
    } catch (err) {
      setMessage(`Filen kunde inte läsas in: ${(err as Error).message}. Ingenting har ändrats.`)
    }
  }

  return (
    <div className="page narrow">
      <PageTitle>Inställningar</PageTitle>
      <h2>Lokal lagring</h2>
      <p>
        Progressionen, kunskapskontrollernas resultat och laborationsprotokollen sparas bara i den här webbläsaren på den
        här enheten. Ingenting skickas till någon server. Data synkroniseras inte mellan enheter eller webbläsare och
        försvinner om webbläsarens webbplatsdata rensas.
      </p>

      <h2>Exportera och läs in</h2>
      <p>
        Exportera progressionen till en fil för att spara en säkerhetskopia eller flytta den till en annan enhet. När du
        läser in en fil ersätts den nuvarande progressionen i den här webbläsaren.
      </p>
      <p className="button-row">
        <button type="button" className="button" onClick={download}>
          Exportera progression
        </button>
        <button type="button" className="button button-secondary" onClick={() => fileInput.current?.click()}>
          Läs in från fil
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          className="visually-hidden"
          aria-label="Välj exportfil"
          tabIndex={-1}
        />
      </p>

      <h2>Återställ progressionen</h2>
      <p>
        Återställningen tar bort alla godkända kunskapskontroller, alla försök och alla laborationsprotokoll i den här
        webbläsaren. Exportera först om du vill kunna återställa dem senare.
      </p>
      {confirming ? (
        <div className="confirm" role="alertdialog" aria-labelledby="bekrafta">
          <p id="bekrafta">
            <strong>Vill du ta bort all progression?</strong> Det går inte att ångra.
          </p>
          <p className="button-row">
            <button
              type="button"
              className="button"
              onClick={() => {
                resetProgress()
                setConfirming(false)
                setMessage('Progressionen har återställts.')
              }}
            >
              Ja, återställ
            </button>
            <button type="button" className="button button-secondary" onClick={() => setConfirming(false)}>
              Avbryt
            </button>
          </p>
        </div>
      ) : (
        <p>
          <button type="button" className="button button-secondary" onClick={() => setConfirming(true)} disabled={!hasData}>
            Återställ progression
          </button>
        </p>
      )}

      {message && (
        <p role="status" className="status-message">
          {message}
        </p>
      )}
    </div>
  )
}
