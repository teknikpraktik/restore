import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { SelfCheck } from '../components/SelfCheck'
import { PhaseLabel, PrimaryButton, ProgressBar, Scale, TextButton } from '../components/ui'
import { getModule, helpAndCare, phases } from '../content'
import { getProgress, markStep, nextStep, saveRating, saveReflection, stepOrder, updateSettings } from '../db/repo'
import { STEP_LABEL, stepRoute } from '../logic/progress'
import { needsCareHint } from '../logic/ratings'
import { Link } from 'react-router-dom'

export function ModuleOverview() {
  // På den här skärmen ska användaren se modulens fyra steg och starta nästa.
  const { id = '' } = useParams()
  const mod = getModule(id)
  const progress = useLiveQuery(async () => (await getProgress(id)) ?? null, [id])
  if (!mod) return <Navigate to="/" replace />
  if (progress === undefined) return null

  const phase = phases.find((p) => p.id === mod.phase)!
  const step = nextStep(progress?.steps)

  return (
    <>
      <div className="stack">
        <PhaseLabel>Fas {phase.id} · {phase.name}</PhaseLabel>
        <h1>{mod.title}</h1>
        <div className="stack" style={{ gap: 8 }}>
          <p className="secondary">Efter modulen kan du …</p>
          <ul className="plain">{mod.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </div>
        <ol className="plain" aria-label="Modulens steg" style={{ gap: 8 }}>
          {stepOrder.map((s) => (
            <li key={s}>
              {STEP_LABEL[s]} · {mod.estimatedMinutes[s]} min
              {progress?.steps[s] ? ' · gjord' : s === step ? ' · nästa' : ''}
            </li>
          ))}
        </ol>
      </div>
      <div className="actions">
        {step ? (
          <PrimaryButton to={stepRoute(mod.id, step, mod.exercises[0])}>Starta {STEP_LABEL[step]}</PrimaryButton>
        ) : (
          <PrimaryButton to="/">Till Idag</PrimaryButton>
        )}
      </div>
    </>
  )
}

export function Forsta() {
  // På den här skärmen ska användaren läsa ett kort i taget och gå vidare.
  const { id = '' } = useParams()
  const mod = getModule(id)
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  if (!mod) return <Navigate to="/" replace />

  const card = mod.cards[i]
  const last = i === mod.cards.length - 1
  const next = async () => {
    if (!last) return setI(i + 1)
    await markStep(mod.id, 'forsta')
    navigate(`/modul/${mod.id}`)
  }

  return (
    <>
      <header className="page-head">
        <TextButton onClick={() => navigate(`/modul/${mod.id}`)}>Stäng</TextButton>
        <p className="secondary">Kort {i + 1} av {mod.cards.length}</p>
      </header>
      <ProgressBar percent={Math.round(((i + 1) / mod.cards.length) * 100)} label="Förstå" />
      <section className="session-card" key={i} aria-live="polite">
        <h1>{card.title}</h1>
        <p className="lead">{card.text}</p>
      </section>
      <div className="actions">
        <PrimaryButton onClick={next}>{last ? 'Klar' : 'Nästa'}</PrimaryButton>
        {i > 0 && <TextButton onClick={() => setI(i - 1)}>Föregående</TextButton>}
      </div>
    </>
  )
}

type ProvaStage = 'intro' | 'selfcheck' | 'why' | 'rating' | 'care'
const KEYS = ['stress', 'sleep', 'recovery'] as const

export function ProvaM01() {
  // På den här skärmen ska användaren förstå experimentet och bekräfta att hen ska pröva det.
  const mod = getModule('m01')!
  const p = mod.prova
  const navigate = useNavigate()
  const [stage, setStage] = useState<ProvaStage>('intro')
  const [why, setWhy] = useState('')
  const [vals, setVals] = useState<Partial<Record<(typeof KEYS)[number], number>>>({})

  const finish = async () => {
    await markStep('m01', 'prova')
    navigate('/modul/m01')
  }

  if (stage === 'intro') {
    return (
      <>
        <div className="stack grow" style={{ justifyContent: 'center' }}>
          <h1>Prova</h1>
          <p className="lead">{p.intro}</p>
        </div>
        <div className="actions">
          <PrimaryButton onClick={() => setStage('selfcheck')}>Börja med självkontrollen</PrimaryButton>
        </div>
      </>
    )
  }

  if (stage === 'selfcheck') return <SelfCheck onDone={() => setStage('why')} />

  if (stage === 'why') {
    return (
      <>
        <div className="stack">
          <h1>{p.why.title}</h1>
          <label className="lead" htmlFor="varfor">{p.why.prompt}</label>
          <textarea id="varfor" value={why} placeholder={p.why.placeholder} onChange={(e) => setWhy(e.target.value)} />
        </div>
        <div className="actions">
          <PrimaryButton
            disabled={!why.trim()}
            onClick={async () => {
              await saveReflection({ moduleId: 'm01-varfor', answers: [why.trim()] })
              setStage('rating')
            }}
          >
            Spara
          </PrimaryButton>
        </div>
      </>
    )
  }

  if (stage === 'rating') {
    const complete = KEYS.every((k) => vals[k] !== undefined)
    return (
      <>
        <div className="stack">
          <h1>{p.rating.title}</h1>
          <p className="lead">{p.rating.intro}</p>
          {p.rating.questions.map((q: { id: (typeof KEYS)[number]; question: string; low: string; high: string }) => (
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
        </div>
        <div className="actions">
          <PrimaryButton
            disabled={!complete}
            onClick={async () => {
              const r = { stress: vals.stress!, sleep: vals.sleep!, recovery: vals.recovery! }
              await saveRating({ occasion: 'm01', ...r })
              if (needsCareHint(r)) setStage('care')
              else await finish()
            }}
          >
            Spara
          </PrimaryButton>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="stack safety">
        <h1>Vårdhänvisning</h1>
        <p className="safety-block">{helpAndCare().thresholdText}</p>
        <p><Link to="/hjalp">Hjälp och vård</Link></p>
      </div>
      <div className="actions">
        <PrimaryButton onClick={finish}>Fortsätt</PrimaryButton>
      </div>
    </>
  )
}

export function ReflekteraM01() {
  // På den här skärmen ska användaren svara på frågorna.
  const mod = getModule('m01')!
  const r = mod.reflektera
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<string[]>(mod.reflection.map(() => ''))
  const [useful, setUseful] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [done, setDone] = useState(false)

  const save = async () => {
    await saveReflection({ moduleId: 'm01', answers, usefulness: useful as 1 | 2 | 3 | 4 | 5 })
    await updateSettings({ safetyConfirmedAt: new Date() })
    await markStep('m01', 'reflektera')
    setDone(true)
  }

  if (done) {
    return (
      <>
        <div className="stack grow" style={{ justifyContent: 'center' }}>
          <h1>Modul 1 genomförd</h1>
          <p className="lead">Du har gjort alla fyra stegen. Fortsätt när du vill.</p>
        </div>
        <div className="actions">
          <PrimaryButton onClick={() => navigate('/')}>Till Idag</PrimaryButton>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="stack">
        <h1>Reflektera</h1>
        <p className="lead">{r.intro}</p>
        {mod.reflection.map((q, i) => (
          <div key={q} className="stack" style={{ gap: 8 }}>
            <label htmlFor={`q${i}`}>{q}</label>
            <textarea
              id={`q${i}`}
              value={answers[i]}
              onChange={(e) => setAnswers((a) => a.map((x, j) => (j === i ? e.target.value : x)))}
            />
          </div>
        ))}
        <Scale
          label={r.usefulness.question}
          min={1}
          max={5}
          low={r.usefulness.low}
          high={r.usefulness.high}
          value={useful}
          onChange={setUseful}
        />
        <label className="choice">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>{r.confirmation}</span>
        </label>
      </div>
      <div className="actions">
        <PrimaryButton disabled={useful === null || !confirmed} onClick={save}>Spara och avsluta</PrimaryButton>
      </div>
    </>
  )
}
