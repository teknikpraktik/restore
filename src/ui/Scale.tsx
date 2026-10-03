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
    <div className="field" role="group" aria-label={label}>
      <p style={{ fontWeight: 600 }}>{label}</p>
      <div className={`scale scale-${values.length}`}>
        {values.map((n) => (
          <button key={n} type="button" aria-pressed={value === n} onClick={() => onChange(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="scale-ends secondary" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}
