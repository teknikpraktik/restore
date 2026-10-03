import { Link } from 'react-router-dom'
import { getModule, phases } from '../content'
import type { ProgressMap } from '../db/repo'
import { moduleStatus } from '../logic/progress'
import { pad } from '../model'
import { Mark, MODULE_STATUS_LABEL } from './Status'

/** Hela kursen som innehållsförteckning: faser, moduler och status. */
export function CourseToc({ map, detailed = false }: { map: ProgressMap; detailed?: boolean }) {
  const H = detailed ? 'h2' : 'h3'
  return (
    <div className={detailed ? 'toc toc-detailed' : 'toc'}>
      {phases.map((ph) => {
        const mods = ph.modules.map((id) => getModule(id)!)
        const done = mods.filter((m) => moduleStatus(map[m.id]) === 'done').length
        return (
          <section key={ph.id} className="toc-phase" aria-labelledby={`fas-${ph.id}`}>
            <div className="toc-phase-head">
              <H id={`fas-${ph.id}`}>
                {detailed ? <><span className="label" style={{ display: 'block' }}>Fas {ph.id}</span>{ph.name}</> : `${ph.id} · ${ph.name}`}
              </H>
              {detailed && <span className="secondary tabular">{done} av {mods.length}</span>}
            </div>
            {detailed && <p className="secondary toc-desc">{ph.description}</p>}
            <ol className="toc-list">
              {mods.map((m) => {
                const s = moduleStatus(map[m.id])
                return (
                  <li key={m.id}>
                    <Link to={`/kurs/${m.id}`} className="toc-row">
                      <Mark status={s} label={MODULE_STATUS_LABEL[s]} />
                      <span className="toc-num">{pad(m.number)}</span>
                      <span className="toc-title">{m.title}</span>
                      <span className="secondary" aria-hidden="true">
                        {detailed && s === 'active' ? 'Pågår' : ''}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </div>
  )
}
