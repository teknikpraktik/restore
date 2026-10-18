import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { chapterHref, getChapter, moduleChapters, moduleHref, modules } from '../course'
import { isPassed, useProgress } from '../progress/store'
import { CheckMark, Chevron } from './common'

/** Aktivt kapitel eller aktiv modul utifrån adressen. */
export function activeFromPath(pathname: string) {
  const m = pathname.match(/^\/kurs\/modul\/([^/]+)/)
  if (m) return { moduleId: m[1], chapterId: undefined }
  const c = pathname.match(/^\/kurs\/([^/]+)/)
  const chapter = c ? getChapter(decodeURIComponent(c[1])) : undefined
  return { moduleId: chapter?.moduleId, chapterId: chapter?.id }
}

/**
 * Kursnavigeringen genereras helt från kursmanifestet. Varje modul kan fällas ut och ihop.
 * Modulen med det aktiva kapitlet är utfälld.
 */
export function CourseNav({ onNavigate, idPrefix = 'nav' }: { onNavigate?: () => void; idPrefix?: string }) {
  const { pathname } = useLocation()
  const { moduleId, chapterId } = activeFromPath(pathname)
  const progress = useProgress()
  const [open, setOpen] = useState<Set<string>>(() => new Set(moduleId ? [moduleId] : []))

  useEffect(() => {
    if (moduleId) setOpen((s) => (s.has(moduleId) ? s : new Set(s).add(moduleId)))
  }, [moduleId])

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <nav className="course-nav" aria-label="Kursens innehåll">
      <p className="course-nav-title">
        <Link to="/kurs" onClick={onNavigate} aria-current={pathname === '/kurs' ? 'page' : undefined}>
          Kursens innehåll
        </Link>
      </p>
      <ol className="nav-modules">
        {modules.map((m) => {
          const chapters = moduleChapters(m)
          const isOpen = open.has(m.id)
          const passed = chapters.filter((c) => isPassed(progress, c.id)).length
          const listId = `${idPrefix}-modul-${m.id}`
          return (
            <li key={m.id} className={`nav-module ${moduleId === m.id ? 'is-current' : ''}`}>
              <button
                type="button"
                className="nav-module-toggle"
                aria-expanded={isOpen}
                aria-controls={listId}
                onClick={() => toggle(m.id)}
              >
                <Chevron open={isOpen} />
                <span className="nav-module-number">{m.number}</span>
                <span className="nav-module-title">{m.title}</span>
                {passed > 0 && (
                  <span className="nav-module-count" aria-label={`${passed} av ${chapters.length} godkända`}>
                    {passed}/{chapters.length}
                  </span>
                )}
              </button>
              <ol id={listId} className="nav-chapters" hidden={!isOpen}>
                <li>
                  <Link
                    to={moduleHref(m.id)}
                    className="nav-chapter nav-module-overview"
                    aria-current={pathname === moduleHref(m.id) ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    <span className="nav-chapter-number" aria-hidden="true" />
                    <span className="nav-chapter-title">Modulöversikt</span>
                  </Link>
                </li>
                {chapters.map((c) => {
                  const done = isPassed(progress, c.id)
                  const planned = c.content !== 'producerad'
                  return (
                    <li key={c.id}>
                      <Link
                        to={chapterHref(c.id)}
                        className={`nav-chapter ${planned ? 'is-planned' : ''} ${done ? 'is-passed' : ''}`}
                        aria-current={chapterId === c.id ? 'page' : undefined}
                        onClick={onNavigate}
                      >
                        <span className="nav-chapter-number">{c.number}</span>
                        <span className="nav-chapter-title">
                          {c.title}
                          {planned && <span className="visually-hidden"> (under produktion)</span>}
                        </span>
                        {done && <CheckMark label="Godkänd kunskapskontroll" />}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
