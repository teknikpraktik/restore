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

- **Module**: id, nummer, titel, beskrivning, mål (`mal`, sedan 3.0), kapitel-id.
- **Chapter**: id, nummer (räknas fram), modul, titel, beskrivning, förkunskaper, lärandemål, studietid, innehållsstatus, kontrollstatus, övningar, rubriker, citerade källor, obligatorisk teori i ord och minuter, övningstid och antal Upptäck-, Reflektera- och Tillämpa-rutor (sedan 3.0).
- **ChapterContent** (laddas vid behov): teori som HTML och kunskapskontroll.
- **Quiz / QuizQuestion**: frågetyp (sedan 3.0 främst situation, förståelse, tillämpning och slutsats), fråga, alternativ, rätt alternativ, förklaring. Godkäntgräns 0,8.
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

Produktionsdomän: **<https://restore-your-mind.vercel.app>**

Vercels Git-integration bygger varje push i projektet `teknikpraktik/restore` och rapporterar resultatet till GitHub. `main` är produktionsgren. `vercel.json` skriver om alla adresser till `index.html` så att direktlänkar fungerar. Ingen server, databas eller miljövariabel används.

Vercel Authentication är aktiverat med Standard Protection. Produktionsdomänen är därför publik, medan förhandsversioner och enskilda deploymentadresser (`restore-<hash>-teknikpraktik.vercel.app`, `restore-teknikpraktik.vercel.app`) kräver inloggning. Använd bara produktionsdomänen för att verifiera produktionen.

`restore-delta.vercel.app`, som anges som hemsida i GitHub-förrådet, är en annan webbplats och hör inte till projektet.

### Verifiering av produktion, 18 oktober 2026

Produktionsdeployment av commit `7e9f534`.

- `https://restore-your-mind.vercel.app/` svarar `200 OK` utan omdirigering eller inloggning.
- Webbplatsen levererar samma bygge som det lokala produktionsbygget (`assets/index-C5vJScJV.js`, `assets/index-TVHOONrV.css`).
- Alla routes (`/kurs`, `/kurs/<id>`, `/ovningar`, `/ovningar/<id>`, `/progression`, `/kallor`, `/om`, `/installningar` och okända adresser) svarar 200 via SPA-omskrivningen. `sw.js`, `manifest.webmanifest` och ikonerna svarar 200.
- Hela e2e-sviten (`tests/e2e/kurs.spec.ts`, 5 tester) kördes mot produktionsdomänen och gick igenom: kunskapskontroll med underkänt och godkänt försök, grön bock som består efter omladdning, laborationsprotokoll, återställning, expansion av alla 15 moduler och öppning av alla 118 underkapitel, gamla hashadresser och mobilnavigering utan horisontell overflow.
- I webbläsaren: inga konsolfel, kapitlets innehållsfil laddas separat, formlerna renderas utan KaTeX-fel och service workern är aktiv.

För att köra e2e-sviten mot produktion: använd en Playwright-konfiguration med `baseURL: 'https://restore-your-mind.vercel.app'` och utan `webServer`.

## 7. Kända begränsningar

- Progression synkroniseras inte mellan enheter.
- Kapitelnummer i läroboksreferenserna har inte kontrollerats mot tryckt exemplar (anges i källförteckningen).
- Innehållet har inte granskats av extern fackgranskare.
- Mörkt läge finns inte; designen är avsiktligt svart på vitt.
