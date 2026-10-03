import type { SelfCheckQuestion } from '../content'

// Ren logik. Tar emot markeringar som argument och lagrar ingenting.

export const URGENT_ID = 1

export type SelfCheckAdvice = { urgent: SelfCheckQuestion | null; others: SelfCheckQuestion[] }

/** Fråga 1 returneras alltid separat så att den kan visas före allt annat. */
export function adviceFor(questions: SelfCheckQuestion[], marked: ReadonlySet<number>): SelfCheckAdvice {
  const hit = questions.filter((q) => marked.has(q.id))
  return {
    urgent: hit.find((q) => q.id === URGENT_ID) ?? null,
    others: hit.filter((q) => q.id !== URGENT_ID),
  }
}
