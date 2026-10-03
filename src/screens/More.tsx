import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { aboutPage, concepts, exercises, getModule, getSource, modules, notEnoughPage, phases, sources } from '../content'
import {
  deleteAll, exportAll, getPlan, savePlan, updateSettings, useCompletedCounts, useProgressMap, useSettings,
} from '../db/repo'
import { db } from '../db/schema'
import { isIntroduced, moduleStatus, partsDone } from '../logic/progress'
import { pad, PARTS } from '../model'
import { ChevronRight } from '../ui/icons'
import { Page } from '../ui/Page'
import { Prose } from '../ui/Prose'

const back = { to: '/mer', label: 'Mer' }

function Row({ to, title, text }: { to?: string; title: string; text: string }) {
  const inner = (
    <>
      <span className="row-main">
        <span className="row-title">{title}</span>
        <span className="secondary">{text}</span>
      </span>
      {to && <ChevronRight />}
    </>
  )
  return <li>{to ? <Link className="row" to={to}>{inner}</Link> : <div className="row row-disabled">{inner}</div>}</li>
}

export function More() {
  const map = useProgressMap()
  const planOpen = !!map?.m17 && (!!map.m17.openedAt || Object.keys(map.m17.parts).length > 0)
  return (
    <Page title="Mer">
      <ul className="rows">
        <Row to="/mer/progression" title="Din progression" text="Moduler, delar, övningar och självskattningar." />
        <Row
          to={planOpen ? '/mer/plan' : undefined}
          title="Min plan"
          text={planOpen ? 'Dina verktyg, varningssignaler och kontakter.' : 'Introduceras i modul 17.'}
        />
        <Row to="/mer/kunskap" title="Kunskap" text="Begrepp som används i kursen." />
        <Row to="/mer/om" title="Om Restore" text="Vad kursen är, evidens och källor, och när Restore inte räcker." />
        <Row to="/mer/installningar" title="Inställningar" text="Textstorlek, ljud, offline och data." />
      </ul>
    </Page>
  )
}

export function ProgressOverview() {
  const map = useProgressMap()
  const counts = useCompletedCounts()
  const ratings = useLiveQuery(() => db.ratings.orderBy('id').toArray())
  if (!map) return <Page title="Din progression" back={back} />

  const done = modules.filter((m) => moduleStatus(map[m.id]) === 'done').length
  const sessions = Object.values(counts ?? {}).reduce((a, b) => a + b, 0)
  const occasionLabel = (o: string) => (o === 'extra' ? 'Extra' : `Modul ${o.slice(1)}`)

  return (
    <Page title="Din progression" back={back}>
      <section className="block" aria-labelledby="sammanfattning">
        <h2 id="sammanfattning" className="visually-hidden">Sammanfattning</h2>
        <dl className="definitions stats">
          <div><dt>Moduler genomförda</dt><dd className="tabular">{done} av {modules.length}</dd></div>
          <div><dt>Delar gjorda</dt><dd className="tabular">{partsDone(modules, map)} av {modules.length * PARTS.length}</dd></div>
          <div><dt>Genomförda övningspass</dt><dd className="tabular">{sessions}</dd></div>
        </dl>
      </section>

      <section className="block" aria-labelledby="faser">
        <h2 id="faser">Per fas</h2>
        <table className="table">
          <thead><tr><th scope="col">Fas</th><th scope="col">Genomförda moduler</th></tr></thead>
          <tbody>
            {phases.map((ph) => (
              <tr key={ph.id}>
                <td>{ph.id} · {ph.name}</td>
                <td>{ph.modules.filter((id) => moduleStatus(map[id]) === 'done').length} av {ph.modules.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="block" aria-labelledby="skattningar">
        <h2 id="skattningar">Självskattningar</h2>
        <p className="secondary">Siffrorna är till för dig. De är inte ett test. Skalan är 0–10, för den senaste veckan.</p>
        {ratings?.length ? (
          <table className="table">
            <thead>
              <tr><th scope="col">Tillfälle</th><th scope="col">Datum</th><th scope="col">Stress</th><th scope="col">Sömn</th><th scope="col">Återhämtning</th></tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id}>
                  <td>{occasionLabel(r.occasion)}</td>
                  <td>{r.createdAt.toLocaleDateString('sv-SE')}</td>
                  <td>{r.stress}</td>
                  <td>{r.sleep}</td>
                  <td>{r.recovery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Inga skattningar än. Den första görs i tillämpningen i modul 1.</p>
        )}
      </section>
    </Page>
  )
}

export function Plan() {
  const map = useProgressMap()
  const stored = useLiveQuery(async () => (await getPlan()) ?? null)
  const [tools, setTools] = useState<string[]>([])
  const [habits, setHabits] = useState('')
  const [warningSigns, setWarningSigns] = useState('')
  const [actions, setActions] = useState('')
  const [contacts, setContacts] = useState('Vårdcentralen\n1177\n112 vid akut fara')
  const [loaded, setLoaded] = useState(false)
  const [savedAt, setSavedAt] = useState<Date>()

  useEffect(() => {
    if (stored === undefined || loaded) return
    if (stored) {
      setTools(stored.tools)
      setHabits(stored.habits.join('\n'))
      setWarningSigns(stored.warningSigns)
      setActions(stored.actions)
      setContacts(stored.contacts)
    }
    setLoaded(true)
  }, [stored, loaded])

  const available = map ? exercises.filter((e) => !e.combination && isIntroduced(e, modules, map)) : []
  const toggle = (id: string) => setTools((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))

  const save = async () => {
    await savePlan({ tools, habits: habits.split('\n').map((h) => h.trim()).filter(Boolean), warningSigns, actions, contacts })
    setSavedAt(new Date())
  }

  const download = () => {
    const name = (id: string) => exercises.find((e) => e.id === id)?.title ?? id
    const text = [
      'Min plan – Restore',
      '',
      'Mina verktyg',
      ...tools.map((t) => `- ${name(t)}`),
      '',
      'Mina vardagsvanor',
      habits,
      '',
      'Mina varningssignaler',
      warningSigns,
      '',
      'Det här gör jag då',
      actions,
      '',
      'Hit vänder jag mig',
      contacts,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'min-plan.txt' })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Page title="Min plan" back={back} lead="Planen för de kommande tre månaderna. Den skrivs i modul 17 och kan ändras när som helst.">
      <fieldset className="field">
        <legend>Mina verktyg</legend>
        <p className="secondary">Välj tre till fem övningar.</p>
        {available.map((e) => (
          <label key={e.id} className="check">
            <input type="checkbox" checked={tools.includes(e.id)} onChange={() => toggle(e.id)} />
            {e.title}
          </label>
        ))}
      </fieldset>
      <div className="field">
        <label htmlFor="vanor">Mina vardagsvanor</label>
        <textarea id="vanor" value={habits} placeholder="En vana per rad, högst tre." onChange={(e) => setHabits(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="signaler">Mina varningssignaler</label>
        <textarea id="signaler" value={warningSigns} onChange={(e) => setWarningSigns(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="handling">Det här gör jag då</label>
        <textarea id="handling" value={actions} onChange={(e) => setActions(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="kontakter">Hit vänder jag mig</label>
        <textarea id="kontakter" value={contacts} onChange={(e) => setContacts(e.target.value)} />
      </div>
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={save}>Spara planen</button>
        <button type="button" className="btn btn-secondary" onClick={download}>Ladda ned som text</button>
      </div>
      {savedAt && <p className="secondary" role="status">Planen sparades {savedAt.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}.</p>}
    </Page>
  )
}

export function Knowledge() {
  return (
    <Page title="Kunskap" back={back} lead="Begrepp som används i kursen, med hänvisning till modul och källa.">
      <dl className="definitions">
        {concepts.map((c) => {
          const m = getModule(c.module)
          return (
            <div key={c.term}>
              <dt>{c.term}</dt>
              <dd>{c.text}</dd>
              <dd className="secondary">
                {m && <Link className="text-link" to={`/kurs/${m.id}`}>Modul {pad(m.number)} {m.title}</Link>}
                {c.sources.length > 0 && ` · ${c.sources.map((s) => getSource(s)?.short).join('; ')}`}
              </dd>
            </div>
          )
        })}
      </dl>
    </Page>
  )
}

export function About() {
  return (
    <Page title={aboutPage.title} back={back}>
      <Prose sections={aboutPage.sections} />
      <section className="block" aria-labelledby="nar-inte">
        <h2 id="nar-inte">När Restore inte räcker</h2>
        <p>Restore är utbildning och friskvård. Här står när du bör söka vård och vart du vänder dig.</p>
        <p><Link className="text-link" to="/mer/om/nar-restore-inte-racker">När Restore inte räcker</Link></p>
      </section>
      <section className="block" aria-labelledby="kallor">
        <h2 id="kallor">Källor</h2>
        <ol className="sources-list">
          {sources.filter((s) => Number(s.id.slice(1)) <= 18).map((s) => <li key={s.id} id={s.id}>{s.text}</li>)}
        </ol>
      </section>
    </Page>
  )
}

export function NotEnough() {
  return (
    <Page title={notEnoughPage.title} back={{ to: '/mer/om', label: 'Om Restore' }}>
      <Prose sections={notEnoughPage.sections} />
      <section className="block" aria-labelledby="kontakter">
        <h2 id="kontakter">Vart du vänder dig</h2>
        <ul className="rows">
          {notEnoughPage.contacts?.map((c) => (
            <li key={c.tel}>
              <div className="row">
                <span className="row-main">
                  <span className="row-title">{c.name}</span>
                  <span className="secondary">{c.when}</span>
                </span>
                <a className="btn btn-secondary" href={`tel:${c.tel}`} style={{ minHeight: 44 }}>Ring {c.tel}</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}

export function Settings() {
  const settings = useSettings()
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState('')

  const doExport = async () => {
    const data = await exportAll()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `restore-data-${new Date().toLocaleDateString('sv-SE')}.json` })
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Filen har laddats ned.')
  }

  const doDelete = async () => {
    await deleteAll()
    setConfirming(false)
    setMessage('All data på den här enheten är raderad.')
  }

  return (
    <Page title="Inställningar" back={back}>
      <fieldset className="block">
        <legend className="heading" style={{ marginBottom: 12 }}>Textstorlek</legend>
        <div className="segmented">
          {(['default', 'large'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={settings?.textSize === v} onClick={() => updateSettings({ textSize: v })}>
              {v === 'default' ? 'Standard' : 'Större'}
            </button>
          ))}
        </div>
        <p className="secondary">Appen följer också enhetens inställning för textstorlek.</p>
      </fieldset>

      <section className="block" aria-labelledby="ljud">
        <h2 id="ljud">Ljud</h2>
        <p>Övningarna visas som text med tidsangivelse. Inspelat ljud med textning läggs till i en senare version.</p>
      </section>

      <section className="block" aria-labelledby="offline">
        <h2 id="offline">Offline och data</h2>
        <p>Appen fungerar utan nätverk när den har laddats en gång. Allt du skriver och markerar sparas bara på den här enheten. Byter du enhet följer data inte med, om du inte exporterar den.</p>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={doExport}>Exportera data</button>
          {!confirming && <button type="button" className="btn-plain" onClick={() => setConfirming(true)}>Radera all data</button>}
        </div>
        {confirming && (
          <div className="confirm" role="group" aria-label="Bekräfta radering">
            <p>Det här tar bort progression, anteckningar, reflektioner och skattningar på den här enheten. Det går inte att ångra.</p>
            <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={doDelete}>Radera</button>
              <button type="button" className="btn-plain" onClick={() => setConfirming(false)}>Avbryt</button>
            </div>
          </div>
        )}
        {message && <p className="secondary" role="status">{message}</p>}
      </section>
    </Page>
  )
}
