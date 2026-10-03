import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/ui'
import { updateSettings } from '../db/repo'

export function Valkommen() {
  // På den här skärmen ska användaren förstå vad Restore är och inte är.
  return (
    <>
      <div className="stack grow" style={{ justifyContent: 'center' }}>
        <h1>Restore</h1>
        <p className="lead">En självstudiekurs för vuxna som vill förstå och hantera stress i vardagen.</p>
        <p>
          Du lär dig märka kroppens signaler och övar enkla verktyg, till exempel andning, orientering, rörelse och
          pauser.
        </p>
        <p>
          Restore är träning och utbildning. Det är inte vård, inte terapi, inte ett diagnosverktyg och inte en
          meditationsapp.
        </p>
      </div>
      <div className="actions">
        <PrimaryButton to="/kursen">Fortsätt</PrimaryButton>
      </div>
    </>
  )
}

export function HurKursenFungerar() {
  // På den här skärmen ska användaren förstå hur kursen fungerar och gå vidare till modul 1.
  const navigate = useNavigate()
  const start = async () => {
    await updateSettings({ onboardedAt: new Date() })
    navigate('/modul/m01')
  }
  return (
    <>
      <div className="stack grow" style={{ justifyContent: 'center' }}>
        <h1>Hur kursen fungerar</h1>
        <p className="lead">Kursen har 17 moduler i sex faser. Du bestämmer tempot.</p>
        <p>Varje modul har fyra steg: Förstå, Känn efter, Prova och Reflektera.</p>
        <p>Det finns inga deadlines. Du kan fortsätta när du vill, även efter ett långt uppehåll.</p>
        <p>
          Det finns ingen registrering. Allt du skriver sparas bara på din enhet. Byter du telefon försvinner det om du
          inte har sparat en kopia.
        </p>
        <p>Du börjar med modul 1, som handlar om hur du använder kursen säkert.</p>
      </div>
      <div className="actions">
        <PrimaryButton onClick={start}>Börja med modul 1</PrimaryButton>
      </div>
    </>
  )
}
