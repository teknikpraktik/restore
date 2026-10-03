import { reactions, stopRule } from '../content'

/** Stoppregeln ordagrant (spec 6.2). Typografi och placering, inte färg, markerar säkerhet. */
export function StopRuleView() {
  const r = stopRule()
  return (
    <section className="safety-block" aria-labelledby="stopp-rubrik">
      <h2 id="stopp-rubrik">{r.title}</h2>
      <p><strong>{r.stopIfTitle}</strong></p>
      <ul className="plain">{r.stopIf.map((s) => <li key={s}>{s}</li>)}</ul>
      <p><strong>{r.doTitle}</strong></p>
      <ol className="plain">{r.do.map((s) => <li key={s}>{s}</li>)}</ol>
      <p>{r.after}</p>
    </section>
  )
}

/** Normala reaktioner och varningstecken ordagrant (spec 6.3). */
export function ReactionsView() {
  const r = reactions()
  return (
    <section className="safety-block" aria-labelledby="reaktioner-rubrik">
      <h2 id="reaktioner-rubrik">{r.title}</h2>
      <p><strong>{r.commonTitle}</strong></p>
      <ul className="plain">{r.common.map((s) => <li key={s}>{s}</li>)}</ul>
      <p><strong>{r.careTitle}</strong></p>
      <ul className="plain">{r.care.map((s) => <li key={s}>{s}</li>)}</ul>
      <p><strong>{r.acuteTitle}</strong></p>
      <ul className="plain">{r.acute.map((s) => <li key={s}>{s}</li>)}</ul>
    </section>
  )
}
