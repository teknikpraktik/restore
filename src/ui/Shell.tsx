import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSettings } from '../db/repo'
import { CourseIcon, ExerciseIcon, HomeIcon, MoreIcon } from './icons'

const NAV = [
  { to: '/', label: 'Hem', icon: <HomeIcon /> },
  { to: '/kurs', label: 'Kurs', icon: <CourseIcon /> },
  { to: '/ovningar', label: 'Övningar', icon: <ExerciseIcon /> },
  { to: '/mer', label: 'Mer', icon: <MoreIcon /> },
]

/** Vilken flik en sida hör till. En övning som öppnats från en modul hör till Kurs. */
export function activeTab(pathname: string, search: string) {
  const fromModule = new URLSearchParams(search).has('modul')
  if (pathname.startsWith('/ovningar')) return fromModule ? '/kurs' : '/ovningar'
  if (pathname.startsWith('/kurs')) return '/kurs'
  if (pathname.startsWith('/mer')) return '/mer'
  return '/'
}

/** Textstorlek från inställningarna gäller i hela appen, även i spelaren. */
export function TextSize() {
  const settings = useSettings()
  useEffect(() => {
    if (settings) document.documentElement.dataset.textSize = settings.textSize
  }, [settings])
  return null
}

/** Vid sidbyte: börja högst upp och flytta fokus till sidans rubrik. */
function useRouteFocus() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    if (first.current) {
      first.current = false
      return
    }
    requestAnimationFrame(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
  }, [pathname])
}

/** Huvudnavigering: bottenrad på mobil, diskret topprad på desktop. Samma struktur överallt. */
export function Shell() {
  useRouteFocus()
  const { pathname, search } = useLocation()
  const active = activeTab(pathname, search)
  return (
    <div className="shell">
      <nav className="nav" aria-label="Huvudnavigering">
        <div className="nav-inner">
          <span className="nav-brand" aria-hidden="true">Restore</span>
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} aria-current={active === n.to ? 'page' : undefined}>
                  {n.icon}
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="main" id="main">
        <Outlet />
      </main>
    </div>
  )
}

/** Fokuserat läge för övningsspelaren: ingen navigering. */
export function FocusLayout() {
  useRouteFocus()
  return (
    <main className="player" id="main">
      <Outlet />
    </main>
  )
}
