import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  allExercises,
  chapterHref,
  type Difficulty,
  EVIDENCE_LABEL,
  type Exercise,
  exerciseHref,
  getChapter,
  getExercise,
  getSource,
  chapterOrder,
  useExerciseContent,
} from '../course'
import { type ExerciseEntry, recordExercise, removeExerciseEntry, useProgress } from '../progress/store'
import { formatDate, Loading, NotFoundContent, PageTitle, Prose, useTitle } from '../ui/common'

const DURATIONS = [
  { id: 'kort', label: 'Upp till 15 min', test: (m: number) => m <= 15 },
  { id: 'medel', label: '16–30 min', test: (m: number) => m > 15 && m <= 30 },
  { id: 'lang', label: 'Mer än 30 min', test: (m: number) => m > 30 },
]
const DIFFICULTY_ORDER: Difficulty[] = ['grundläggande', 'medel', 'avancerad']

export type ExerciseFilter = {
  system?: string
  type?: string
  duration?: string
  difficulty?: string
  equipment?: string
  evidence?: string
}

const needsNoEquipment = (e: Exercise) => e.equipment.every((x) => /^ingen/i.test(x))
/** Utrustning grovt indelad för filtrering. */
export const equipmentClass = (e: Exercise) => (needsNoEquipment(e) ? 'ingen' : 'vardagsforemal')

export function filterExercises(list: Exercise[], f: ExerciseFilter) {
  return list.filter(
    (e) =>
      (!f.system || e.systems.includes(f.system as any)) &&
      (!f.type || e.type === f.type) &&
      (!f.duration || DURATIONS.find((d) => d.id === f.duration)?.test(e.minutes)) &&
      (!f.difficulty || e.difficulty === f.difficulty) &&
      (!f.equipment || equipmentClass(e) === f.equipment) &&
      (!f.evidence || e.evidence === f.evidence),
  )
}

const unique = <T,>(xs: T[]) => [...new Set(xs)]

export function ExerciseLibraryPage() {
  useTitle('Övningsbibliotek')
  const progress = useProgress()
  const [params, setParams] = useSearchParams()
  const all = allExercises()
  const filter: ExerciseFilter = Object.fromEntries(params.entries())
  const result = filterExercises(all, filter)

  const options = useMemo(
    () => ({
      system: unique(all.flatMap((e) => e.systems)).sort(),
      type: unique(all.map((e) => e.type)).sort(),
      difficulty: DIFFICULTY_ORDER.filter((d) => all.some((e) => e.difficulty === d)),
    }),
    [all],
  )

  const set = (key: keyof ExerciseFilter, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const select = (key: keyof ExerciseFilter, label: string, opts: { value: string; label: string }[]) => (
    <label className="filter">
      <span>{label}</span>
      <select value={filter[key] ?? ''} onChange={(e) => set(key, e.target.value)}>
        <option value="">Alla</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div className="page">
      <PageTitle>Övningsbibliotek</PageTitle>
      <p className="lead">
        Laborationer, mätningar och träningsprotokoll från kursens underkapitel. Varje övning beskriver syfte,
        teoretisk bakgrund, genomförande, vad som ska observeras, hur resultatet kan tolkas och vilket evidensläge
        som gäller.
      </p>
      <p className="notice-inline">
        Biblioteket innehåller i dag de {all.length} laborationer som hör till de färdigproducerade underkapitlen.
        Nya övningar publiceras tillsammans med respektive underkapitel.
      </p>

      <div className="filters" role="group" aria-label="Filtrera övningar">
        {select('system', 'Fysiologiskt system', options.system.map((s) => ({ value: s, label: s })))}
        {select('type', 'Typ', options.type.map((s) => ({ value: s, label: s })))}
        {select('duration', 'Tidsåtgång', DURATIONS.map((d) => ({ value: d.id, label: d.label })))}
        {select('difficulty', 'Svårighetsgrad', options.difficulty.map((d) => ({ value: d, label: d })))}
        {select('equipment', 'Utrustning', [
          { value: 'ingen', label: 'Ingen utrustning' },
          { value: 'vardagsforemal', label: 'Vardagsföremål eller konsumentprodukt' },
        ])}
        {select('evidence', 'Evidensläge', [
          { value: 'etablerad', label: EVIDENCE_LABEL.etablerad },
          { value: 'experimentell', label: EVIDENCE_LABEL.experimentell },
        ])}
      </div>

      <p className="filter-count" aria-live="polite">
        {result.length} av {all.length} övningar
        {params.toString() && (
          <>
            {' · '}
            <button type="button" className="link-button" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Rensa filter
            </button>
          </>
        )}
      </p>

      <ul className="exercise-list">
        {result.map((e) => {
          const done = progress.exercises[e.id]?.length ?? 0
          return (
            <li key={e.id} className="exercise-item">
              <h2>
                <Link to={exerciseHref(e.id)}>{e.title}</Link>
              </h2>
              <p>{e.summary}</p>
              <p className="meta">
                {e.systems.join(', ')} · {e.type} · cirka {e.minutes} min · {e.difficulty} ·{' '}
                {EVIDENCE_LABEL[e.evidence]}
              </p>
              <p className="meta">
                Ingår i{' '}
                {e.chapters.map((c, i) => (
                  <span key={c}>
                    {i > 0 && ', '}
                    <Link to={chapterHref(c)}>
                      {getChapter(c)!.number} {getChapter(c)!.title}
                    </Link>
                  </span>
                ))}
                {done > 0 && ` · Registrerad ${done} ${done === 1 ? 'gång' : 'gånger'}`}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ExercisePage() {
  const { exerciseId } = useParams()
  const [params] = useSearchParams()
  const e = getExercise(exerciseId)
  const content = useExerciseContent(e?.id)
  useTitle(e ? e.title : 'Övningen finns inte')
  if (!e) return <NotFoundContent title="Övningen finns inte" />
  const fromChapter = getChapter(params.get('kapitel') ?? undefined)
  const back = fromChapter && e.chapters.includes(fromChapter.id) ? fromChapter : getChapter(e.chapters[0])
  const firstChapter = [...e.chapters].sort((a, b) => chapterOrder.indexOf(a) - chapterOrder.indexOf(b))[0]

  return (
    <div className="page exercise-page">
      <PageTitle
        eyebrow={
          back ? (
            <Link to={`${chapterHref(back.id)}#laborationer`}>
              Laboration i {back.number} {back.title}
            </Link>
          ) : (
            <Link to="/ovningar">Övningsbibliotek</Link>
          )
        }
      >
        {e.title}
      </PageTitle>
      <p className="lead">{e.summary}</p>
      <dl className="facts">
        <div>
          <dt>Fysiologiskt system</dt>
          <dd>{e.systems.join(', ')}</dd>
        </div>
        <div>
          <dt>Typ</dt>
          <dd>{e.type}</dd>
        </div>
        <div>
          <dt>Tidsåtgång</dt>
          <dd>cirka {e.minutes} min</dd>
        </div>
        <div>
          <dt>Svårighetsgrad</dt>
          <dd>{e.difficulty}</dd>
        </div>
        <div>
          <dt>Evidensläge</dt>
          <dd>{EVIDENCE_LABEL[e.evidence]}</dd>
        </div>
      </dl>

      <Loading state={content}>
        {(c) =>
          c.sections.map((s) => (
            <section key={s.id} aria-labelledby={`avsnitt-${s.id}`} className={`exercise-section exercise-${s.id}`}>
              <h2 id={`avsnitt-${s.id}`}>{s.title}</h2>
              <Prose html={s.html} />
            </section>
          ))
        }
      </Loading>

      <ExerciseLog exercise={e} />

      {e.sources.length > 0 && (
        <section aria-labelledby="referenser" className="exercise-section">
          <h2 id="referenser">Referenser</h2>
          <ol className="references">
            {e.sources.map((id) => {
              const s = getSource(id)!
              return (
                <li key={id} id={`kalla-${id}`}>
                  <span dangerouslySetInnerHTML={{ __html: s.citation }} />
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <p className="small">
        Övningen ingår i{' '}
        {e.chapters.map((c, i) => (
          <span key={c}>
            {i > 0 && ', '}
            <Link to={chapterHref(c)}>
              {getChapter(c)!.number} {getChapter(c)!.title}
            </Link>
          </span>
        ))}
        . {firstChapter && 'Läs teorin i kapitlet innan du genomför laborationen.'}
      </p>
    </div>
  )
}

/** Protokoll: registrera genomförande och mätvärden. Sparas lokalt. */
function ExerciseLog({ exercise: e }: { exercise: Exercise }) {
  const progress = useProgress()
  const entries = progress.exercises[e.id] ?? []
  const empty = () => Object.fromEntries(e.measurements.map((m) => [m.id, ''])) as Record<string, string>
  const [values, setValues] = useState<Record<string, string>>(empty)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState<string | null>(null)

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const filled = Object.fromEntries(Object.entries(values).filter(([, v]) => v.trim()))
    recordExercise(e.id, { values: filled, note: note.trim() })
    setValues(empty())
    setNote('')
    setSaved(new Date().toISOString())
  }

  return (
    <section aria-labelledby="protokoll" className="exercise-section exercise-log">
      <h2 id="protokoll">Protokoll</h2>
      <p>
        Registrera att du har genomfört laborationen och, om du vill, dina mätvärden. Uppgifterna sparas bara i den här
        webbläsaren. Alla fält är frivilliga.
      </p>
      <form onSubmit={submit} className="log-form">
        {e.measurements.map((m) => (
          <label key={m.id} className="log-field">
            <span>
              {m.label}
              {m.unit && <span className="unit"> ({m.unit})</span>}
            </span>
            {m.kind === 'text' ? (
              <input
                type="text"
                value={values[m.id] ?? ''}
                onChange={(ev) => setValues((v) => ({ ...v, [m.id]: ev.target.value }))}
              />
            ) : (
              <input
                type="text"
                inputMode="decimal"
                value={values[m.id] ?? ''}
                onChange={(ev) => setValues((v) => ({ ...v, [m.id]: ev.target.value }))}
              />
            )}
          </label>
        ))}
        <label className="log-field log-note">
          <span>Anteckningar</span>
          <textarea rows={3} value={note} onChange={(ev) => setNote(ev.target.value)} />
        </label>
        <button type="submit" className="button">
          Registrera genomförande
        </button>
        {saved && (
          <p role="status" className="small">
            Registrerat {formatDate(saved, true)}.
          </p>
        )}
      </form>

      {entries.length > 0 && <LogTable exercise={e} entries={entries} />}
    </section>
  )
}

function LogTable({ exercise: e, entries }: { exercise: Exercise; entries: ExerciseEntry[] }) {
  return (
    <div className="log-history">
      <h3>Registrerade genomföranden ({entries.length})</h3>
      <ol className="log-entries">
        {[...entries].reverse().map((x) => (
          <li key={x.at}>
            <p className="log-entry-head">
              <span>{formatDate(x.at, true)}</span>
              <button type="button" className="link-button" onClick={() => removeExerciseEntry(e.id, x.at)}>
                Ta bort
              </button>
            </p>
            <dl>
              {e.measurements
                .filter((m) => x.values[m.id])
                .map((m) => (
                  <div key={m.id}>
                    <dt>{m.label}</dt>
                    <dd>
                      {x.values[m.id]}
                      {m.unit && m.kind === 'number' ? ` ${m.unit}` : ''}
                    </dd>
                  </div>
                ))}
              {x.note && (
                <div>
                  <dt>Anteckningar</dt>
                  <dd>{x.note}</dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ol>
    </div>
  )
}
