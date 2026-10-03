// Modul 1 kan inte hoppas över (spec 3.3). Returnerar null om vägen är tillåten, annars omdirigeringsmål.

export type AccessState = { onboarded: boolean; module1Done: boolean }

const ALWAYS_OPEN = [/^\/landa-nu$/, /^\/hjalp$/, /^\/ovning\/N1(\/|$)/]
const ONBOARDING = [/^\/valkommen$/, /^\/kursen$/]
const MODULE1 = [/^\/modul\/m01(\/|$)/, /^\/ovning\/O1(\/|$)/]
const GATED = [/^\/modul\//, /^\/ovning\//]

const matches = (patterns: RegExp[], path: string) => patterns.some((p) => p.test(path))

export function resolveAccess(path: string, state: AccessState): string | null {
  if (matches(ALWAYS_OPEN, path)) return null
  if (!state.onboarded) return matches(ONBOARDING, path) ? null : '/valkommen'
  if (state.module1Done) return null
  if (matches(GATED, path) && !matches(MODULE1, path)) return '/'
  return null
}
