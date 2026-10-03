import { type ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from './icons'

export type Back = { to: string; label: string }

export function BackLink({ to, label }: Back) {
  return (
    <Link className="back" to={to}>
      <ChevronLeft />
      {label}
    </Link>
  )
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Restore' ? 'Restore' : `${title} · Restore`
  }, [title])
}

type PageProps = {
  title: string
  label?: ReactNode
  lead?: ReactNode
  back?: Back
  wide?: boolean
  children?: ReactNode
}

/** Standardsida: tillbakalänk, etikett, rubrik, ingress och innehåll. */
export function Page({ title, label, lead, back, wide, children }: PageProps) {
  usePageTitle(title)
  return (
    <div className={wide ? 'page page-wide' : 'page'}>
      {back && <BackLink {...back} />}
      <header className="page-header">
        {label && <p className="label">{label}</p>}
        <h1 tabIndex={-1}>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </header>
      {children}
    </div>
  )
}

export function ProgressLine({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-line"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}
