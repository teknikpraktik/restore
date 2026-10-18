# Arkitektur och inventering – Restore 2.0

18 oktober 2026, gren `feature/restore-2`.

## 1. Inventering av Restore 1 (Etapp A)

| Del | Restore 1 | Beslut | Skäl |
| --- | --- | --- | --- |
| Ramverk | Vite 8, React 19, TypeScript 7 | Behålls | Fungerar, snabbt, statiskt bygge |
| Routning | react-router 7 med `HashRouter` | Behålls, byts till `BrowserRouter` | Hashrouting krockar med ankarlänkar till rubriker och källor. Gamla `#/…`-adresser översätts (`src/legacy.ts`) |
| Innehållspipeline | Vite-plugin som läste Markdown och frontmatter till JSON | Behålls som idé, skrivs om | Ny datamodell, validering, KaTeX, källhänvisningar och uppdelning i chunkar |
| Markdowntolk | Egen radbaserad tolk | Ersätts av markdown-it | Tabeller, formler och rutor kräver en riktig tolk |
| Lagring | Dexie (IndexedDB) | Ersätts av `localStorage` | Progressionen är liten och enkel; export, inläsning och tester blir enklare. Dexie och fake-indexeddb togs bort |
| PWA | vite-plugin-pwa, autoUpdate | Behålls | Komplicerar inte och ger offlineläsning. Färger och beskrivning uppdaterade, `navigateFallback` för BrowserRouter |
| Skärmar | Hem, Kurs, Modul (teori, praktik, tillämpning, reflektion), spelare, Mer | Tas bort | Ny informationsarkitektur |
| Sexfasstruktur, 17 moduler | `phases.json`, `content/modules/` | Tas bort | Ny kursplan med 15 moduler |
| Guidade sessioner och spelare | `logic/player.ts`, `Exercise.tsx` | Tas bort | Övningar är laborationer, inte tidsstyrda sessioner |
| Självskattningar, reflektion | `Scale`, `Reflection`, `Rating` | Tas bort | Terapeutiskt inriktade |
| Bottennavigering | `Shell` | Tas bort | Ingen bottennavigering i 2.0 |
| ”När Restore inte räcker”, hjälplinjer | `content/about/` | Tas bort | Avdramatiserad vårdinformation; kort avgränsning på Om-sidan |
| Designtokens | Varm palett med grön accent | Ersätts | Svartvitt; grönt bara för bockar |
| Tester | Vitest, Testing Library, Playwright | Behålls som verktyg, skrivs om | Nya krav |
| Driftsättning | Vercels Git-integration | Behålls | `vercel.json` med SPA-omskrivning tillagd. Se avsnitt 6 |
| Dokument | `PRODUKTSPECIFIKATION.md`, `DESIGNSPRAK.md`, `docs/omstart.md` | Flyttade till `docs/historik/`, ersatta | Historiska underlag |

## 2. Struktur

```
content/
  kursplan.yaml              Kursmanifest: moduler och underkapitel med metadata
  kapitel/<id>.md            Teori för producerade underkapitel
  kontroller/<id>.yaml       Kunskapskontroller
  ovningar/<id>.md           Övningsbiblioteket (frontmatter + standardavsnitt)
  kallor.yaml                Källförteckning med verifieringsuppgifter
  sidor/start.md, om.md      Löptext för startsidan och Om Restore
tools/
  course-build.ts            Läser och validerar content/, bygger CourseBuild
  markdown.ts                Markdown, KaTeX, källhänvisningar, rutor, figurer, rubrik-id
  content-plugin.ts          Vite-plugin: virtual:course och virtual:course-part/*
  verify-sources.mjs         Kontroll av DOI:er mot Crossref (manuell, kräver nätverk)
src/
  course/types.ts            Datamodell (delas av byggsteg och gränssnitt)
  course/index.ts            Åtkomst till kursen, laddning av kapitel- och övningsinnehåll
  course/quiz.ts             Rättning
  progress/store.ts          Progression i localStorage, export, inläsning, återställning
  ui/                        Ramverk: SiteLayout, CourseNav, Quiz, Figure, gemensamma delar
  pages/                     Sidor
  styles/base.css            Hela stilmallen
tests/unit, tests/e2e        Vitest och Playwright
```

## 3. Datamodell

Innehåll och presentation är åtskilda. Inga texter finns i komponenterna utöver gränssnittstexter.

- **Module**: id, nummer, titel, beskrivning, kapitel-id.
- **Chapter**: id, nummer (räknas fram), modul, titel, beskrivning, förkunskaper, lärandemål, studietid, innehållsstatus, kontrollstatus, övningar, rubriker, citerade källor, lästid.
- **ChapterContent** (laddas vid behov): teori som HTML och kunskapskontroll.
- **Quiz / QuizQuestion**: frågetyp, fråga, alternativ, rätt alternativ, förklaring. Godkäntgräns 0,8.
- **Exercise**: id, titel, sammanfattning, system, typ, tid, svårighetsgrad, utrustning, evidensläge, mätfält, källor, kapitel (räknas fram). **ExerciseContent**: standardavsnitten.
- **Source**: typ, författare, år, titel, tidskrift, volym, nummer, sidor, DOI/ISBN/URL, verifiering, kortcitat, formaterad referens, kapitel och moduler där den används.
- **ProgressState** (`localStorage`): försök och godkännande per kapitel, protokoll per övning, senast öppnade kapitel. Versionerat format.

Ett nytt underkapitel läggs till genom en post i `kursplan.yaml`. Menyn, numreringen, modulsidorna, progressionen och källförteckningen uppdateras automatiskt.

## 4. Byggsteg och validering

`buildCourse()` körs när Vite laddar `virtual:course`. Allt valideras och bygget avbryts med en samlad fellista om något är fel, till exempel:

- ogiltiga eller dubbla id, förkunskaper som saknas eller kommer senare i kursen
- producerat kapitel utan teorifil, eller kapitel under produktion med teori, övningar eller kontroll
- kontroll med fel antal frågor (5–8), fel antal alternativ, dubbla alternativ eller ogiltigt rätt svar
- övning som saknar något av de tio standardavsnitten eller har okänd typ, system eller evidensnivå
- källhänvisning till en källa som inte finns, källa utan DOI/ISBN/URL, källa som inte citeras
- otillåtna formuleringar enligt språkreglerna
- felaktig TeX (KaTeX med `throwOnError`)

## 5. Prestanda

Kursens metadata ingår i huvudpaketet (cirka 430 kB, 128 kB komprimerat, inklusive React). Teori och kontroller ligger i en egen chunk per kapitel, och övningstexter i en chunk per övning. Huvudpaketet växer därför bara med metadata när fler kapitel produceras. Service workern förhandsladdar alla chunkar för offlineläsning.

## 6. Driftsättning

Vercels Git-integration bygger varje push i projektet `teknikpraktik/restore` och rapporterar resultatet till GitHub. `vercel.json` skriver om alla adresser till `index.html` så att direktlänkar fungerar. Ingen server, databas eller miljövariabel används.

Läget 18 oktober 2026:

- Förhandsversionen av `feature/restore-2` (commit `30342ea`) byggdes utan fel enligt Vercels status på GitHub.
- Alla projektets `*.vercel.app`-adresser kräver inloggning (Vercel Authentication) och kunde inte granskas utan behörighet.
- Push till `main` gav ingen produktionsdeployment. Den senaste produktionsdeploymenten är från 3 oktober (commit `e45aa0d`). Projektets produktionsgren eller inställningar för automatisk driftsättning behöver kontrolleras i Vercel.
- `restore-delta.vercel.app`, som anges som hemsida i GitHub-förrådet, visar en annan webbplats och hör inte till projektet.

## 7. Kända begränsningar

- Progression synkroniseras inte mellan enheter.
- Kapitelnummer i läroboksreferenserna har inte kontrollerats mot tryckt exemplar (anges i källförteckningen).
- Innehållet har inte granskats av extern fackgranskare.
- Mörkt läge finns inte; designen är avsiktligt svart på vitt.
