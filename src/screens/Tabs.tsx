import { Link } from 'react-router-dom'
import { HelpLink, LandaNuButton, TextButton } from '../components/ui'
import { exerciseIds, getExercise, totalSeconds } from '../content'

const Head = ({ title }: { title: string }) => (
  <header className="page-head">
    <h1>{title}</h1>
    <div>
      <LandaNuButton compact />
      <HelpLink />
    </div>
  </header>
)

export function Resan() {
  // På den här skärmen ska användaren välja fas eller modul.
  return (
    <>
      <Head title="Resan" />
      <p className="lead">Visa var i kursen användaren är och ge åtkomst till alla faser och moduler.</p>
    </>
  )
}

export function Kunskap() {
  // På den här skärmen ska användaren välja ett ämne att läsa.
  return (
    <>
      <Head title="Kunskap" />
      <p className="lead">Låta användaren läsa om begrepp och källor i lugn takt.</p>
    </>
  )
}

export function Jag() {
  // På den här skärmen ska användaren nå plan, utveckling, säkerhet eller inställningar.
  return (
    <>
      <Head title="Jag" />
      <p className="lead">Samla plan, utveckling, säkerhet, inställningar och data.</p>
      <nav aria-label="Säkerhet" className="stack" style={{ gap: 0 }}>
        <div className="help-row"><Link to="/sjalvkontroll">Självkontroll</Link></div>
      </nav>
    </>
  )
}

export function Verktyg() {
  // På den här skärmen ska användaren välja en övning.
  const tools = exerciseIds().map((id) => getExercise(id)!)
  return (
    <>
      <header className="page-head">
        <h1>Verktyg</h1>
        <HelpLink />
      </header>
      <div>
        <LandaNuButton />
      </div>
      <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0, gap: 0 }}>
        {tools.map((t) => {
          const secs = totalSeconds(t.scripts.short ?? [])
          return (
            <li key={t.id} className="help-row">
              <div>
                <TextButton to={`/ovning/${t.id}`}>{t.title}</TextButton>
                <p className="secondary" style={{ paddingLeft: 8 }}>{t.summary}</p>
              </div>
              <span className="secondary">{Math.max(1, Math.round(secs / 60))} min</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
