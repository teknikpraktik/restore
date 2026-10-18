// Kontrollerar att varje DOI i content/kallor.yaml finns i Crossref och att titel och år stämmer.
// Kräver nätverk och körs därför manuellt, inte i testsviten:  npm run verify:sources
//
// Avvikelser skrivs ut och ger felkod 1. En godkänd kontroll betyder att referensen finns och att
// de bibliografiska uppgifterna stämmer, inte att innehållet har granskats.

import fs from 'node:fs'
import { parse } from 'yaml'

const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const { kallor } = parse(fs.readFileSync('content/kallor.yaml', 'utf8'))
let problems = 0

for (const k of kallor) {
  if (!k.doi) {
    console.log(`–   ${k.id}: ingen DOI (${k.isbn ? `ISBN ${k.isbn}` : k.url ?? 'saknar identifierare'})`)
    continue
  }
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(k.doi)}`, {
      headers: { 'User-Agent': 'Restore source check (https://github.com/teknikpraktik/restore)' },
    })
    if (!res.ok) {
      problems++
      console.log(`FEL ${k.id}: Crossref svarade ${res.status} för ${k.doi}`)
      continue
    }
    const m = (await res.json()).message
    const title = m.title?.[0] ?? ''
    const year = (m.issued?.['date-parts']?.[0] ?? [])[0]
    const a = norm(title)
    const b = norm(k.titel)
    const titleOk = a.includes(b.slice(0, 40)) || b.includes(a.slice(0, 40))
    // Crossref anger ibland året för den elektroniska utgåvan, ett år före tryckt nummer.
    const yearOk = Math.abs(year - k.ar) <= 1
    if (titleOk && yearOk) console.log(`ok  ${k.id}`)
    else {
      problems++
      console.log(`FEL ${k.id}: Crossref anger "${title}" (${year}), kallor.yaml anger "${k.titel}" (${k.ar})`)
    }
  } catch (e) {
    problems++
    console.log(`FEL ${k.id}: ${e.message}`)
  }
  await new Promise((r) => setTimeout(r, 150))
}

console.log(problems ? `\n${problems} avvikelser.` : '\nAlla DOI:er stämmer mot Crossref.')
process.exit(problems ? 1 : 0)
