import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CATEGORIES, type Exercise, exerciseMinutes, exercises, getExercise, getModule, getModuleByNumber, modules, timeline } from '../content'
import { markPart, saveSession, setNoticed, useCompletedCounts, useProgressMap } from '../db/repo'
import { db, type ExerciseSession } from '../db/schema'
import { elapsedMs, formatClock, initialPlayer, tick, totalMs } from '../logic/player'
import { isIntroduced } from '../logic/progress'
import { type ExerciseVersion, pad } from '../model'
import { ChevronRight } from '../ui/icons'
import { Page, ProgressLine, usePageTitle } from '../ui/Page'

const times = (n: number) => (n === 1 ? 'Gjort 1 gång' : `Gjort ${n} gånger`)

export const durationText = (e: Exercise) =>
  e.durations ? `${exerciseMinutes(e, 'short')} eller ${exerciseMinutes(e, 'full')} min` : 'Valfri längd'

const playerUrl = (e: Exercise, v: ExerciseVersion, moduleId?: string) =>
  `/ovningar/${e.id}/spela?v=${v}${moduleId ? `&modul=${moduleId}` : ''}`

/** Övningens innehåll: syfte, gör så här, säkerhetsinformation där den behövs, och start. */
export function ExerciseBody({ exercise: e, moduleId, quiet = false }: { exercise: Exercise; moduleId?: string; quiet?: boolean }) {
  const counts = useCompletedCounts()
  const map = useProgressMap()
  const count = counts?.[e.id] ?? 0
  const partOf = e.modules.map((n) => getModuleByNumber(n)!).filter(Boolean)

  return (
    <>
      <section className="block" aria-labelledby={`syfte-${e.id}`}>
        <h2 id={`syfte-${e.id}`}>Syfte</h2>
        <p>{e.purpose}</p>
      </section>

      <section className="block" aria-labelledby={`gor-${e.id}`}>
        <h2 id={`gor-${e.id}`}>Gör så här</h2>
        <ol className="steps">{e.steps.map((s) => <li key={s.text}>{s.text}</li>)}</ol>
        {e.safety && <p className="notice">{e.safety}</p>}
        <p className="secondary">Kan göras {e.positions.join(', ')}.</p>
      </section>

      {e.combination ? (
        <section className="block" aria-labelledby="valj">
          <h2 id="valj">Övningar att välja bland</h2>
          {map && (
            <ul className="rows">
              {exercises
                .filter((x) => !x.combination && isIntroduced(x, modules, map))
                .map((x) => (
                  <li key={x.id}>
                    <Link className="row" to={`/ovningar/${x.id}`}>
                      <span className="row-main"><span className="row-title">{x.title}</span></span>
                      <span className="row-meta">{durationText(x)}</span>
                      <ChevronRight />
                    </Link>
                  </li>
                ))}
            </ul>
          )}
          {moduleId && <CombinationDone moduleId={moduleId} />}
        </section>
      ) : (
        <div className="block">
          <div className="actions">
            <Link className={quiet ? 'btn btn-secondary' : 'btn btn-primary'} to={playerUrl(e, 'short', moduleId)}>
              Starta {exerciseMinutes(e, 'short')} minuter
            </Link>
            <Link className="btn btn-secondary" to={playerUrl(e, 'full', moduleId)}>
              {exerciseMinutes(e, 'full')} minuter
            </Link>
          </div>
          {count > 0 && <p className="secondary">{times(count)}</p>}
        </div>
      )}

      {!moduleId && partOf.length > 0 && (
        <p className="secondary">
          Ingår i{' '}
          {partOf.map((m, i) => (
            <span key={m.id}>
              {i > 0 && ' och '}
              <Link className="text-link" to={`/kurs/${m.id}`}>modul {pad(m.number)} {m.title}</Link>
            </span>
          ))}
          .
        </p>
      )}
    </>
  )
}

function CombinationDone({ moduleId }: { moduleId: string }) {
  const map = useProgressMap()
  const navigate = useNavigate()
  if (!map) return null
  if (map[moduleId]?.parts.praktik) return <p className="secondary">Praktiken är markerad som gjord.</p>
  return (
    <div className="actions">
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          await markPart(moduleId, 'praktik')
          navigate(`/kurs/${moduleId}`)
        }}
      >
        Markera som gjord
      </button>
    </div>
  )
}

/** Övning från fliken Övningar, eller från en moduls praktik. */
export function ExerciseDetail() {
  const { exerciseId } = useParams()
  const [params] = useSearchParams()
  const moduleId = getModule(params.get('modul') ?? undefined)?.id
  const e = getExercise(exerciseId)
  if (!e) return <Navigate to="/ovningar" replace />
  return (
    <Page
      title={e.title}
      label={e.category}
      back={moduleId ? { to: `/kurs/${moduleId}/praktik`, label: 'Praktik' } : { to: '/ovningar', label: 'Övningar' }}
    >
      <ExerciseBody exercise={e} moduleId={moduleId} />
    </Page>
  )
}

/** Fliken Övningar: övningar som har introducerats i kursen, grupperade. */
export function Exercises() {
  const map = useProgressMap()
  const counts = useCompletedCounts()
  if (!map) return <Page title="Övningar" />

  const introduced = exercises.filter((e) => isIntroduced(e, modules, map))
  const later = exercises.length - introduced.length

  return (
    <Page title="Övningar" lead="Övningarna du har mött i kursen. De flesta finns i en kort och en lång version.">
      {introduced.length === 0 && (
        <p>
          Övningarna samlas här när du kommer till dem i kursen. Den första finns i{' '}
          <Link className="text-link" to="/kurs/m01">modul 01 Säker start</Link>.
        </p>
      )}
      {CATEGORIES.map((cat) => {
        const list = introduced.filter((e) => e.category === cat)
        if (!list.length) return null
        return (
          <section key={cat} className="block" aria-labelledby={`kat-${cat}`}>
            <h2 id={`kat-${cat}`}>{cat}</h2>
            <ul className="rows">
              {list.map((e) => (
                <li key={e.id}>
                  <Link className="row" to={`/ovningar/${e.id}`}>
                    <span className="row-main">
                      <span className="row-title">{e.title}</span>
                      <span className="secondary">{durationText(e)}</span>
                    </span>
                    {counts?.[e.id] ? <span className="row-meta">{times(counts[e.id])}</span> : null}
                    <ChevronRight />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {later > 0 && introduced.length > 0 && (
        <p className="secondary">{later} övningar till introduceras senare i kursen.</p>
      )}
    </Page>
  )
}

/** Övningsspelare: namn, instruktion, nästa instruktion, tid kvar, Pausa och Avsluta. Ingen navigering. */
export function Player() {
  const { exerciseId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const e = getExercise(exerciseId)
  const version: ExerciseVersion = params.get('v') === 'full' ? 'full' : 'short'
  const moduleId = getModule(params.get('modul') ?? undefined)?.id
  const steps = useMemo(() => (e ? timeline(e, version) : []), [e, version])
  const [state, setState] = useState(initialPlayer)
  const [sessionId, setSessionId] = useState<number>()
  const [noticed, setNoticedLocal] = useState<ExerciseSession['noticed']>()
  const saved = useRef(false)
  usePageTitle(e ? e.title : 'Övning')

  const back = moduleId ? `/kurs/${moduleId}/praktik` : `/ovningar/${exerciseId}`

  useEffect(() => {
    if (state.paused || state.done || !steps.length) return
    let last = Date.now()
    const id = setInterval(() => {
      const now = Date.now()
      const dt = now - last
      last = now
      setState((s) => tick(s, steps, dt))
    }, 250)
    return () => clearInterval(id)
  }, [state.paused, state.done, steps])

  // Skärmen ska inte släckas under en pågående övning.
  useEffect(() => {
    let lock: WakeLockSentinel | undefined
    let released = false
    navigator.wakeLock
      ?.request('screen')
      .then((l) => (released ? void l.release() : (lock = l)))
      .catch(() => {})
    return () => {
      released = true
      void lock?.release()
    }
  }, [])

  useEffect(() => {
    if (!state.done || saved.current || !e) return
    saved.current = true
    void saveSession({ exerciseId: e.id, moduleId, version, completed: true }).then(setSessionId)
    if (moduleId) void markPart(moduleId, 'praktik')
  }, [state.done, e, moduleId, version])

  if (!e || e.combination || !steps.length) return <Navigate to="/ovningar" replace />

  const end = async () => {
    saved.current = true
    await saveSession({ exerciseId: e.id, moduleId, version, completed: false })
    navigate(back)
  }

  const finish = async () => {
    if (noticed && sessionId !== undefined) await setNoticed(sessionId, noticed)
    navigate(back)
  }

  if (state.done) {
    const options: [NonNullable<ExerciseSession['noticed']>, string][] = [['yes', 'Ja'], ['no', 'Nej'], ['unsure', 'Osäker']]
    return (
      <div className="player-inner">
        <div className="player-body">
          <p className="label">{e.title}</p>
          <h1 tabIndex={-1}>Övning genomförd</h1>
          <fieldset className="field">
            <legend className="secondary" style={{ fontWeight: 400, marginBottom: 8 }}>
              Märkte du någon skillnad? Frivilligt.
            </legend>
            <div className="segmented">
              {options.map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={noticed === v}
                  onClick={() => setNoticedLocal(noticed === v ? undefined : v)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="player-foot">
          <button type="button" className="btn btn-primary" onClick={finish}>Klar</button>
        </div>
      </div>
    )
  }

  const total = totalMs(steps)
  const elapsed = elapsedMs(state, steps)
  const step = steps[state.index]
  const next = steps[state.index + 1]

  return (
    <div className="player-inner">
      <div className="player-head">
        <h1 className="heading" tabIndex={-1}>{e.title}</h1>
        <p className="secondary tabular">Steg {state.index + 1} av {steps.length}</p>
      </div>

      <div className="player-body">
        <p className="instruction" aria-live="polite" aria-atomic="true">{step.text}</p>
        {next && <p className="next-step">Nästa: {next.text}</p>}
      </div>

      <div className="player-foot">
        <div>
          <p className="time-left" aria-hidden="true">{formatClock(total - elapsed)}</p>
          <p className="secondary">{state.paused ? 'Pausad' : 'kvar'}</p>
        </div>
        <ProgressLine value={Math.round((elapsed / total) * 100)} label={`${formatClock(total - elapsed)} kvar`} />
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => setState((s) => ({ ...s, paused: !s.paused }))}>
            {state.paused ? 'Fortsätt' : 'Pausa'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={end}>Avsluta</button>
        </div>
      </div>
    </div>
  )
}

/** Övningar som genomförts inom en viss modul. */
export const useModuleCompletions = (moduleId: string) =>
  useLiveQuery(async () => {
    const done = await db.sessions.filter((s) => s.completed && s.moduleId === moduleId).toArray()
    return new Set(done.map((s) => s.exerciseId))
  }, [moduleId])
