# Restore 3.0 – produktspecifikation

Version 3.0, 18 oktober 2026. Ersätter specifikationen för Restore 2.0, som finns kvar i `docs/historik/PRODUKTSPECIFIKATION-v2.md`. Den pedagogiska modellen, inventeringen och granskningen av modul 1 beskrivs utförligt i [docs/pedagogik.md](docs/pedagogik.md).

## 1. Inriktning

Restore är ett vetenskapligt förankrat, praktiskt träningsprogram för stress och återhämtning, för vuxna utan medicinska eller fysiologiska förkunskaper.

**Praktiken är huvudprodukten. Fysiologin är förklaringsmodellen.**

Deltagaren ska successivt lära sig att

- förstå hur stress påverkar kroppen och tankarna
- upptäcka kroppens signaler och sina egna reaktionsmönster
- använda praktiska tekniker för att hantera stress och främja återhämtning
- förstå sambanden mellan sömn, rörelse, tankar, känslor, relationer och belastning
- tillämpa kunskaperna i vardagen
- utveckla hållbara vanor och en personlig verktygslåda.

Restore bedöms inte efter hur mycket fysiologi deltagaren kan återge, utan efter om deltagaren efter kursen förstår sina reaktioner bättre, känner igen sina stressmönster och har praktiska verktyg som går att använda i vardagen.

## 2. Vad som bevaras från 2.0

Designspråket, navigationen och informationsarkitekturen, de 15 modulerna, progressionen från kroppens grundläggande funktioner till praktisk tillämpning, kombinationen av teori, övningar och självtest, progression och lokal lagring, mobilanpassning och PWA, den sakliga tonen, källhänvisningarna och faktagranskningen.

## 3. Målgrupp och språk

Skriv för en nyfiken och allmänbildad vuxen utan medicinsk utbildning. Språket ska vara enkelt, naturligt, konkret och vardagsnära, sakligt utan akademisk distans och tillräckligt precist för att inte vilseleda. Tonen är vuxen: inga försäkringar, uppmuntrande tillrop eller ängsliga förbehåll. Källhänvisningar har samma typografi som löptexten.

- Korta stycken, tydliga exempel och pedagogiska jämförelser.
- Högst två till tre nya fackbegrepp per delkapitel. Begreppet förklaras med vanliga ord innan termen introduceras.
- Undvik medicinska detaljer, biokemiska kedjor, avancerad neuroanatomi, matematiska modeller och forskningshistoria när de inte behövs för att förstå eller göra övningarna. Sådant kan ligga i en kort, frivillig fördjupning.

## 4. Pedagogisk modell

Varje delkapitel växlar mellan fyra steg, ofta i två omgångar:

| Steg | Innehåll | Omfattning |
| --- | --- | --- |
| **Förstå** | En kort, saklig förklaring som utgår från en igenkännbar situation | 2–4 minuters läsning per delkapitel |
| **Upptäck** | En kort praktisk uppgift där deltagaren undersöker något själv | 1–3 minuter, ibland längre; minst en per 7 minuters teori |
| **Reflektera** | En eller två frågor som kopplar ihop förklaring och erfarenhet | Observation, förståelse eller tillämpning; inget förväntat känslosvar |
| **Tillämpa** | Ett litet experiment att pröva senare samma dag eller under veckan | Ett per delkapitel |

Delkapitlet avslutas med *Det viktigaste* (tre till fyra punkter) och ett självtest. Längre övningar finns i övningsbiblioteket och länkas från kapitlet.

Vägledande fördelning av den aktiva tiden: 30 % teori och förklaringar, 45 % övningar och vardagsexperiment, 25 % reflektion och självtest.

Mallen kontrolleras vid bygget: ett producerat kapitel utan Upptäck, Reflektera eller Tillämpa, eller med för få Upptäck-uppgifter i förhållande till teorin, stoppar bygget.

## 5. Kursens moduler

De 15 modulerna behålls. Namnen är vardagsnära och varje modul anger vad deltagaren ska förstå, upptäcka och göra. Fullständiga mål finns i `content/kursplan.yaml` och i [docs/pedagogik.md](docs/pedagogik.md).

| Nr | Modul | Efter modulen kan deltagaren … |
| --- | --- | --- |
| 1 | Kroppen söker balans | förstå hur kroppen rättar till förändringar och följa sin egen variation |
| 2 | Så fungerar nervsystemet | förstå hur signaler går mellan kropp och hjärna och att nervsystemet lär sig genom upprepning |
| 3 | Kroppens automatiska system | förstå att aktivering och lugn båda behövs och underlätta växlingen mellan dem |
| 4 | Vad händer i kroppen vid stress? | känna igen sina tidiga stresstecken och planera hur en stressreaktion kan avslutas |
| 5 | Hur hjärnan tolkar världen | förstå att upplevelser är tolkningar och använda uppmärksamhetsskifte |
| 6 | Att förstå kroppens signaler | lägga märke till kroppssignaler och välja ett rimligt svar på dem |
| 7 | Andningen i vardagen | använda lugn, bekväm andning som stöd utan att tvinga fram ett mönster |
| 8 | Muskler, spänning och rörelse | upptäcka var spänning byggs upp och använda korta rörelse- och avspänningspauser |
| 9 | Rörelse som bygger kapacitet | hitta en form av rörelse som går att hålla fast vid |
| 10 | Sömn och dygnsrytm | förstå sömnbehov och dygnsrytm och pröva vanor som stöder sömnen |
| 11 | Tankar, känslor och uppmärksamhet | använda konkreta tekniker för oro, ältande och starka känslor |
| 12 | Balansen mellan krav och återhämtning | se vad som tar och ger energi och planera återhämtning |
| 13 | Relationer och stress | be om stöd och sätta gränser |
| 14 | Vanor som håller | bygga en ny vana med planering och uppföljning |
| 15 | Din personliga plan | sätta ihop en personlig plan med verktyg, vanor och varningstecken |

Status: modul 1 är omarbetad och färdig (pilot). Modul 2–15 har nya namn och mål men kapitelrubriker från 2.0 och är under produktion. De skrivs om först när pilotmodulen har godkänts.

## 6. Övningar och säkerhet

Övningarna ska vara varierade och användbara efter kursen: kroppsorientering och uppmärksamhet, lugn andning utan påtvingade mönster, enkla rörelser, puls och återhämtning, spänning och avspänning, beteendeexperiment, kartläggning av påfrestningar och resurser, tankar och känslor, sömn- och återhämtningsvanor, sociala situationer och gränssättning.

Säkerhet hanteras sakligt och utan försiktighetsfraser. Texten skrivs för vuxna och upprepar inte att övningar kan avbrytas eller att man ska ringa vården.

- Andningsövningar kräver aldrig hyperventilation eller att man håller andan.
- Fysiska moment ska kunna anpassas i intensitet.
- Där en övning innebär ansträngning eller kan ge yrsel anges det i en mening.
- Vårdhänvisningar ges bara där ämnet kräver det, till exempel i 1.7 om långvarig trötthet, och utan telefonnummer i löptexten.
- Kroppsliga reaktioner beskrivs aldrig som bevis för att en övning fungerar.

## 7. Självtest och progression

Självtestet är ett lärandeverktyg, inte en examination. Det kontrollerar grundläggande förståelse, förmågan att känna igen vardagliga situationer, praktisk tillämpning och rimliga slutsatser. Inga beräkningar, medicinska detaljfrågor eller terminologiska fällor.

Frågetyper: *vardagssituation*, *förståelse*, *tillämpning* och *rimlig slutsats*. Fem frågor per delkapitel, varav ungefär två med flera rätta svar (kryssrutor). En flersvarsfråga räknas som rätt bara om exakt de rätta alternativen är valda. Felalternativen ska vara rimliga missuppfattningar. Förklaring till varje fråga visas efter rättningen.

Grön bock kräver att alla frågor är rätt besvarade. Obegränsat antal försök och ingen tidsgräns. Ett godkännande står kvar även om ett senare försök blir underkänt, och godkännanden gjorda med den tidigare gränsen (80 procent) behålls. Lagringsformatet är oförändrat.

## 8. Vetenskaplig kvalitet

Bevaras oförändrat från 2.0: källhänvisningar med DOI, ISBN eller länk, dokumenterad kontroll av varje källa, skillnaden mellan etablerad kunskap och hypoteser, och mellan fysiologiska mekanismer och dokumenterade effekter. Källor som inte längre citeras i den publicerade texten finns kvar som underlag och visas under *Övrigt underlag* i källförteckningen.

Restore undviker påståenden om att stress eller trauma lagras i kroppen, att övningar läker nervsystemet, obelagda förklaringar från polyvagal teori, berättelsen om ett "dåligt" sympatiskt och ett "bra" parasympatiskt nervsystem, att en kroppslig förnimmelse visar att stress frigörs, och löften om behandling eller bot. Formuleringarna kontrolleras vid bygget (`FORBIDDEN_PHRASES` i `tools/course-build.ts`).

## 9. Avgränsning

Restore är utbildning och friskvård, inte sjukvård, psykoterapi eller diagnostik.

## 10. Teknik och data

Oförändrat från 2.0, se [docs/arkitektur.md](docs/arkitektur.md). Tillägg i 3.0: rutorna `upptack`, `reflektera`, `tillampa` och `fordjupning` i Markdown, modulmål i kursplanen, separat beräkning av teoritid och övningstid, frågetyperna ovan och mallkontroll vid bygget. Lagringsformatet för progression är oförändrat, så befintliga användardata fungerar.
