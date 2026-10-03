import type { ScriptStep } from '../content'

export type FlowState = {
  index: number
  elapsedInStep: number // ms
  paused: boolean
  done: boolean
}

export const initialFlow: FlowState = { index: 0, elapsedInStep: 0, paused: false, done: false }

export function tick(state: FlowState, steps: ScriptStep[], dtMs: number): FlowState {
  if (state.paused || state.done || steps.length === 0) return state
  let { index, elapsedInStep } = state
  elapsedInStep += dtMs
  while (elapsedInStep >= steps[index].seconds * 1000) {
    if (index === steps.length - 1) return { ...state, index, elapsedInStep: steps[index].seconds * 1000, done: true }
    elapsedInStep -= steps[index].seconds * 1000
    index++
  }
  return { ...state, index, elapsedInStep }
}

export const elapsedTotal = (state: FlowState, steps: ScriptStep[]) =>
  steps.slice(0, state.index).reduce((s, x) => s + x.seconds * 1000, 0) + state.elapsedInStep

/** Efter Avsluta i förtid: "för mycket" leder alltid till Landa nu (spec 5.3). */
export const routeAfterEarlyStop = (tooMuch: boolean): 'landa-nu' | 'tillbaka' =>
  tooMuch ? 'landa-nu' : 'tillbaka'

export const formatClock = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
