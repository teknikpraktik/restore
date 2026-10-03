import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ExercisePlayer } from '../components/ExercisePlayer'
import { ReactionsView } from '../components/Safety'
import { LandaNuButton, PrimaryButton, TextButton } from '../components/ui'
import { type ExerciseVersion, getExercise, totalSeconds } from '../content'
import { markStep, saveSession } from '../db/repo'
import { routeAfterEarlyStop } from '../logic/exerciseFlow'

const POSITION: Record<string, string> = { sitting: 'sittande', standing: 'stående', lying: 'liggande' }
const VERSION_LABEL: Record<ExerciseVersion, string> = { short: 'Kort version', full: 'Hel version' }

const minutes = (secs: number) => Math.max(1, Math.round(secs / 60))

const returnPath = (modul: string | null) => (modul ? `/modul/${modul}` : '/verktyg')

export function ExerciseStart() {
  // På den här skärmen ska användaren välja kort eller hel version och starta.
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const modul = params.get('modul')
  const ex = getExercise(id)
  const navigate = useNavigate()
  const versions = (Object.keys(ex?.scripts ?? {}) as ExerciseVersion[]).sort()
  const [version, setVersion] = useState<ExerciseVersion>('short')
  if (!ex) return <Navigate to="/verktyg" replace />

  const start = () => navigate(`/ovning/${id}/kor?v=${version}${modul ? `&modul=${modul}` : ''}`)

  return (
    <>
      <div className="stack">
        <h1>{ex.title}</h1>
        <p className="lead">{ex.summary}</p>
        <fieldset className="choices">
          <legend className="visually-hidden">Version</legend>
          {versions.map((v) => (
            <label key={v} className="choice">
              <input type="radio" name="version" checked={version === v} onChange={() => setVersion(v)} />
              <span>{VERSION_LABEL[v]} · {minutes(totalSeconds(ex.scripts[v]!))} min</span>
            </label>
          ))}
        </fieldset>
        <p className="secondary">
          Du kan göra övningen {ex.positions.map((p) => POSITION[p] ?? p).join(', ')}, och ha ögonen öppna hela tiden.
          Du kan sluta när du vill.
        </p>
      </div>
      <div className="actions">
        <PrimaryButton onClick={start}>Starta övning</PrimaryButton>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextButton onClick={() => navigate(returnPath(modul))}>Tillbaka</TextButton>
          <LandaNuButton compact />
        </div>
      </div>
    </>
  )
}

type Phase = 'play' | 'ask' | 'after' | 'worse'

export function ExerciseMode() {
  // På den här skärmen ska användaren följa övningen.
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const modul = params.get('modul')
  const version: ExerciseVersion = params.get('v') === 'full' ? 'full' : 'short'
  const ex = getExercise(id)
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('play')
  const steps = ex?.scripts[version]
  if (!ex || !steps) return <Navigate to="/verktyg" replace />

  const finish = async () => {
    if (modul === 'm01' && id === 'O1') await markStep('m01', 'kann')
    navigate(id === 'N1' ? '/' : returnPath(modul))
  }

  const answerTooMuch = async (tooMuch: boolean) => {
    await saveSession({ exerciseId: id, version, completed: false, stoppedEarlyTooMuch: tooMuch })
    if (routeAfterEarlyStop(tooMuch) === 'landa-nu') navigate('/landa-nu', { state: { from: 'stopp' } })
    else navigate(returnPath(modul))
  }

  const answerAfter = async (after: 'calmer' | 'same' | 'worse') => {
    await saveSession({ exerciseId: id, version, completed: true, after })
    if (after === 'worse') setPhase('worse')
    else await finish()
  }

  if (phase === 'ask') {
    return (
      <>
        <div className="stack grow" style={{ justifyContent: 'center' }}>
          <h1>Avbröt du för att det blev för mycket?</h1>
        </div>
        <div className="three" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <button type="button" onClick={() => answerTooMuch(true)}>Ja</button>
          <button type="button" onClick={() => answerTooMuch(false)}>Nej</button>
        </div>
      </>
    )
  }

  if (phase === 'after') {
    return (
      <>
        <div className="stack grow" style={{ justifyContent: 'center' }}>
          <h1>Hur har du det nu?</h1>
        </div>
        <div className="three">
          <button type="button" onClick={() => answerAfter('calmer')}>Lugnare</button>
          <button type="button" onClick={() => answerAfter('same')}>Ungefär som innan</button>
          <button type="button" onClick={() => answerAfter('worse')}>Sämre</button>
        </div>
      </>
    )
  }

  if (phase === 'worse') {
    return (
      <>
        <div className="stack safety">
          <h1>Så här går du vidare</h1>
          <p className="lead">Du kan landa nu och sedan fortsätta en annan dag med en kortare version.</p>
          <div><LandaNuButton /></div>
          <ReactionsView />
        </div>
        <div className="actions">
          <PrimaryButton onClick={finish}>Fortsätt</PrimaryButton>
        </div>
      </>
    )
  }

  return (
    <ExercisePlayer title={ex.title} steps={steps} onEnd={() => setPhase('ask')} onDone={() => setPhase('after')} />
  )
}
