import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CourseNav } from './CourseNav'

export const SITE_LINKS = [
  { to: '/kurs', label: 'Kurs' },
  { to: '/ovningar', label: 'Övningar' },
  { to: '/progression', label: 'Min progression' },
  { to: '/kallor', label: 'Källor' },
  { to: '/om', label: 'Om Restore' },
]

/** Vid sidbyte: börja högst upp (eller vid ankaret) och flytta fokus till sidans rubrik. */
function useRouteFocus() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
    if (first.current) {
      first.current = false
      return
    }
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }, [pathname, hash])
}

/**
 * Webbplatsens ram: sidhuvud med huvudnavigering och, på smala skärmar, en meny som
 * innehåller både webbplatsens sidor och hela kursnavigeringen.
 */
export function SiteLayout() {
  useRouteFocus()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const menuButton = useRef<HTMLButtonElement>(null)
  const drawer = useRef<HTMLDivElement>(null)

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    drawer.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <div className="site">
      <a className="skip-link" href="#innehall">
        Hoppa till innehållet
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            Restore
          </Link>
          <nav className="site-nav" aria-label="Huvudnavigering">
            <ul>
              {SITE_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            ref={menuButton}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobilmeny"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'Stäng' : 'Meny'}
          </button>
        </div>
      </header>

      <div
        id="mobilmeny"
        ref={drawer}
        className="drawer"
        data-open={menuOpen}
        hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Meny"
      >
        <nav aria-label="Webbplatsen" className="drawer-site">
          <ul>
            <li>
              <NavLink to="/" end onClick={close}>
                Start
              </NavLink>
            </li>
            {SITE_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} onClick={close}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/installningar" onClick={close}>
                Inställningar
              </NavLink>
            </li>
          </ul>
        </nav>
        <CourseNav onNavigate={close} idPrefix="mobilmeny" />
      </div>
      {menuOpen && <div className="drawer-backdrop" onClick={close} aria-hidden="true" />}

      <div id="innehall" className="site-main">
        <Outlet />
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>
            Restore är utbildning och frivillig egenutveckling, inte sjukvård eller diagnostik. Progressionen sparas
            bara i den här webbläsaren.
          </p>
          <p>
            <Link to="/om">Om Restore</Link> · <Link to="/kallor">Källor</Link> ·{' '}
            <Link to="/installningar">Inställningar</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

/** Kursvyn: kursnavigering till vänster (från bred skärm) och läsyta. */
export function CourseLayout() {
  return (
    <div className="course-layout">
      <aside className="course-sidebar">
        <CourseNav />
      </aside>
      <main className="course-main">
        <Outlet />
      </main>
    </div>
  )
}

/** Övriga sidor: en läsyta utan kursnavigering. */
export function PageLayout() {
  return (
    <main className="page-main">
      <Outlet />
    </main>
  )
}
