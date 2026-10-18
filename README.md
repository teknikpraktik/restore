# Restore

Praktiskt och vetenskapligt förankrat träningsprogram för stress och återhämtning, för vuxna utan förkunskaper. Varje kapitel växlar mellan korta förklaringar, praktiska uppgifter, reflektion och vardagsexperiment, och avslutas med ett självtest.

Produktion: <https://restore-your-mind.vercel.app>. Verifierad 18 oktober 2026, se [docs/arkitektur.md](docs/arkitektur.md#6-driftsättning).

Driftsättning via Vercels Git-integration (projektet `teknikpraktik/restore`, produktionsgren `main`). Förhandsversioner är skyddade med Vercel Authentication; produktionsdomänen är publik.

## Status

- Version 3.0. Kursplan: 15 moduler med vardagsnära namn och mål, 118 delkapitel.
- Färdigt: modul 1 *Kroppen söker balans* (pilot), 8 delkapitel med 16 korta övningar, 8 vardagsexperiment, 17 reflektionsfrågor, 40 självtestfrågor och 6 längre övningar.
- Modul 2–15: nya namn och mål. Delkapitlen är under produktion och skrivs om efter godkännande av piloten.

## Kommandon

```bash
npm install
npm run dev              # utvecklingsserver på http://localhost:5173
npm test                 # enhets- och komponenttester (Vitest)
npm run e2e              # end-to-end-tester mot produktionsbygget (Playwright)
npm run build            # typkontroll och produktionsbygge till dist/
npm run verify:sources   # kontrollera alla DOI:er mot Crossref (kräver nätverk)
```

## Dokumentation

- [PRODUKTSPECIFIKATION.md](PRODUKTSPECIFIKATION.md) – inriktning, pedagogisk modell, moduler, säkerhet, självtest
- [docs/pedagogik.md](docs/pedagogik.md) – inventering, mall, modulmål och granskning av modul 1
- [DESIGNSPRAK.md](DESIGNSPRAK.md) – färg, typografi, layout och komponenter
- [docs/arkitektur.md](docs/arkitektur.md) – inventering av Restore 1, teknisk arkitektur, datamodell, validering
- [docs/innehallsproduktion.md](docs/innehallsproduktion.md) – hur ett underkapitel produceras
- [docs/historik/](docs/historik/) – specifikationer och designspråk för Restore 1 och 2.0

## Data

Progressionen lagras bara lokalt i webbläsaren (`localStorage`). Den synkroniseras inte mellan enheter. Under *Inställningar* kan den exporteras till en fil, läsas in eller återställas.
