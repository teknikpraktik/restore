import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Loaded } from '../course'

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Restore' ? 'Restore' : `${title} – Restore`
  }, [title])
}

/** Sidans rubrik. Får fokus vid sidbyte så att skärmläsare hamnar rätt. */
export function PageTitle({ children, eyebrow }: { children: React.ReactNode; eyebrow?: React.ReactNode }) {
  return (
    <header className="page-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 tabIndex={-1}>{children}</h1>
    </header>
  )
}

/** Teori och annat innehåll som har renderats till HTML vid bygget. */
export function Prose({ html, className = '' }: { html: string; className?: string }) {
  return <div className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

export function CheckMark({ label = 'Godkänd' }: { label?: string }) {
  return (
    <svg className="check" viewBox="0 0 16 16" width="16" height="16" role="img" aria-label={label}>
      <path d="M3.2 8.4 6.4 11.4 12.8 4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`chevron ${open ? 'is-open' : ''}`} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function formatDate(iso: string, withTime = false) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit' })
  return withTime ? `${date} ${d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}` : date
}

export function NotFoundContent({ title = 'Sidan finns inte', children }: { title?: string; children?: React.ReactNode }) {
  useTitle(title)
  return (
    <div className="page narrow">
      <PageTitle>{title}</PageTitle>
      {children ?? <p>Adressen motsvarar ingen sida i Restore. Den kan ha tillhört den tidigare versionen av kursen.</p>}
      <ul className="link-list">
        <li>
          <Link to="/">Till startsidan</Link>
        </li>
        <li>
          <Link to="/kurs">Till kursens innehåll</Link>
        </li>
        <li>
          <Link to="/ovningar">Till övningsbiblioteket</Link>
        </li>
      </ul>
    </div>
  )
}

/** Flyttar fokus till ett element när ett villkor blir sant, till exempel resultatet av en kontroll. */
export function useFocusWhen<T extends HTMLElement>(when: unknown) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (when) ref.current?.focus()
  }, [when])
  return ref
}

/** Visar innehåll som laddas separat, med en diskret text under tiden. */
export function Loading<T>({ state, children }: { state: Loaded<T>; children: (data: T) => React.ReactNode }) {
  if (state.status === 'ready') return <>{children(state.data)}</>
  if (state.status === 'error')
    return (
      <p className="notice-inline" role="alert">
        Innehållet kunde inte laddas. Kontrollera anslutningen och ladda om sidan.
      </p>
    )
  return (
    <p className="loading" aria-live="polite">
      Laddar innehållet …
    </p>
  )
}
