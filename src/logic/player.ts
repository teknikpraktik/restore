export type TimedStep = { text: string; seconds: number }

export type PlayerState = { index: number; elapsedInStep: number; paused: boolean; done: boolean }

export const initialPlayer: PlayerState = { index: 0, elapsedInStep: 0, paused: false, done: false }

export function tick(state: PlayerState, steps: TimedStep[], dtMs: number): PlayerState {
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

export const totalMs = (steps: TimedStep[]) => steps.reduce((s, x) => s + x.seconds * 1000, 0)

export const elapsedMs = (state: PlayerState, steps: TimedStep[]) =>
  steps.slice(0, state.index).reduce((s, x) => s + x.seconds * 1000, 0) + state.elapsedInStep

export const formatClock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
