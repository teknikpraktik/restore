import { useEffect, useState } from 'react'
import { type ScriptStep, totalSeconds } from '../content'
import { elapsedTotal, formatClock, initialFlow, tick } from '../logic/exerciseFlow'
import { AudioSlot } from './AudioSlot'
import { LandaNuButton, PrimaryButton, SecondaryButton } from './ui'

type Props = {
  title: string
  steps: ScriptStep[]
  onEnd: () => void // Avsluta före slutet
  onDone: () => void // Manuset är slut och deltagaren trycker Klar
}

/** Övningsspelare: manus steg för steg, tidsindikator, Pausa och Avsluta. */
export function ExercisePlayer({ title, steps, onEnd, onDone }: Props) {
  const [flow, setFlow] = useState(initialFlow)

  useEffect(() => {
    if (flow.paused || flow.done) return
    let last = Date.now()
    const id = setInterval(() => {
      const now = Date.now()
      const dt = now - last
      last = now
      setFlow((s) => tick(s, steps, dt))
    }, 250)
    return () => clearInterval(id)
  }, [flow.paused, flow.done, steps])

  // Skärmen får inte släckas under en pågående övning.
  useEffect(() => {
    let lock: WakeLockSentinel | undefined
    let released = false
    navigator.wakeLock?.request('screen').then((l) => {
      if (released) void l.release()
      else lock = l
    }).catch(() => {})
    return () => {
      released = true
      void lock?.release()
    }
  }, [])

  const total = totalSeconds(steps) * 1000
  const elapsed = elapsedTotal(flow, steps)
  const step = steps[flow.index]

  return (
    <>
      <header>
        <p className="label">{title}</p>
      </header>

      <div className="stack">
        <AudioSlot />
        <p
          className={step.kind === 'stopp' ? 'instruction safety-block' : 'instruction'}
          aria-live="polite"
          aria-atomic="true"
        >
          {step.text}
        </p>
      </div>

      <div className="stack">
        <div
          className="timer"
          role="progressbar"
          aria-label="Förlopp"
          aria-valuemin={0}
          aria-valuemax={Math.round(total / 1000)}
          aria-valuenow={Math.round(elapsed / 1000)}
          aria-valuetext={`${formatClock(elapsed)} av ${formatClock(total)}`}
        >
          <span style={{ width: `${(elapsed / total) * 100}%` }} />
        </div>
        <p className="secondary">{formatClock(elapsed)} av {formatClock(total)}</p>

        {flow.done ? (
          <PrimaryButton onClick={onDone}>Klar</PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => setFlow((s) => ({ ...s, paused: !s.paused }))}>
            {flow.paused ? 'Fortsätt' : 'Pausa'}
          </PrimaryButton>
        )}
        {!flow.done && <SecondaryButton onClick={onEnd}>Avsluta</SecondaryButton>}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LandaNuButton compact />
        </div>
      </div>
    </>
  )
}
