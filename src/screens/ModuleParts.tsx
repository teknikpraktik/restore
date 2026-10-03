import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getExercise, getModule, getModuleByNumber, getPhase, modules, type Module } from '../content'
import {
  latestReflection, logExperimentToday, markPart, markTheorySeen, saveRating, saveReflection, today, useProgressMap,
} from '../db/repo'
import { db, type Rating } from '../db/schema'
import { moduleStatus, partRoute } from '../logic/progress'
import { pad, PART_LABEL, PARTS } from '../model'
import { ChevronRight } from '../ui/icons'
import { Page } from '../ui/Page'
import { Prose } from '../ui/Prose'
import { Scale } from '../ui/Scale'
import { Mark } from '../ui/Status'
import { durationText, ExerciseBody, useModuleCompletions } from './Exercise'

const REASON_ID = 'm01-varfor'

function useModule(): Module | undefined {
  const { moduleId } = useParams()
  return getModule(moduleId)
}

const label = (_m: Module, part: keyof typeof PART_LABEL) => PART_LABEL[part]
const backTo = (m: Module) => ({ to: `/kurs/${m.id}`, label: `${pad(m.number)} ${m.title}` })

// ---------- Teori ----------

export function Theory() {
  const mod = useModule()
  const map = useProgressMap()
  const navigate = useNavigate()
  const seen = useRef(new Set<string>())

  // Avsnitt räknas som lästa när de har visats på skärmen.
  useEffect(() => {
    if (!mod || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.section
          if (entry.isIntersecting && id && !seen.current.has(id)) {
            seen.current.add(id)
            void markTheorySeen(mod.id, id)
          }
        }
      },
      { rootMargin: '0px 0px -35% 0px' },
    )
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [mod])

  if (!mod) return <Navigate to="/kurs" replace />
  const done = !!map?.[mod.id]?.parts.teori

  return (
    <Page title={mod.title} label={label(mod, 'teori')} back={backTo(mod)}>
      <Prose sections={mod.theory} />
      <hr className="rule" />
      <div className="block">
        <p className="secondary">Nästa del är Praktik: {mod.exercises.map((id) => getExercise(id)?.title).join(', ')}.</p>
        <div className="actions">
          {done ? (
            <Link className="btn btn-primary" to={partRoute(mod.id, 'praktik')}>Fortsätt till Praktik</Link>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                for (const s of mod.theory) await markTheorySeen(mod.id, s.id)
                await markPart(mod.id, 'teori')
                navigate(partRoute(mod.id, 'praktik'))
              }}
            >
              Klar med teorin
            </button>
          )}
        </div>
      </div>
    </Page>
  )
}

// ---------- Praktik ----------

export function Practice() {
  const mod = useModule()
  const map = useProgressMap()
  const completions = useModuleCompletions(mod?.id ?? '')
  if (!mod) return <Navigate to="/kurs" replace />

  const list = mod.exercises.map((id) => getExercise(id)!)
  const done = !!map?.[mod.id]?.parts.praktik

  if (list.length === 1) {
    const e = list[0]
    return (
      <Page title={e.title} label={label(mod, 'praktik')} back={backTo(mod)}>
        <ExerciseBody exercise={e} moduleId={mod.id} quiet={done} />
        {done && (
          <div className="block">
            <p className="secondary">Praktiken är gjord. Du kan göra övningen igen när du vill.</p>
            <div className="actions">
              <Link className="btn btn-primary" to={partRoute(mod.id, 'tillampning')}>Fortsätt till Tillämpning</Link>
            </div>
          </div>
        )}
      </Page>
    )
  }

  const firstOpen = list.find((e) => !completions?.has(e.id)) ?? list[0]
  return (
    <Page
      title="Praktik"
      lead={`Modulen har ${list.length === 2 ? 'två' : list.length === 3 ? 'tre' : 'fyra'} övningar. Prova minst en. Alla finns kvar under Övningar.`}
      back={backTo(mod)}
    >
      <ol className="rows">
        {list.map((e) => {
          const ok = completions?.has(e.id) ?? false
          return (
            <li key={e.id}>
              <Link className="row" to={`/ovningar/${e.id}?modul=${mod.id}`}>
                <Mark status={ok ? 'done' : 'todo'} label={ok ? 'Gjord' : 'Ej gjord'} />
                <span className="row-main">
                  <span className="row-title">{e.title}</span>
                  <span className="secondary">{durationText(e)}</span>
                </span>
                <ChevronRight />
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="actions">
        {done ? (
          <Link className="btn btn-primary" to={partRoute(mod.id, 'tillampning')}>Fortsätt till Tillämpning</Link>
        ) : (
          <Link className="btn btn-primary" to={`/ovningar/${firstOpen.id}?modul=${mod.id}`}>Börja med {firstOpen.title}</Link>
        )}
      </div>
    </Page>
  )
}

// ---------- Tillämpning ----------

const RATING_QUESTIONS = [
  { id: 'stress', question: 'Hur stressad har du känt dig?', low: '0 Inte alls', high: '10 Mycket' },
  { id: 'sleep', question: 'Hur har du sovit?', low: '0 Mycket dåligt', high: '10 Mycket bra' },
  { id: 'recovery', question: 'Hur väl har du hunnit återhämta dig?', low: '0 Inte alls', high: '10 Helt' },
] as const

export function Application() {
  const mod = useModule()
  const map = useProgressMap()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [vals, setVals] = useState<Partial<Record<'stress' | 'sleep' | 'recovery', number>>>({})
  const log = useLiveQuery(async () => (mod ? db.experimentLog.where('moduleId').equals(mod.id).toArray() : []), [mod?.id])
  const savedReason = useLiveQuery(async () => (await latestReflection(REASON_ID))?.answers[0] ?? '', [])
  const savedRating = useLiveQuery(async () => (mod ? db.ratings.where('occasion').equals(mod.id).last() : undefined), [mod?.id])

  useEffect(() => {
    if (savedReason) setReason((r) => r || savedReason)
  }, [savedReason])

  if (!mod) return <Navigate to="/kurs" replace />
  const app = mod.application
  const done = !!map?.[mod.id]?.parts.tillampning
  const loggedToday = log?.some((l) => l.date === today()) ?? false

  const complete = async () => {
    if (app.kind === 'reason' && reason.trim() && reason.trim() !== savedReason) {
      await saveReflection({ moduleId: REASON_ID, answers: [reason.trim()] })
    }
    if (mod.measurement && vals.stress !== undefined && vals.sleep !== undefined && vals.recovery !== undefined) {
      await saveRating({ occasion: mod.id as Rating['occasion'], stress: vals.stress, sleep: vals.sleep, recovery: vals.recovery })
    }
    await markPart(mod.id, 'tillampning')
    navigate(`/kurs/${mod.id}`)
  }

  return (
    <Page title={app.title} label={label(mod, 'tillampning')} back={backTo(mod)}>
      <section className="block" aria-labelledby="syfte">
        <h2 id="syfte">Syfte</h2>
        <p>{app.purpose}</p>
      </section>

      <section className="block" aria-labelledby="gor">
        <h2 id="gor">Gör så här</h2>
        <ol className="steps">{app.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        {app.days > 0 && <p className="secondary">Pröva under ungefär {app.days} dagar. Gör sedan reflektionen.</p>}
      </section>

      {app.kind === 'reason' && (
        <div className="field">
          <label htmlFor="skal">Ditt skäl i en mening</label>
          <textarea
            id="skal"
            value={reason}
            placeholder="Till exempel: Jag vill sova bättre och ha ork kvar på kvällarna."
            onChange={(ev) => setReason(ev.target.value)}
          />
        </div>
      )}

      {app.kind === 'plan' && (
        <p>
          <Link className="text-link" to="/mer/plan">Öppna Min plan</Link>
        </p>
      )}

      {mod.measurement && (
        <section className="block" aria-labelledby="skattning">
          <h2 id="skattning">Självskattning</h2>
          {savedRating && done ? (
            <p className="secondary">
              Sparad {savedRating.createdAt.toLocaleDateString('sv-SE')}: stress {savedRating.stress}, sömn {savedRating.sleep},
              återhämtning {savedRating.recovery}. Alla skattningar finns under Mer → Din progression.
            </p>
          ) : (
            <>
              <p className="secondary">
                Tänk på den senaste veckan. Siffrorna är till för dig. De är inte ett test. Du kan hoppa över skattningen.
              </p>
              {RATING_QUESTIONS.map((q) => (
                <Scale
                  key={q.id}
                  label={q.question}
                  min={0}
                  max={10}
                  low={q.low}
                  high={q.high}
                  value={vals[q.id] ?? null}
                  onChange={(n) => setVals((v) => ({ ...v, [q.id]: n }))}
                />
              ))}
            </>
          )}
        </section>
      )}

      {app.days > 0 && (
        <section className="block" aria-labelledby="logg">
          <h2 id="logg">Logg</h2>
          <p className="secondary">
            {log?.length ? `Du har provat ${log.length} ${log.length === 1 ? 'gång' : 'gånger'}.` : 'Markera de dagar du provar. Det är frivilligt.'}
          </p>
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={loggedToday}
              onClick={() => logExperimentToday(mod.id)}
            >
              {loggedToday ? 'Markerat för i dag' : 'Jag provade i dag'}
            </button>
          </div>
        </section>
      )}

      <div className="actions">
        {done ? (
          <Link className="btn btn-primary" to={partRoute(mod.id, 'reflektion')}>Fortsätt till Reflektion</Link>
        ) : (
          <button type="button" className="btn btn-primary" onClick={complete}>Markera som gjord</button>
        )}
      </div>
    </Page>
  )
}

// ---------- Reflektion ----------

export function Reflection() {
  const mod = useModule()
  const map = useProgressMap()
  const [answers, setAnswers] = useState<string[] | null>(null)
  const [useful, setUseful] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const previous = useLiveQuery(async () => (mod ? ((await latestReflection(mod.id)) ?? null) : null), [mod?.id])

  useEffect(() => {
    if (previous !== undefined && answers === null && mod) {
      setAnswers(previous?.answers ?? mod.reflection.map(() => ''))
      setUseful(previous?.usefulness ?? null)
    }
  }, [previous, answers, mod])

  if (!mod) return <Navigate to="/kurs" replace />
  if (saved && map) return <ReflectionSaved mod={mod} />

  const save = async () => {
    await saveReflection({
      moduleId: mod.id,
      answers: answers ?? [],
      usefulness: (useful ?? undefined) as 1 | 2 | 3 | 4 | 5 | undefined,
    })
    await markPart(mod.id, 'reflektion')
    setSaved(true)
  }

  return (
    <Page
      title="Reflektion"
      lead="Svara med några ord eller några meningar. Svaren sparas bara på den här enheten."
      back={backTo(mod)}
    >
      {mod.reflection.map((q, i) => (
        <div key={q} className="field">
          <label htmlFor={`fraga-${i}`}>{q}</label>
          <textarea
            id={`fraga-${i}`}
            value={answers?.[i] ?? ''}
            onChange={(ev) => setAnswers((a) => (a ?? mod.reflection.map(() => '')).map((x, j) => (j === i ? ev.target.value : x)))}
          />
        </div>
      ))}
      <Scale
        label="Hur användbar var modulen för dig?"
        min={1}
        max={5}
        low="1 Inte användbar"
        high="5 Mycket användbar"
        value={useful}
        onChange={setUseful}
      />
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={save}>Spara reflektion</button>
      </div>
    </Page>
  )
}

function ReflectionSaved({ mod }: { mod: Module }) {
  const map = useProgressMap()!
  const p = map[mod.id]
  const complete = moduleStatus(p) === 'done'
  const phase = getPhase(mod.phase)
  const phaseModules = phase.modules.map((id) => getModule(id)!)
  const phaseDone = phaseModules.every((m) => moduleStatus(map[m.id]) === 'done')
  const next = getModuleByNumber(mod.number + 1)
  const remaining = PARTS.filter((x) => !p?.parts[x])
  const nextOpen = next ?? modules.find((m) => moduleStatus(map[m.id]) !== 'done')

  if (!complete) {
    return (
      <Page title="Reflektionen är sparad" label={`${pad(mod.number)} ${mod.title}`} back={backTo(mod)}>
        <p>Kvar i modulen: {remaining.map((x) => PART_LABEL[x]).join(', ')}.</p>
        <div className="actions">
          <Link className="btn btn-primary" to={partRoute(mod.id, remaining[0])}>Fortsätt med {PART_LABEL[remaining[0]]}</Link>
        </div>
      </Page>
    )
  }

  return (
    <Page title={`Modul ${pad(mod.number)} är genomförd`} label={mod.title} back={backTo(mod)}>
      {phaseDone && (
        <section className="block" aria-labelledby="fas-klar">
          <h2 id="fas-klar">Fas {phase.id} · {phase.name} är genomförd</h2>
          <p>Det här kan du nu:</p>
          <ul style={{ paddingLeft: '1.25em', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {phaseModules.flatMap((m) => m.objectives).map((o) => <li key={o}>{o}</li>)}
          </ul>
        </section>
      )}
      <div className="actions">
        {nextOpen ? (
          <Link className="btn btn-primary" to={`/kurs/${nextOpen.id}`}>
            Fortsätt med {pad(nextOpen.number)} {nextOpen.title}
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/">Till Hem</Link>
        )}
      </div>
      <p>
        <Link className="text-link" to="/kurs">Till kursöversikten</Link>
      </p>
    </Page>
  )
}
