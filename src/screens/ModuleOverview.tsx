import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getModule, getModuleByNumber, getPhase, partMinutes } from '../content'
import { markOpened, useProgressMap } from '../db/repo'
import { isStarted, moduleStatus, nextPart, partRoute, partStatus } from '../logic/progress'
import { pad, PART_LABEL, PARTS } from '../model'
import { ChevronRight } from '../ui/icons'
import { Page } from '../ui/Page'
import { Mark, PART_STATUS_LABEL } from '../ui/Status'

// Modulöversikt: vad modulen lär ut, dess fyra delar med status och nästa handling.

export function ModuleOverview() {
  const { moduleId } = useParams()
  const mod = getModule(moduleId)
  const map = useProgressMap()

  useEffect(() => {
    if (mod) void markOpened(mod.id)
  }, [mod])

  if (!mod) return <Navigate to="/kurs" replace />
  if (!map) return null

  const p = map[mod.id]
  const status = moduleStatus(p)
  const part = nextPart(p)
  const phase = getPhase(mod.phase)
  const prev = getModuleByNumber(mod.number - 1)
  const next = getModuleByNumber(mod.number + 1)
  const total = PARTS.reduce((s, x) => s + partMinutes(mod, x), 0)
  const theoryRead = p?.theorySeen?.length ?? 0

  return (
    <Page
      title={`${pad(mod.number)} ${mod.title}`}
      label={`Fas ${phase.id} · ${phase.name}`}
      lead={mod.intro}
      back={{ to: '/kurs', label: 'Kurs' }}
    >
      <section className="block" aria-labelledby="mal">
        <h2 id="mal">Efter modulen kan du</h2>
        <ul style={{ paddingLeft: '1.25em', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {mod.objectives.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </section>

      <section className="block" aria-labelledby="delar">
        <h2 id="delar">Modulens delar</h2>
        <ol className="rows">
          {PARTS.map((x, i) => {
            const s = partStatus(p, x)
            const meta =
              s === 'done'
                ? 'Gjord'
                : x === 'teori' && theoryRead > 0 && !p?.parts.teori
                  ? `${theoryRead} av ${mod.theory.length} avsnitt`
                  : `cirka ${partMinutes(mod, x)} min`
            return (
              <li key={x}>
                <Link to={partRoute(mod.id, x)} className="row">
                  <Mark status={s} label={PART_STATUS_LABEL[s]} />
                  <span className="row-main">
                    <span className="row-title">{i + 1}. {PART_LABEL[x]}</span>
                  </span>
                  <span className="row-meta tabular">{meta}</span>
                  <ChevronRight />
                </Link>
              </li>
            )
          })}
        </ol>
        <p className="secondary">
          Totalt cirka {total} minuter, plus {mod.application.days > 0 ? `${mod.application.days} dagar` : 'en stund'} i vardagen.
        </p>
      </section>

      <div className="block">
        {status === 'done' && <p>Modulen är genomförd.</p>}
        <div className="actions">
          {status === 'done' ? (
            next ? (
              <Link className="btn btn-primary" to={`/kurs/${next.id}`}>Nästa modul</Link>
            ) : (
              <Link className="btn btn-primary" to="/">Till Hem</Link>
            )
          ) : (
            <Link className="btn btn-primary" to={partRoute(mod.id, part ?? 'teori')}>
              {isStarted(p) ? 'Fortsätt' : 'Starta modul'}
            </Link>
          )}
        </div>
      </div>

      <nav className="inline-links secondary" aria-label="Andra moduler">
        {prev && <Link to={`/kurs/${prev.id}`} className="text-link">Föregående: {pad(prev.number)} {prev.title}</Link>}
        {next && <Link to={`/kurs/${next.id}`} className="text-link">Nästa: {pad(next.number)} {next.title}</Link>}
      </nav>
    </Page>
  )
}
