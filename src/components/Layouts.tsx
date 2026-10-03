import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { getSettings, isModuleDone } from '../db/repo'
import { type AccessState, resolveAccess } from '../logic/access'

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
)

const TABS = [
  { to: '/', label: 'Idag', end: true, icon: icon('M12 4v2M12 18v2M4 12h2M18 12h2M8 12a4 4 0 108 0 4 4 0 00-8 0') },
  { to: '/resan', label: 'Resan', end: false, icon: icon('M6 5a2 2 0 100 4 2 2 0 000-4zM18 15a2 2 0 100 4 2 2 0 000-4zM8 7h5a3 3 0 010 6h-2a3 3 0 000 6h5') },
  { to: '/verktyg', label: 'Verktyg', end: false, icon: icon('M5 8h14M5 16h14M9 6v4M15 14v4') },
  { to: '/kunskap', label: 'Kunskap', end: false, icon: icon('M5 5h6a1 1 0 011 1v13a2 2 0 00-2-2H5zM19 5h-6a1 1 0 00-1 1v13a2 2 0 012-2h5z') },
  { to: '/jag', label: 'Jag', end: false, icon: icon('M12 5a3 3 0 100 6 3 3 0 000-6zM6 19a6 6 0 0112 0') },
]

/** Kontrollerar åtkomst: första start och modul 1 kan inte hoppas över. */
export function AccessGuard() {
  const { pathname } = useLocation()
  // Läser om tillståndet vid varje navigering så att en nyss gjord skrivning alltid syns.
  const [checked, setChecked] = useState<{ path: string; state: AccessState } | null>(null)
  useEffect(() => {
    let live = true
    void (async () => {
      const state = {
        onboarded: !!(await getSettings()).onboardedAt,
        module1Done: await isModuleDone('m01'),
      }
      if (live) setChecked({ path: pathname, state })
    })()
    return () => {
      live = false
    }
  }, [pathname])
  if (!checked || checked.path !== pathname) return null
  const redirect = resolveAccess(pathname, checked.state)
  if (redirect && redirect !== pathname) return <Navigate to={redirect} replace />
  return <Outlet />
}

/** Skal med bottennavigering. */
export function TabLayout() {
  return (
    <div className="app has-tabs">
      <main className="page" id="main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Huvudnavigering">
        <ul>
          {TABS.map((t) => (
            <li key={t.to}>
              <NavLink to={t.to} end={t.end}>
                {t.icon}
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/** Sessioner och övningsläge: navigeringen döljs. */
export function SessionLayout() {
  return (
    <div className="app">
      <main className="page" id="main">
        <Outlet />
      </main>
    </div>
  )
}

/** Övningsläge: avskalad, något mörkare yta. */
export function ExerciseLayout() {
  return (
    <div className="app exercise">
      <main className="page" id="main">
        <Outlet />
      </main>
    </div>
  )
}
