# Produktion av ett underkapitel

Arbetsgång för att fylla ett underkapitel som är markerat `under-produktion`. Underkapitel 1.1 *Homeostas och negativ återkoppling* är referensexemplet för nivå, struktur och källhantering.

## 1. Planera

1. Läs kapitlets post i `content/kursplan.yaml`: beskrivning, förkunskaper och planerade lärandemål. Justera lärandemålen om ämnet kräver det.
2. Kontrollera angränsande kapitel så att ämnet inte överlappar. Varje ämne har en huvudplats.
3. Ta fram källor i prioritetsordning: lärobok, systematisk översikt eller metaanalys, randomiserad studie, observationsstudie, preliminär forskning.

## 2. Källor

1. Lägg varje källa i `content/kallor.yaml` med DOI, ISBN eller länk.
2. Kontrollera DOI:n mot Crossref och läs åtminstone sammanfattningen (PubMed). Varje siffra som återges i texten ska finnas i det som har lästs.
3. Fyll i `verifierad` med datum och exakt vad som kontrollerades. Kan källan inte kontrolleras: utelämna `verifierad`, så visas den som overifierad.
4. Kör `npm run verify:sources`.

## 3. Teori

Skriv `content/kapitel/<id>.md`. Rubriken (h1) kommer från kursplanen. Använd `##` och `###` för avsnitt; de blir den lokala innehållsförteckningen.

Täck: vad fenomenet är, strukturer, mekanismer, mätning, forskningsläge, begränsningar och tillämpning. Avsluta med en sammanfattning.

Syntax:

```markdown
Text med källa [@cannon1929] eller flera [@hall2021, kap. 1; @modell2015].

$$
\Delta y = \frac{d}{1 + |F|}
\tag{5}
$$

::: definition Homeostas
…
:::

::: rakneexempel Rubrik      (även fakta, modell, forenkling, sakerhet)
…
:::

::: evidens experimentell Rubrik     (eller etablerad)
…
:::

::: figur
bild: /illustrationer/reglerkrets.webp
alt: Beskrivning av vad bilden visar
bildtext: Figur 1. …
kalla: Tecknare, underlag
:::
```

Skriv decimaltal med komma i text och som `{,}` i formler. Långa formler delas med `aligned` så att de ryms på mobil.

## 4. Övningar

Skapa `content/ovningar/<id>.md` med frontmatter (`titel`, `sammanfattning`, `system`, `typ`, `tid`, `svarighetsgrad`, `evidens`, `utrustning`, `matvarden`) och avsnitten i denna ordning:

Syfte · Teoretisk bakgrund · Genomförande · Observationer · Förväntat resultat · Tolkning · Evidensläge · Begränsningar · Variationer · (Säkerhet) · (Analysfrågor)

Utrustning skrivs i frontmatter och visas som avsnitt automatiskt. En befintlig övning kan återanvändas i flera kapitel genom att läggas till i kapitlets `ovningar`.

## 5. Kunskapskontroll

Skapa `content/kontroller/<id>.yaml` med 5–8 frågor. Varje fråga har `id`, `typ` (begrepp, orsak-verkan, tillampning, berakning, resonemang), `fraga`, 3–5 `alternativ`, `ratt` (1 = första alternativet) och `forklaring`. Varje fråga ska mäta ett av kapitlets lärandemål. Felaktiga alternativ ska vara rimliga missförstånd, inte uppenbart fel, och förklaringen ska säga varför de är fel.

## 6. Publicera

1. Ändra kapitlets `innehall` till `producerad`, `kontroll` till `klar` och fyll i `ovningar` och `studietid`.
2. Kör `npm test`, `npm run build` och `npm run e2e`. Bygget avbryts om något saknas eller är fel.
3. Granska kapitlet på desktop och mobil.
