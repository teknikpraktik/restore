import { useLocation, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/ui'
import { ReactionsView, StopRuleView } from '../components/Safety'
import { SelfCheck } from '../components/SelfCheck'
import { helpAndCare } from '../content'

export function HjalpOchVard() {
  // På den här skärmen ska användaren hitta rätt kontakt.
  const c = helpAndCare()
  const navigate = useNavigate()
  return (
    <>
      <div className="stack safety">
        <h1>{c.title}</h1>
        <p className="lead">{c.intro}</p>
        <div>
          {c.contacts.map((k) => (
            <div key={k.tel} className="help-row">
              <div>
                <p><strong>{k.name}</strong></p>
                <p className="secondary">{k.when}</p>
              </div>
              <a className="btn-secondary" href={`tel:${k.tel}`} aria-label={`Ring ${k.name}`}>Ring {k.tel}</a>
            </div>
          ))}
        </div>
        <ReactionsView />
      </div>
      <div className="actions">
        <PrimaryButton onClick={() => navigate(-1)}>Tillbaka</PrimaryButton>
      </div>
    </>
  )
}

export function LandaNu() {
  // På den här skärmen ska användaren landa och komma tillbaka till rummet.
  const navigate = useNavigate()
  const fromStop = (useLocation().state as { from?: string } | null)?.from === 'stopp'
  return (
    <>
      <div className="stack safety">
        <h1>Landa nu</h1>
        {fromStop && (
          <p className="lead">Det är rätt att avbryta när det blir för mycket. Gör så här nu.</p>
        )}
        <StopRuleView />
      </div>
      <div className="actions">
        <PrimaryButton to="/ovning/N1/kor">Starta Landa nu</PrimaryButton>
        <button type="button" className="btn-text" onClick={() => navigate(-1)}>Tillbaka</button>
      </div>
    </>
  )
}

export function Sjalvkontroll() {
  // På den här skärmen ska användaren markera det som stämmer och läsa råden.
  const navigate = useNavigate()
  return <SelfCheck onDone={() => navigate('/jag')} doneLabel="Klart" />
}
