# Omstart av Restore – arkitekturgenomgång och beslut

Datum: 3 oktober 2026. Gren: `feature/omstart`.

Omstartsuppdraget har företräde framför `PRODUKTSPECIFIKATION.md` och `DESIGNSPRAK.md` där de krockar. Det här dokumentet listar vad som behölls, skrevs om och togs bort, och vilka konflikter som avgjordes.

## 1. Inventering av den tidigare koden

| Del | Beslut | Skäl |
| --- | --- | --- |
| Vite, React, TypeScript, PWA-konfiguration, Vitest, Playwright | Behålls | Fungerar och följer spec 14 |
| `tools/content-plugin.ts` (Markdown + frontmatter → JSON vid build) | Behålls | Bra abstraktion, oberoende av UI |
| Dexie-databasen och tabellerna i spec 9.2 | Behålls, version 2 | Små ändringar i `Progress` och `ExerciseSession`, se avsnitt 3 |
| `logic/exerciseFlow.ts` (tidsstyrd stegning) | Skrivs om | Ny stegmodell med viktade steg för kort och lång version |
| `logic/access.ts` (modul 1-grind) | Tas bort | Ingen spärr behövs när säkerhetsflödena tas bort |
| `logic/selfcheck.ts`, `logic/ratings.ts` (trösklar) | Tas bort | Säkerhetsalgoritmer tas bort ur kursflödet |
| `components/SelfCheck`, `components/Safety`, `screens/Safety` | Tas bort | Självkontroll, stoppregel och Landa nu tas bort |
| Alla skärmar och layouter | Skrivs om | Ny informationsarkitektur och navigation |
| `styles/*` | Skrivs om | Nytt designpass: typografi först, nästan inga kort |
| `content/safety/*`, `N1-landa-nu.md` | Tas bort | Ersätts av sidan *När Restore inte räcker* |
| `content/modules/01-saker-start/*` | Skrivs om | Ny terminologi och nytt språk |
| Alla tester | Skrivs om | Testar progression, persistens, innehåll och språk |

## 2. Ny informationsarkitektur

Huvudnavigering: **Hem · Kurs · Övningar · Mer**. Bottennavigering på mobil, diskret toppnavigering på desktop. Navigeringen syns överallt utom i övningsspelaren.

```
Hem                      Hero, progression, Fortsätt, hela kursens innehållsförteckning
Kurs                     Sex faser med beskrivning, moduler och progression
  Modul                  Ingress, lärandemål, de fyra delarna med status, Fortsätt
    Teori                Sektioner med rubrik, text, diagram, faktaruta, källor
    Praktik              Modulens övningar (syfte, gör så här, starta kort eller lång)
    Tillämpning          Vardagsexperiment, valfri logg, Markera som gjord
    Reflektion           Tre frågor och användbarhet 1–5
Övningar                 Övningar som introducerats, grupperade, med diskret historik
  Övning                 Syfte, gör så här, starta kort eller lång version
    Spelare              Fokuserat läge utan navigering
Mer
  Din progression        Översikt och självskattningar över tid
  Min plan               Introduceras i modul 17
  Kunskap                Begrepp och fördjupning
  Om Restore             Vad kursen är, evidens och källor
    När Restore inte räcker
  Inställningar          Textstorlek, ljud, offline och data
```

Varje sida utom Hem, Kurs, Övningar och Mer har en tillbakalänk till sin förälder. Det finns inga återvändsgränder.

## 3. Datamodell (ändringar mot spec 9.2)

- `Progress.steps` (forsta, kann, prova, reflektera) byter namn till `parts` (teori, praktik, tillampning, reflektion). Dexie version 2 migrerar befintliga rader.
- `Progress` får `openedAt`, `updatedAt` och `theorySeen` (id för lästa teoriavsnitt).
- `ExerciseSession` får `moduleId` och `noticed` (ja, nej, osäker). `stoppedEarlyTooMuch` och `after` tas bort.
- `Settings.safetyConfirmedAt` och `Settings.onboardedAt` tas bort.

## 4. Konflikter med specifikationen och hur de avgjordes

| Spec | Ny riktning | Beslut |
| --- | --- | --- |
| 3.2 Förstå · Känn efter · Prova · Reflektera | Teori · Praktik · Tillämpning · Reflektion | Ny terminologi överallt, även i data |
| 3.3 Modul 1 måste göras först | Ingen säkerhetsgrind | Alla moduler är öppna. Hem rekommenderar ordningen |
| 5.1 N1 Landa nu | Tas bort | Borttagen. O1 heter nu *Orientera dig i rummet* |
| 5.2 Stoppregel i varje manus | Bara relevant säkerhetsinfo | En mening där den behövs, till exempel vid andning: "Avsluta om du blir yr." |
| 5.3 "Avbröt du för att det blev för mycket?", "Hur har du det nu?" | Tas bort | Ersatt av frivilliga "Märkte du någon skillnad?" utan konsekvenser |
| 6.1 Självkontroll i modul 1 | Inga självmordsfrågor som introduktion | Borttagen ur appen |
| 6.2–6.4 Stoppregel, reaktioner, Hjälp och vård överallt | Proportionerlig friskvårdsmodell | En sida: Mer → Om Restore → När Restore inte räcker |
| 6.5 Trösklar på självskattning | Inga automatiska reaktioner | Borttagna. Självskattningen finns kvar som egen trend |
| 4, modul 1: bekräftelse om stoppregeln | Inga säkerhetsbekräftelser | Borttagen. Modul 1 har ett kort avsnitt om när man avslutar en övning och söker vård |
| 8.2 Fem flikar (Idag, Resan, Verktyg, Kunskap, Jag) | Fyra (Hem, Kurs, Övningar, Mer) | Kunskap och Jag-innehåll under Mer |
| 8.3 Första start med två skärmar | Hem ger direkt en mental modell | Ingen introduktionssekvens. Hem förklarar produkten |
| 9.1 forsta.md, prova.md, reflektera.md | Ny terminologi | `module.md` (metadata, tillämpning, reflektion) och `teori.md` |
| DESIGNSPRAK: hörnradie 14–16 px | Måttliga radier | 6–10 px |

Spec 12.3 (förbjudna påståenden) och 13 (juridik) gäller oförändrat. Spec 10 (integritet) gäller oförändrat.

## 5. Beslut under bygget

- **Allt innehåll är utkast.** Alla 17 modulers teori, tillämpning och ingress samt alla 23 övningar är nyskrivna och märkta `status: utkast`. Påståenden i teorin följer Förstå-avsnitten i spec 4 och källgrunden i spec 18. Inget har granskats av någon med vårdkompetens (spec 15.4).
- **Praktik räknas som gjord** när minst en av modulens övningar har genomförts från modulen. Varje övning visar sin egen status i modulens praktiklista. Egen kombination (H1) markeras som gjord manuellt.
- **Övningar visas under Övningar** när någon av deras moduler har öppnats eller påbörjats. Antalet ännu inte introducerade övningar anges diskret.
- **Kort och lång version** delar samma steg. Stegens tid fördelas efter vikt i manuset (`[2]` före steget betyder dubbel tid).
- **Självskattningen** finns kvar i modul 1, 9, 13 och 17 som frivillig del av tillämpningen, utan trösklar eller tolkning. Den visas under Mer → Din progression.
- **När Restore inte räcker** nämner, utöver 1177 och 112, Mind Självmordslinjen 90101 vid självmordstankar. Det är den enda platsen i appen med hjälplinjer.
- **Tidsuppskattningar** räknas fram: teori efter ordantal (180 ord per minut), praktik efter första övningens korta version, tillämpning 2 minuter, reflektion 4 minuter.
- **Min plan** syns under Mer men är öppen först när modul 17 har öppnats.
- **Fasavslut** visas efter sista reflektionen i en fas, med fasens lärandemål i formen ”Det här kan du nu”.
- **Ljud** finns inte ännu. Övningarna körs i textläge med tidsangivelse.
