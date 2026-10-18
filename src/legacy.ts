// Restore 1 använde HashRouter (#/kurs/…, #/mer/…). Gamla bokmärken och PWA-genvägar
// skickas till motsvarande sida i den nya strukturen i stället för att ge ett fel.

const MAP: [RegExp, string][] = [
  [/^\/kurs(\/.*)?$/, '/kurs'],
  [/^\/ovningar(\/.*)?$/, '/ovningar'],
  [/^\/mer\/progression/, '/progression'],
  [/^\/mer\/installningar/, '/installningar'],
  [/^\/mer\/om/, '/om'],
  [/^\/mer\/kunskap/, '/kallor'],
  [/^\/mer(\/.*)?$/, '/progression'],
]

/** Returnerar ny adress för en gammal hashadress, eller null om adressen inte är en sådan. */
export function legacyRedirect(hash: string): string | null {
  if (!hash.startsWith('#/')) return null
  const path = hash.slice(1).split('?')[0]
  if (path === '/') return '/'
  for (const [re, to] of MAP) if (re.test(path)) return to
  return '/'
}
