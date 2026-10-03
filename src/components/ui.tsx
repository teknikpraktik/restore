import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  to?: string
  state?: unknown
  disabled?: boolean
  label?: string
}

export function PrimaryButton({ children, onClick, to, state, disabled, label }: ButtonProps) {
  if (to) return <Link className="btn-primary" to={to} state={state} aria-label={label}>{children}</Link>
  return <button type="button" className="btn-primary" onClick={onClick} disabled={disabled} aria-label={label}>{children}</button>
}

export function SecondaryButton({ children, onClick, to, state, label }: ButtonProps) {
  if (to) return <Link className="btn-secondary" to={to} state={state} aria-label={label}>{children}</Link>
  return <button type="button" className="btn-secondary" onClick={onClick} aria-label={label}>{children}</button>
}

export function TextButton({ children, onClick, to, label }: ButtonProps) {
  if (to) return <Link className="btn-text" to={to} aria-label={label}>{children}</Link>
  return <button type="button" className="btn-text" onClick={onClick} aria-label={label}>{children}</button>
}

export const PhaseLabel = ({ children }: { children: ReactNode }) => <p className="label">{children}</p>

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <span style={{ width: `${percent}%` }} />
    </div>
  )
}

const HandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19h16M12 5v10M7 10l5 5 5-5" />
  </svg>
)

/** Landa nu: sekundärknapp med enkel ikon, alltid samma placering (designspråket). */
export function LandaNuButton({ compact = false }: { compact?: boolean }) {
  if (compact) return <TextButton to="/landa-nu">Landa nu</TextButton>
  return (
    <Link className="btn-secondary" to="/landa-nu">
      <HandIcon />
      Landa nu
    </Link>
  )
}

export const HelpLink = () => <TextButton to="/hjalp">Hjälp och vård</TextButton>

type ScaleProps = {
  label: string
  min: number
  max: number
  value: number | null
  onChange: (n: number) => void
  low: string
  high: string
}

/** Horisontell skala utan förvalt värde, med ändpunktstext. */
export function Scale({ label, min, max, value, onChange, low, high }: ScaleProps) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  return (
    <div className="stack" role="group" aria-label={label} style={{ gap: 8 }}>
      <p>{label}</p>
      <div className="scale" style={{ gridTemplateColumns: `repeat(${values.length}, 1fr)` }}>
        {values.map((n) => (
          <button key={n} type="button" aria-pressed={value === n} aria-label={`${n}`} onClick={() => onChange(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="scale-ends secondary">
        <span>{min} {low}</span>
        <span>{max} {high}</span>
      </div>
    </div>
  )
}
