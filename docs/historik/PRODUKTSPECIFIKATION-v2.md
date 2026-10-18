# Restore 2.0 – produktspecifikation

Version 2.0, 18 oktober 2026. Ersätter specifikationen för Restore 1, som finns kvar i `docs/historik/`.

## 1. Vision

Restore är en webbaserad, vetenskapligt förankrad utbildning om människokroppen: reglersystem, nervsystem, stressfysiologi, andning, rörelse, sömn, fysisk och mental prestationsförmåga och återhämtning. Kunskapsdjupet motsvarar ungefär högskolenivå, skrivet för en motiverad vuxen läsare.

Den pedagogiska modellen är:

**Studera teori → förstå mekanismer → genomför praktiska experiment → kontrollera kunskaper → tillämpa i vardagen.**

Restore ska kännas som en digital universitetslärobok kombinerad med ett fysiologiskt laboratorium, inte som en terapiapp, mindfulnessprodukt eller wellnessplattform. Deltagaren ska få

1. en djupare, vetenskapligt hållbar förståelse av kroppens funktion, och
2. ett stort antal konkreta metoder och experiment för att undersöka och utveckla sin egen funktionsförmåga.

## 2. Avgränsning

Restore är utbildning och frivillig egenutveckling. Det är inte sjukvård, psykoterapi eller diagnostik och marknadsförs inte med behandlingspåståenden. Säkerhetsinformation ges kortfattat och sakligt där en övnings karaktär kräver det (ansträngning, yrsel, kontraindikationer). Den tidigare terapeutiska inramningen, säkerhetsintroduktionerna och de upprepade hänvisningarna till trauma och psykisk sjukdom är borttagna.

## 3. Ton och språk

Vetenskapligt, tekniskt korrekt, sakligt, pedagogiskt, precist och vuxet. Etablerad terminologi (homeostas, allostas, HPA-axeln, baroreflex, afferenta signaler, interoception, neuroplasticitet) används och förklaras. Inga terapeutiskt färgade formuleringar (till exempel ”landa i kroppen”, ”lugna din vagusnerv”). Övningsinstruktioner formuleras som observationer och mätningar: *Registrera andningsfrekvensen. Jämför före och efter. Beskriv vilka mekanismer som kan förklara förändringen.*

En lista över otillåtna formuleringar finns i `tools/course-build.ts` (`FORBIDDEN_PHRASES`) och kontrolleras vid varje bygge.

## 4. Vetenskaplig kvalitet

Detta är projektets viktigaste kvalitetskrav.

### 4.1 Evidensnivåer

- **Etablerad kunskap**: mekanismer och samband med starkt och brett stöd.
- **Experimentell metod**: metoder, interventioner eller hypoteser med preliminära, varierande eller otillräckligt klarlagda effekter.

En välbelagd mekanism innebär inte att en viss övning har dokumenterad praktisk effekt. Texten skiljer mellan forskningsresultat, teoretiska modeller och pedagogiska förenklingar och markerar dem med rutorna *Teoretisk modell*, *Pedagogisk förenkling* och *Evidensläge*.

### 4.2 Källor

Prioritetsordning: läroböcker i fysiologi och neurovetenskap, systematiska översikter och metaanalyser, randomiserade kontrollerade studier, större observationsstudier, tydligt identifierad preliminär forskning.

Varje källa har DOI, ISBN eller direktlänk och uppgift om när och hur den kontrollerades (`content/kallor.yaml`). Referenser hittas aldrig på. En källa som inte kunnat kontrolleras markeras som overifierad i gränssnittet. DOI:er kontrolleras mot Crossref med `npm run verify:sources`. Material från Smart Body, Smart Mind får inspirera ämnesval och övningstyper men är aldrig auktoritet för mekanismer, och inga texter kopieras.

### 4.3 Teorins omfattning

Varje underkapitel ska låta läsaren förstå vad fenomenet är, vilka strukturer som är involverade, vilka mekanismer som förklarar det, hur det kan mätas, vad forskningen visar, vilka osäkerheter som finns och hur kunskapen kan tillämpas. Längden styrs av ämnet; ett komplext kapitel kan vara 2 000–4 000 ord eller mer. Underrubriker, definitioner, faktarutor, tabeller, ekvationer (KaTeX) och räkneexempel används där de bidrar.

## 5. Kursarkitektur

15 moduler och 118 underkapitel, ordnade från fysiologiska grundprinciper till tillämpning. Den fullständiga kursplanen med lärandemål, förkunskaper och studietid finns i `content/kursplan.yaml`.

| Nr | Modul | Underkapitel |
| --- | --- | --- |
| 1 | Människokroppen som biologiskt reglersystem | 8 |
| 2 | Nervsystemets anatomi och signalering | 9 |
| 3 | Det autonoma nervsystemet | 8 |
| 4 | Stressfysiologi och neuroendokrin reglering | 9 |
| 5 | Perception och hjärnans informationsbearbetning | 7 |
| 6 | Interoception och kroppslig medvetenhet | 7 |
| 7 | Andningsfysiologi och andningsreglering | 8 |
| 8 | Muskler, rörelse och motorisk kontroll | 9 |
| 9 | Fysisk aktivitet och fysiologisk adaptation | 9 |
| 10 | Sömn och dygnsrytm | 9 |
| 11 | Kognition, uppmärksamhet och emotioner | 9 |
| 12 | Belastning, återhämtning och arbetsförmåga | 7 |
| 13 | Sociala relationer och fysiologiska responser | 6 |
| 14 | Beteendeförändring och vanebildning | 7 |
| 15 | Praktisk integration och individuella protokoll | 6 |

Varje underkapitel har unikt id, titel, beskrivning, förkunskaper, lärandemål, studietid, status för innehåll (`producerad` eller `under-produktion`), status för kunskapskontroll (`klar` eller `ej-producerad`) och koppling till övningar.

### 5.1 Principer för dispositionen

- Modul 1–3 ger grundbegrepp (reglering, nervsystem, autonom kontroll) som resten bygger på.
- Stressfysiologi (4) bygger på autonoma nervsystemet; perception och interoception (5–6) på sensoriska receptorer i modul 2.
- Andning, motorik, fysisk aktivitet och sömn (7–10) är organsystem och funktioner med tydliga mätbara variabler.
- Kognition, belastning och sociala faktorer (11–13) integrerar de tidigare modulerna.
- Beteendeförändring och individuella protokoll (14–15) omsätter kunskapen i egna, metodiskt sunda försök.
- Överlapp hanteras genom att ett ämne har en huvudplats och refereras därifrån, till exempel HRV (metod i 3.7, tillämpning i 12.6) och allostas (introduceras i 1.1, behandlas i 4.6).

### 5.2 Ej producerade underkapitel

Visar rubrik, ämnesbeskrivning, planerade lärandemål och upplysningen *Innehållet är under produktion*. Inga kunskapskontroller, övningar eller utfyllnadstexter. Byggsteget avvisar kontroller och övningar till kapitel som inte är producerade.

## 6. Övningar

Övningar är laborationer, experiment och träningsprotokoll. Varje övning har standardstrukturen:

1. Syfte 2. Teoretisk bakgrund 3. Utrustning 4. Genomförande 5. Observationer 6. Förväntat resultat 7. Tolkning 8. Evidensläge 9. Begränsningar 10. Variationer

samt vid behov *Säkerhet* och *Analysfrågor*. Övningar lagras en gång i `content/ovningar/` och kopplas till ett eller flera kapitel. De kan filtreras på fysiologiskt system, typ, tidsåtgång, svårighetsgrad, utrustning och evidensläge. Mätfält i övningens frontmatter ger ett protokoll där deltagaren registrerar genomförande och mätvärden lokalt.

## 7. Kunskapskontroller och progression

- 5–8 automatiskt rättade flervalsfrågor per underkapitel, med frågetyperna begrepp, orsak och verkan, tillämpning, beräkning och fysiologiskt resonemang.
- Minst 80 % rätt för godkänt, obegränsat antal försök, ingen tidsgräns, förklaringar efter rättning, länk tillbaka till teorin.
- Godkänt underkapitel får en diskret grön bock i vänstermenyn. Grönt är den enda accentfärgen.
- Ett godkännande står kvar även om ett senare försök blir underkänt.
- Registrerade övningar redovisas separat; en kunskapsbock visar inte att en praktisk färdighet behärskas.
- Allt innehåll är öppet från början. Kontroller låser inte upp något.
- Inga poäng, medaljer, streaks eller annan spelifiering.

## 8. Webbplatsens delar

| Adress | Innehåll |
| --- | --- |
| `/` | Startsida: vad utbildningen är, målgrupp, kunskapsområden, hur teori och övningar samverkar, Börja/Fortsätt utbildningen |
| `/kurs` | Kursens innehåll, alla moduler och underkapitel |
| `/kurs/modul/<id>` | Modulöversikt |
| `/kurs/<id>` | Underkapitel: teori, laborationer, referenser, kunskapskontroll |
| `/ovningar`, `/ovningar/<id>` | Övningsbibliotek med filter, övning med protokoll |
| `/progression` | Min progression |
| `/kallor` | Sökbar källförteckning per modul |
| `/om` | Om Restore: syfte, vetenskapliga principer, avgränsning |
| `/installningar` | Export, inläsning och återställning av progression |

## 9. Data och integritet

Progression och protokoll lagras i webbläsarens `localStorage` under nyckeln `restore.progression`. Ingen inloggning, ingen server, ingen synkronisering mellan enheter. Export och inläsning sker via JSON-fil. Data från Restore 1 (IndexedDB) migreras inte och lämnas orörd i webbläsaren.

## 10. Illustrationer

Stöd finns (komponenten `Figure` och Markdown-syntaxen `::: figur`), men inga illustrationer är producerade. Framtida illustrationer: svartvita blyertsteckningar, anatomiska och fysiologiska principskisser, tunna linjer, diskret skuggning, vit bakgrund, hög informationstäthet. Inga fotografier, stockbilder eller dekorativ AI-konst. Alternativtext krävs.
