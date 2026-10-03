import { useLiveQuery } from 'dexie-react-hooks'
import { LandaNuButton, HelpLink, PhaseLabel, PrimaryButton, ProgressBar } from '../components/ui'
import { getModule, phases } from '../content'
import { getProgress, nextStep } from '../db/repo'
import { STEP_LABEL, percentDone, stepRoute } from '../logic/progress'

// På den här skärmen ska användaren starta nästa steg.

export function Idag() {
  const mod = getModule('m01')!
  const phase = phases.find((p) => p.id === mod.phase)!
  const progress = useLiveQuery(async () => (await getProgress('m01')) ?? null)
  if (progress === undefined) return null

  const step = nextStep(progress?.steps)

  return (
    <>
      <header className="page-head">
        <p className="label">Restore</p>
      </header>

      <div className="stack">
        <div className="stack" style={{ gap: 8 }}>
          <PhaseLabel>Fas {phase.id} · {phase.name}</PhaseLabel>
          <p className="secondary">{percentDone(progress?.steps)} % genomförd</p>
          <ProgressBar percent={percentDone(progress?.steps)} label={`Fas ${phase.id} av 6`} />
          <p className="secondary">Fas {phase.id} av 6</p>
        </div>

        {step ? (
          <section className="card stack" aria-labelledby="nasta">
            <h1 id="nasta">{mod.title}</h1>
            <p className="secondary">
              Modul {mod.number} · {STEP_LABEL[step]} · {mod.estimatedMinutes[step]} min
            </p>
            <PrimaryButton to={stepRoute(mod.id, step, mod.exercises[0])}>Fortsätt</PrimaryButton>
          </section>
        ) : (
          <section className="card stack" aria-labelledby="nasta">
            <h1 id="nasta">Modul 1 genomförd</h1>
            <p>Fler moduler kommer. Under tiden finns övningarna under Verktyg.</p>
            <PrimaryButton to="/verktyg">Öppna Verktyg</PrimaryButton>
          </section>
        )}
      </div>

      <div className="actions" style={{ alignItems: 'flex-start' }}>
        <LandaNuButton />
        <HelpLink />
      </div>
    </>
  )
}
