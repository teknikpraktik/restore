import type { ModuleStatus, PartStatus } from '../logic/progress'

// Status visas med symbol och text för skärmläsare, inte med färgkodning.

export const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  done: 'Genomförd',
  active: 'Pågår',
  todo: 'Ej påbörjad',
}

export const PART_STATUS_LABEL: Record<PartStatus, string> = {
  done: 'Gjord',
  current: 'Pågår',
  todo: 'Ej gjord',
}

const Glyph = ({ status }: { status: ModuleStatus | PartStatus }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    {status === 'done' ? (
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ) : status === 'todo' ? (
      <circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    ) : (
      <circle cx="8" cy="8" r="4.5" fill="currentColor" />
    )}
  </svg>
)

export function Mark({ status, label }: { status: ModuleStatus | PartStatus; label: string }) {
  return (
    <span className={`mark mark-${status}`}>
      <Glyph status={status} />
      <span className="visually-hidden">{label}</span>
    </span>
  )
}

export function Legend() {
  return (
    <p className="legend secondary" aria-hidden="true">
      <span><Mark status="done" label="" /> Genomförd</span>
      <span><Mark status="active" label="" /> Pågår</span>
      <span><Mark status="todo" label="" /> Ej påbörjad</span>
    </p>
  )
}
