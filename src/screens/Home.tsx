import { Link } from 'react-router-dom'
import { modules, partMinutes, getPhase } from '../content'
import { useProgressMap } from '../db/repo'
import { courseStarted, currentModule, isStarted, modulesDone, nextPart, partRoute, partsDone } from '../logic/progress'
import { pad, PART_LABEL, PARTS } from '../model'
import { CourseToc } from '../ui/CourseToc'
import { ProgressLine, usePageTitle } from '../ui/Page'

// Hem: ger en omedelbar bild av hela kursen, hur långt användaren har kommit och hur hen fortsätter.

export function Home() {
  usePageTitle('Restore')
  const map = useProgressMap()
  if (!map) return null

  const current = currentModule(modules, map)
  const started = courseStarted(modules, map)
  const done = modulesDone(modules, map)
  const percent = Math.round((partsDone(modules, map) / (modules.length * PARTS.length)) * 100)
  const moduleStarted = current ? isStarted(map[current.id]) : false
  const part = current ? (nextPart(map[current.id]) ?? 'teori') : null

  return (
    <div className="page page-wide">
      <header className="page-header">
        <h1 className="display" tabIndex={-1}>Restore</h1>
        <p className="lead">Förstå stress. Träna återhämtning. Bygg vanor som håller.</p>
        <p className="secondary">
          En kurs i 17 moduler och sex faser. Varje modul består av teori, en praktisk övning, en tillämpning i vardagen
          och en reflektion.
        </p>
      </header>

      <section className="block" aria-labelledby="progression">
        <h2 id="progression" className="label">Din progression</h2>
        <p className="tabular">
          {current
            ? `Fas ${current.phase} av 6 · Modul ${current.number} av 17`
            : 'Alla 17 moduler är genomförda'}
        </p>
        <ProgressLine value={percent} label="Andel av kursen som är gjord" />
        <p className="secondary tabular">{done} av 17 moduler genomförda</p>
      </section>

      {current && part && (
        <section className="block" aria-labelledby="nasta">
          <h2 id="nasta" className="label">{started ? 'Fortsätt' : 'Börja här'}</h2>
          <div>
            <p className="heading">
              {pad(current.number)} {current.title}
            </p>
            <p className="secondary">
              Fas {current.phase} · {getPhase(current.phase).name} · {PART_LABEL[part]} · cirka {partMinutes(current, part)} min
            </p>
          </div>
          <div className="actions">
            {moduleStarted ? (
              <Link className="btn btn-primary" to={partRoute(current.id, part)}>Fortsätt</Link>
            ) : (
              <Link className="btn btn-primary" to={`/kurs/${current.id}`}>
                {started ? 'Starta modul' : 'Starta kursen'}
              </Link>
            )}
          </div>
        </section>
      )}

      <hr className="rule" />

      <section className="block" aria-labelledby="oversikt">
        <h2 id="oversikt">Kursöversikt</h2>
        <CourseToc map={map} />
        <p>
          <Link to="/kurs" className="text-link">Faserna med beskrivningar</Link>
        </p>
      </section>
    </div>
  )
}
