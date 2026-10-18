# Produktion av ett delkapitel

Arbetsgång för Restore 3.0. Modul 1 *Kroppen söker balans* är referensexemplet för nivå, längd, ton och upplägg. Den pedagogiska modellen beskrivs i [pedagogik.md](pedagogik.md).

## 1. Planera

1. Läs kapitlets post i `content/kursplan.yaml` och modulens mål (`mal`). Skriv om rubrik och lärandemål till vardagsspråk om de fortfarande är från 2.0.
2. Fråga för varje teoridel: behöver deltagaren veta detta, hjälper det hen att förstå sin kropp eller sitt beteende, leder det till något praktiskt, kan det sägas enklare utan att bli fel, hör det hemma i en frivillig fördjupning? Stryk hellre än flytta.
3. Välj högst två till tre nya fackbegrepp.
4. Välj två Upptäck-uppgifter och ett vardagsexperiment innan texten skrivs. Teorin ska förklara det deltagaren sedan undersöker.

## 2. Källor

1. Lägg nya källor i `content/kallor.yaml` med DOI, ISBN eller länk.
2. Kontrollera DOI:n mot Crossref och läs minst sammanfattningen. Varje siffra i texten ska finnas i det som har lästs.
3. Fyll i `verifierad` med datum och vad som kontrollerades.
4. Kör `npm run verify:sources`.

Källor som inte längre citeras får ligga kvar som underlag.

## 3. Text

Skriv `content/kapitel/<id>.md`. Rubriken kommer från kursplanen. Teorin, det vill säga allt utanför rutorna nedan, ska normalt kunna läsas på 2–4 minuter (300–600 ord).

```markdown
Inledning med en igenkännbar situation.

## Rubrik som ett påstående eller en vardagsfråga

Kort förklaring med källa [@cannon1929].

::: upptack 2 min Rubrik
1. Numrerade, sakliga instruktioner.
:::

::: reflektera
- En fråga om observation, förståelse eller tillämpning.
:::

::: tillampa Rubrik
Ett experiment att pröva senare i dag eller under veckan.
:::

::: fordjupning Rubrik
Frivilligt, kort och ihopfällt.
:::

## Det viktigaste

- Tre till fyra punkter.
```

Övriga rutor från 2.0 (`definition`, `fakta`, `modell`, `forenkling`, `rakneexempel`, `sakerhet`, `evidens`) och formler (`$...$`) fungerar fortfarande men används sparsamt.

**Ton:** skriv för vuxna. Inga försiktighetsfraser som "om det känns obehagligt" eller "du kan avbryta när du vill", inga uppmuntrande tillrop och inga telefonnummer till vården i löptexten. Andningsövningar kräver aldrig andningsuppehåll eller snabb djup andning. Där en övning innebär ansträngning anges det i en mening.

**Undvik** påståenden om att stress lagras i kroppen, att övningar läker nervsystemet, polyvagala förklaringar, ett "dåligt" sympatiskt och "bra" parasympatiskt nervsystem, och att en förnimmelse bevisar att något har förändrats.

## 4. Längre övningar

Skapa `content/ovningar/<id>.md` med frontmatter (`titel`, `sammanfattning`, `system`, `typ`, `tid`, `svarighetsgrad`, `evidens`, `utrustning`, `matvarden`) och avsnitten Syfte · Teoretisk bakgrund · Genomförande · Observationer · Förväntat resultat · Tolkning · Evidensläge · Begränsningar · Variationer · (Säkerhet) · (Analysfrågor). Skriv kort och i vardagsspråk, 400–500 ord. Behåll befintliga `matvarden`-id när en övning skrivs om, så att deltagarnas anteckningar fortsätter att visas.

## 5. Självtest

Skapa `content/kontroller/<id>.yaml` med fem frågor av typerna `situation`, `forstaelse`, `tillampning` och `slutsats`. Ungefär två frågor har flera rätta svar: ange då `ratt: [1, 3]`, och formulera frågan som "Vilka …". Felalternativen ska vara rimliga missförstånd. Förklaringen säger varför rätt svar är rätt och varför ett vanligt felsvar är fel. Fördela rätt svar över alternativens positioner. Inga beräkningar, medicinska detaljer eller terminologiska fällor. Grön bock kräver alla rätt.

## 6. Publicera

1. Sätt `innehall: producerad`, `kontroll: klar` och `ovningar`. Studietiden räknas fram automatiskt: läsning + Upptäck + en minut per reflektionsruta och fråga.
2. Kör `npm test`, `npm run build` och `npm run e2e`. Bygget stoppar om mallen inte följs.
3. Läs kapitlet på desktop och mobil, och gör alla Upptäck-uppgifter själv.
