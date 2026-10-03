import fs from 'node:fs'
import path from 'node:path'

// Sökning i ALL användartext: innehållsfiler och gränssnittskod.
// Omstartens förbjudna fraser, spec 12.3 (förbjudna påståenden) och 12.2 (ton).

const walk = (d: string): string[] =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))

const files = [...walk('content'), ...walk('src')].filter((f) => /\.(md|json|tsx?)$/.test(f))

const FORBIDDEN: [string, RegExp][] = [
  // Omstarten: mystik, terapispråk och vag nervsystemsretorik
  ['landa', /\blanda(r|t|de)?\b/i],
  ['Landa nu', /landa nu/i],
  ['checka in', /checka in/i],
  ['lyssna inåt', /lyssna inåt/i],
  ['möt kroppen', /möt(a)? kroppen/i],
  ['trygghet', /trygg/i],
  ['hitta tillbaka', /hitta tillbaka/i],
  ['reglera nervsystemet', /reglera (ditt |sitt )?nervsystem/i],
  ['släppa stress', /släpp\w* (ut )?(stress|trauma|känslor)/i],
  ['lagrad stress', /lagra(d|s)/i],
  ['energier', /\benergier\b/i],
  ['läkning', /läk(a|er|ning)\b/i],
  ['kroppens visdom', /kroppens visdom/i],
  ['vagus', /vagus/i],
  ['somatisk release', /somatisk release/i],
  ['nervsystemet behöver', /nervsystemet behöver/i],
  ['inre resa', /inre resa|energi(flöde|n i kroppen)/i],
  // Spec 12.3
  ['botar', /\bbot(a|ar)\b/i],
  ['fastnat', /fastnat/i],
  ['dysreglerat', /dysregler/i],
  ['binjurar', /binjur/i],
  ['hormon', /hormon/i],
  ['säker i alla lägen', /säkra? i alla lägen/i],
  // Spec 12.2: inget beröm, inga streaks eller poäng
  ['streak', /streak|i rad\b/i],
  ['poäng', /poäng|\bxp\b|badge/i],
  ['beröm', /fantastisk|grym|bra jobbat|snyggt/i],
  // Borttagna säkerhetsflöden
  ['för mycket-frågan', /blev det för mycket/i],
  ['stoppregel', /stoppregel/i],
  ['självkontroll', /självkontroll/i],
]

describe('språk i all användartext', () => {
  for (const file of files) {
    it(file.replace(/\\/g, '/'), () => {
      const text = fs.readFileSync(file, 'utf8')
      for (const [name, re] of FORBIDDEN) expect(text, `${name} (${re})`).not.toMatch(re)
      // Utropstecken i text: ett utropstecken direkt efter en bokstav. Kodens ! föregås av ) ] eller mellanslag.
      expect(text, 'utropstecken').not.toMatch(/[a-zåäöA-ZÅÄÖ]![\s"'<`]/)
    })
  }
})
