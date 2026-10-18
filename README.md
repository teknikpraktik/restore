# Restore

Vetenskaplig webbutbildning om människokroppens reglersystem, nervsystemet, stressfysiologi, andning, rörelse, sömn, belastning och återhämtning. Teori på ungefär högskolenivå kombineras med praktiska laborationer och automatiskt rättade kunskapskontroller.

Produktion: <https://restore-delta.vercel.app>

## Status

- Kursplan: 15 moduler, 118 underkapitel, alla synliga och öppningsbara.
- Färdigproducerat: underkapitel 1.1 *Homeostas och negativ återkoppling* med teori (cirka 3 900 ord), 3 laborationer, 8 kontrollfrågor och 31 kontrollerade källor.
- Övriga underkapitel: beskrivning och planerade lärandemål, märkta *under produktion*.

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

- [PRODUKTSPECIFIKATION.md](PRODUKTSPECIFIKATION.md) – vision, vetenskapliga krav, kursarkitektur, progression
- [DESIGNSPRAK.md](DESIGNSPRAK.md) – färg, typografi, layout och komponenter
- [docs/arkitektur.md](docs/arkitektur.md) – inventering av Restore 1, teknisk arkitektur, datamodell, validering
- [docs/innehallsproduktion.md](docs/innehallsproduktion.md) – hur ett underkapitel produceras
- [docs/historik/](docs/historik/) – specifikation och designspråk för Restore 1

## Data

Progressionen lagras bara lokalt i webbläsaren (`localStorage`). Den synkroniseras inte mellan enheter. Under *Inställningar* kan den exporteras till en fil, läsas in eller återställas.
