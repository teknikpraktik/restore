import { useState } from 'react'
import { Link } from 'react-router-dom'
import { selfCheck } from '../content'
import { adviceFor } from '../logic/selfcheck'
import { PrimaryButton } from './ui'

// På den här skärmen ska användaren markera det som stämmer och läsa råden.
//
// Svaren finns bara i den här komponentens state. De skrivs aldrig till IndexedDB,
// localStorage, sessionStorage eller konsol, och försvinner när skärmen lämnas.

const Urgent = ({ advice }: { advice: string }) => (
  <section className="safety-block" role="alert" aria-labelledby="akut-rubrik">
    <h2 id="akut-rubrik">Prata med någon i dag</h2>
    <p><strong>{advice}</strong></p>
    <p>
      <a href="tel:90101">Ring 90101</a> · <a href="tel:1177">Ring 1177</a> · <a href="tel:112">Ring 112</a>
    </p>
    <p><Link to="/hjalp">Hjälp och vård</Link></p>
  </section>
)

export function SelfCheck({ onDone, doneLabel = 'Fortsätt' }: { onDone: () => void; doneLabel?: string }) {
  const content = selfCheck()
  const [marked, setMarked] = useState<ReadonlySet<number>>(new Set())
  const [showAdvice, setShowAdvice] = useState(false)

  const toggle = (id: number) =>
    setMarked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const { urgent, others } = adviceFor(content.questions, marked)

  if (showAdvice) {
    return (
      <>
        <div className="stack safety">
          {/* Akuthänvisningen kommer före allt annat. */}
          {urgent && (
            <>
              <Urgent advice={urgent.advice} />
              <p>{content.q1Note}</p>
            </>
          )}
          <h1>Råd just nu</h1>
          {others.length === 0 && !urgent && (
            <p className="lead">Inget av det du markerade kräver särskild hänsyn just nu. Du kan göra självkontrollen igen under Jag.</p>
          )}
          {others.map((q) => (
            <div key={q.id} className="stack" style={{ gap: 8 }}>
              <p className="secondary">{q.question}</p>
              <p>{q.advice}</p>
            </div>
          ))}
          <p className="secondary"><Link to="/hjalp">Hjälp och vård</Link></p>
        </div>
        <div className="actions">
          <PrimaryButton onClick={onDone}>{doneLabel}</PrimaryButton>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="stack">
        {urgent && <Urgent advice={urgent.advice} />}
        <h1>{content.title}</h1>
        <p className="lead">{content.intro}</p>
        <fieldset className="choices">
          <legend className="visually-hidden">Markera de frågor som stämmer för dig</legend>
          {content.questions.map((q) => (
            <label key={q.id} className="choice">
              <input type="checkbox" checked={marked.has(q.id)} onChange={() => toggle(q.id)} />
              <span>{q.question}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="actions">
        <PrimaryButton onClick={() => setShowAdvice(true)}>Visa råd</PrimaryButton>
      </div>
    </>
  )
}
