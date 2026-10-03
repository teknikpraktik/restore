# Restore – produktspecifikation

Version 1.0 · 3 oktober 2026 · Per

Det här dokumentet är grunden för hela bygget av Restore: innehåll, app, säkerhet och data. Det visuella uttrycket styrs av `DESIGNSPRAK.md`. Om de två dokumenten krockar gäller produktspecifikationen för funktion och innehåll, och designspråket för utseende och känsla.

---

## Innehåll

1. Produkten
2. Principer
3. Kursens struktur
4. Kursplan: 17 moduler
5. Övningsbibliotek
6. Säkerhet
7. Självskattning
8. Appen
9. Innehålls- och datamodell
10. Integritet och data
11. Tillgänglighet
12. Ton och språk
13. Juridik och regelverk
14. Teknik
15. Innehållsproduktion
16. Release och acceptanskriterier
17. Öppna frågor
18. Källgrund

---

## 1. Produkten

### 1.1 Vad Restore är

Restore är en självstudiekurs i en mobilapp för vuxna som vill förstå och hantera stress i vardagen. Kursen består av 17 moduler i sex faser. Varje modul kombinerar kort kunskap, en guidad kroppsövning, ett vardagsexperiment och en reflektion.

Kärnan är praktik. Deltagaren lär sig märka kroppens signaler, använda enkla verktyg (andning, orientering, rörelse, pauser) och bygga vanor för sömn, aktivitet, återhämtning och relationer.

### 1.2 Löftet

> Restore lär dig förstå hur stress fungerar i kroppen och ger dig verktyg som du övar in i din egen takt.

Restore lovar inte att bota, läka eller behandla något.

### 1.3 Målgrupp

**För:** vuxna (18+) som upplever vardagsstress, har svårt att varva ned, sover sämre i perioder eller vill ha bättre återhämtning. Ingen förkunskap krävs.

**Inte för, utan att först tala med vården:** personer i pågående psykiatrisk behandling, i traumabehandling, med pågående självmordstankar eller med misstänkt utmattningssyndrom. Självkontrollen i modul 1 (avsnitt 6.1) hanterar detta.

**Inte för:** barn och ungdomar under 18 år.

### 1.4 Format

- Självstudier. Ingen ledare, ingen chatt, ingen gemenskapsfunktion i version 1.
- Mobil först, fungerar på dator.
- Svenska i version 1.
- Rekommenderat tempo: en till två veckor per modul. Hela kursen tar cirka 5–8 månader.
- Inga deadlines, streaks eller låsta tidsfönster. Varje modul fungerar efter ett långt uppehåll.

### 1.5 Vad Restore inte är

- Inte vård, terapi eller traumabehandling.
- Inte ett diagnosverktyg.
- Inte en meditationsapp eller mindfulnessapp.
- Inte ett spel. Inga poäng, märken eller belöningsanimationer.
- Inte en AI-chatbot.

### 1.6 Framgångsmått

| Mått | Hur det mäts | Mål för pilot |
| --- | --- | --- |
| Genomförande | Andel som avslutar fas 2, 4 och 6 | Mäts lokalt och redovisas bara om deltagaren väljer att dela |
| Upplevd nytta | Deltagarens egen självskattning (avsnitt 7) i modul 1 och 17 | Förbättring hos majoriteten av dem som fullföljer |
| Säkerhet | Inga rapporterade allvarliga negativa händelser kopplade till övningarna | Noll |
| Återkomst efter uppehåll | Andel som återupptar efter minst 30 dagars uppehåll | Följs upp i pilot |

Pilotdata samlas in genom frivillig enkät utanför appen, inte genom spårning i appen (se avsnitt 10).

---

## 2. Principer

### 2.1 Pedagogik

1. **Praktik före teori.** Teori är kort (5–10 minuter per modul) och leder alltid till något att göra.
2. **Titrering.** Små doser. Varje övning har en kort version. Det är alltid rätt att sluta tidigare.
3. **Teori tas in kroppsligt.** Under teoriavsnitt uppmanas deltagaren att pausa, titta upp och känna efter.
4. **Från enkelt till kombinerat.** Tidiga moduler övar ett verktyg i taget. Senare moduler kombinerar.
5. **Deltagarens egna iakttagelser bär motivationen.** Ingen stor förklaringsmodell att tro på; i stället experiment och reflektion.
6. **Repetition utan press.** Tidigare övningar finns alltid i Verktyg och återkommer i senare moduler.
7. **Varje fas avslutas med en sammanfattning** av vad deltagaren nu kan. Fasgränsen är en naturlig paus, inte ett avhopp.

### 2.2 Evidens

1. Varje påstående i Förstå-delen ska ha en källa i källgrunden (avsnitt 18) eller vara allmänt etablerad fysiologi.
2. Effekter beskrivs realistiskt: "kan hjälpa", "i studier ofta små till måttliga effekter".
3. Mekanismer som inte är belagda används inte, även om övningen behålls (se förbjudna påståenden, avsnitt 12.3).
4. Nervsystemets tillstånd beskrivs fenomenologiskt (uppvarvad, lugn, avstängd, trött), inte med anatomiska förklaringsmodeller som saknar stöd.

### 2.3 Säkerhet

1. Ingen övning ber deltagaren gå tillbaka till svåra minnen.
2. Uppmärksamheten riktas mot nuet, kroppen och omgivningen.
3. Varje övning har en synlig stoppregel och en möjlighet att avsluta.
4. Symtom tolkas aldrig som "läkning" eller "process".
5. Vårdgränsen är tydlig och upprepas där den behövs.

### 2.4 Design

Se `DESIGNSPRAK.md`. Kortversion: lugnt, återhållsamt, en sak i taget, en tydlig nästa handling per skärm.

---

## 3. Kursens struktur

### 3.1 Faser och moduler

| Fas | Namn i appen | Moduler | Syfte |
| --- | --- | --- | --- |
| 1 | Start | 1 | Säker start, förväntningar, eget varför, första mätning |
| 2 | Grund | 2–4 | Förstå stress och tillstånd, börja märka signaler |
| 3 | Kroppen | 5–8 | Andning, rörelse, aktivitet, sömn |
| 4 | Tanken | 9–12 | Tolkning, ältande, känslor, självmedkänsla |
| 5 | Vardagen | 13–16 | Relationer, arbete, gränser, vanor |
| 6 | Integration | 17 | Egen plan och underhåll |

Alla 17 moduler är likvärdiga delar av kursen. Det finns ingen kortversion.

### 3.2 Modulmall

Varje modul består av fyra steg. Varje steg är en egen session i appen.

| Steg | Innehåll | Längd |
| --- | --- | --- |
| **Förstå** | Kort kunskap i 5–8 kort, med pauser för att känna efter | 5–10 min |
| **Känn efter** | En guidad övning med ljud och text | 5–20 min |
| **Prova** | Ett vardagsexperiment som deltagaren gör under de kommande dagarna | Instruktion 2 min, sedan i vardagen |
| **Reflektera** | Tre frågor och en kort självskattning av modulen | 3–5 min |

Reflektera kan göras när som helst, men appen föreslår att vänta några dagar så att experimentet hunnit prövas.

### 3.3 Progression och åtkomst

- Modul 1 måste göras först. Den innehåller självkontroll och stoppregel.
- Efter modul 1 är alla moduler öppna. Appen rekommenderar ordningen men låser inget.
- En modul räknas som genomförd när alla fyra steg är gjorda.
- En fas avslutas med en sammanfattningsskärm: "Du har avslutat fas 2. Det här kan du nu: …"
- Progression visas som "Fas 3 av 6" och en tunn progressindikator, aldrig som poäng eller dagar i rad.

### 3.4 Lärandemål

Varje modul har två till tre lärandemål som börjar med "Efter modulen kan du …". Målen styr vad Förstå, Känn efter och Prova måste innehålla. Om ett mål inte övas i modulen ska det strykas eller innehållet kompletteras.

---

## 4. Kursplan: 17 moduler

Övnings-id (t.ex. `O1`) hänvisar till övningsbiblioteket i avsnitt 5. Källhänvisningar (t.ex. [K3]) hänvisar till avsnitt 18.

### Fas 1 – Start

#### Modul 1. Säker start

**Efter modulen kan du …**
- beskriva vad Restore är och inte är
- använda stoppregeln och veta när du ska söka vård
- formulera ditt eget skäl till att gå kursen

**Förstå**
- Kursen är träning, inte behandling. Den ersätter inte vård.
- Hur kursen fungerar: fyra steg per modul, eget tempo, inga krav på att göra allt.
- Stoppregeln (avsnitt 6.2) och skillnaden mellan normala reaktioner och varningstecken (avsnitt 6.3).
- Värderingar: vad vill du ha mer av i livet när stressen tar mindre plats? [K12]

**Känn efter:** O1 Landa i rummet, kort version, öppna ögon.

**Prova:** Självkontrollen (avsnitt 6.1). Skriv ditt varför i en mening. Första självskattningen (avsnitt 7).

**Reflektera**
1. Vad fick dig att börja?
2. Vad skulle vara ett tecken på att kursen hjälper dig?
3. Vad behöver du för att kunna ta en paus utan att ge upp?

Modul 1 avslutas med en bekräftelse: "Jag har läst och förstått när jag ska avbryta en övning och när jag ska söka vård."

### Fas 2 – Grund

#### Modul 2. Kroppen som reagerar

**Efter modulen kan du …**
- beskriva stress som kroppens sätt att anpassa sig till krav
- skilja kortvarig stress från långvarig belastning utan återhämtning
- lista resurser som redan hjälper dig

**Förstå**
- Stressreaktionen är normal och ofta nyttig på kort sikt [K1].
- Allostas: kroppen ändrar sig för att möta krav. Allostatisk belastning: slitaget när reaktionen pågår länge eller inte stängs av [K1].
- Problemet är sällan stress i sig utan för lite återhämtning mellan topparna.
- Vanor som sömn, rörelse, mat och alkohol hör till belastningen och till återhämtningen [K1].

**Känn efter:** O1 Landa i rummet.

**Prova:** Resursinventering. Skriv ned saker, platser, människor och aktiviteter som brukar göra dig lugnare eller starkare.

**Reflektera**
1. När märkte du stress i kroppen den här veckan?
2. Vilken resurs använde du, medvetet eller omedvetet?
3. Vad överraskade dig?

#### Modul 3. Nervsystemets tillstånd

**Efter modulen kan du …**
- beskriva det autonoma nervsystemets roll i stress och återhämtning
- känna igen dina vanligaste tillstånd under en dag
- beskriva tillstånd utan att göra dem till diagnoser

**Förstå**
- Det autonoma nervsystemet har en sympatisk och en parasympatisk del som samverkar hela tiden, inte som av/på-knappar.
- Det enteriska nervsystemet styr mag-tarmkanalen och påverkas av stress.
- Hjärnan tolkar och styr reaktionen [K1].
- Tillstånd är ett spektrum: uppvarvad, alert, lugn, trött, avstängd. Alla är normala. Det som spelar roll är rörligheten mellan dem.

**Känn efter:** O2 Alla sinnen, O3 Huvud, nacke, ögon.

**Prova:** Tillståndskarta. Notera ditt tillstånd tre gånger per dag med ett ord.

**Reflektera**
1. Vilket tillstånd var vanligast?
2. Vad brukade komma före ett skifte?
3. Fanns det något tillstånd du sällan var i?

#### Modul 4. Att märka signaler

**Efter modulen kan du …**
- förklara vad interoception är
- märka kroppssignaler med nyfikenhet
- förklara varför signaler kan misstolkas, till exempel vid panik eller hälsooro

**Förstå**
- Interoception är hur hjärnan uppfattar signaler inifrån kroppen: hjärtslag, andning, mage, spänning [K10].
- Det är en färdighet som kan övas.
- Signaler tolkas. Samma hjärtklappning kan vara förväntan, ansträngning eller oro. Fel tolkning kan förstärka obehag [K10].
- Målet är inte att känna mer, utan att känna med mindre larm.

**Känn efter:** S1 Bärande hållning, S2 Släppa ned i underlaget.

**Prova:** Signalpaus. Före en vardagsaktivitet (kaffe, dörr, telefon): stanna tre sekunder och notera en kroppssignal.

**Reflektera**
1. Vilken signal var lättast att märka?
2. Fanns det en signal du först tolkade som oro men som visade sig vara något annat?
3. Hur kändes det att bara notera utan att ändra?

*Fasavslut: sammanfattning av fas 2.*

### Fas 3 – Kroppen

#### Modul 5. Andning

**Efter modulen kan du …**
- använda långsam andning med förlängd utandning
- ha realistiska förväntningar på vad andningsövningar kan göra

**Förstå**
- Andningen är det enda autonoma systemet du enkelt kan styra viljemässigt.
- Långsam andning med förlängd utandning kan dämpa upplevd stress. Effekterna i studier är små till måttliga [K2].
- Ingen kraftig eller snabb andning, inga andningsuppehåll i Restore.
- Om andningsfokus ger oro: öppna ögonen och gå tillbaka till orientering.

**Känn efter:** A1 Lång utandning, A2 Plats för inandningen, A3 Brummande utandning.

**Prova:** En minut långsam andning vid övergångar (efter möte, före måltid, i bilen innan du kliver ur).

**Reflektera**
1. Vilken variant passade dig bäst?
2. När var det lättast att komma ihåg?
3. Märkte du någon skillnad före och efter?

#### Modul 6. Spänning och lugn rörelse

**Efter modulen kan du …**
- växla medvetet mellan spänning och avslappning
- använda en kort rörelsepaus för att bryta stillasittande och uppvarvning

**Förstå**
- Muskelspänning är en del av stressreaktionen och kan bli kvar.
- Att först spänna och sedan släppa gör det lättare att märka skillnaden.
- Lugn, uppmärksam rörelse är både återhämtning och träning i kroppsmedvetenhet [K3].

**Känn efter:** R1 Leder i rörelse, R2 Spänn och släpp, R3 Ländryggen, R4 Lugn rörelse.

**Prova:** Rörelsepaus två gånger per dag, 2–5 minuter.

**Reflektera**
1. Var i kroppen satt spänningen oftast?
2. Vilken paus var lättast att få in?
3. Hur kändes kroppen efter en paus jämfört med före?

#### Modul 7. Fysisk aktivitet som buffert

**Efter modulen kan du …**
- beskriva rekommendationerna för fysisk aktivitet för vuxna
- dosera pulshöjande aktivitet och styrka efter din nuvarande kapacitet
- känna igen när träning blir ytterligare belastning

**Förstå**
- Vuxna rekommenderas 150–300 minuter pulshöjande aktivitet i veckan på måttlig intensitet, eller 75–150 minuter på hög, samt muskelstärkande aktivitet minst två gånger i veckan [K4].
- All rörelse räknas och lite är bättre än inget.
- Fysisk aktivitet har tydlig effekt på nedstämdhet i studier; promenad, löpning, yoga och styrketräning har bäst stöd [K5].
- Vid hög belastning och dålig sömn: sänk intensiteten, behåll regelbundenheten.
- Har du en sjukdom som påverkar ansträngning: fråga vården om rätt dos.

**Känn efter:** L1 Kroppsavläsning efter aktivitet.

**Prova:** Planera två pass den här veckan på en nivå du säkert klarar. Notera dagsform före och efter.

**Reflektera**
1. Vad gjorde det lättare eller svårare att komma iväg?
2. Hur var sömnen de nätter du rört dig?
3. Vilken nivå är hållbar för dig just nu?

#### Modul 8. Sömn och rytm

**Efter modulen kan du …**
- tillämpa några grundprinciper för sömn och dygnsrytm
- planera kaffe, alkohol och skärm så att de stör sömnen mindre
- veta när sömnproblem bör tas till vården

**Förstå**
- Regelbunden uppvakningstid och dagsljus på morgonen stabiliserar dygnsrytmen.
- Koffein kan minska sömnen märkbart. En vanlig kopp kaffe bör drickas långt före läggdags, i studier minst cirka 9 timmar [K6].
- Alkohol kan göra det lättare att somna men försämrar sömnen senare under natten.
- Nedvarvning: en rutin på 20–30 minuter med lägre ljus och mindre skärm.
- Långvariga sömnproblem behandlas bäst med KBT för sömn. Kontakta vården om problemen pågått i flera veckor och påverkar dagen.

**Känn efter:** L2 Kroppens våningar (liggande).

**Prova:** Fast uppvakningstid i en vecka, även helger.

**Reflektera**
1. Hur påverkades kvällen av den fasta morgonen?
2. Vilken av kaffe, alkohol eller skärm påverkade dig mest?
3. Vad vill du behålla?

*Fasavslut: sammanfattning av fas 3.*

### Fas 4 – Tanken

Modul 9 inleds med en mellanmätning (avsnitt 7).

#### Modul 9. Tolkning

**Efter modulen kan du …**
- förklara att hjärnan förutsäger och tolkar kroppens signaler
- omvärdera en återkommande stressor
- se stressreaktionen som en resurs när det stämmer med situationen

**Förstå**
- Hjärnan tolkar signaler utifrån erfarenhet och förväntan.
- Hur du ser på stress påverkar hur den påverkar dig. Att se stress som något som kan mobilisera resurser har i studier gett mer ändamålsenliga reaktioner [K7].
- Omvärdering är inte att låtsas att allt är bra, utan att pröva fler rimliga tolkningar.

**Känn efter:** P1 Pendla mellan obehag och behag.

**Prova:** Välj en återkommande stressor. Skriv tre andra rimliga tolkningar och testa en av dem nästa gång.

**Reflektera**
1. Vilken tolkning hade du först?
2. Vilken alternativ tolkning kändes rimligast?
3. Ändrades något i kroppen när tolkningen ändrades?

#### Modul 10. Ältande och oro

**Efter modulen kan du …**
- märka när tankar har fastnat i ett ältande
- ta ett steg bort från en tanke utan att bråka med den
- skjuta upp oro till en bestämd tid

**Förstå**
- Ältande är en process: samma tankar om och om igen utan att leda till handling.
- Defusion: att se tanken som en tanke ("jag har tanken att …") minskar hur trovärdig och obehaglig den känns [K8].
- Uppskjuten oro: att samla oron till en bestämd tid minskar hur ofta och hur länge man oroar sig, med små effekter i studier [K9].
- Om oron tar över stora delar av dagen i veckor: kontakta vården.

**Känn efter:** P2 Ut ur huvudet.

**Prova:** Orostid. Bestäm 15 minuter per dag, samma tid och plats. När oro dyker upp annars: skriv ned den och vänta till orostiden.

**Reflektera**
1. Hur ofta dök oron upp utanför orostiden?
2. Kändes oron annorlunda när den väl fick sin tid?
3. Vilken tanke var lättast att se som bara en tanke?

#### Modul 11. Känslor i kroppen

**Efter modulen kan du …**
- namnge en känsla och var den märks i kroppen
- rymma en känsla en stund innan du agerar på den
- se ilska som en signal om att en gräns har passerats

**Förstå**
- Känslor är signaler med en kroppslig sida.
- Att sätta ord på en känsla gör den ofta lättare att hantera.
- Ilska pekar ofta mot en gräns. Signalen är användbar även när handlingen behöver vänta.
- Restore arbetar med känslor här och nu, inte med gamla händelser.

**Känn efter:** K1 Hålla om.

**Prova:** När en känsla kommer: namnge den med ett ord och notera var den sitter.

**Reflektera**
1. Vilka känslor var lättast och svårast att namnge?
2. Var i kroppen märktes de?
3. Hände något när du väntade innan du agerade?

#### Modul 12. Självmedkänsla

**Efter modulen kan du …**
- känna igen självkritik som en stressfaktor
- bemöta dig själv i motgång som du skulle bemöta en vän

**Förstå**
- Hård självkritik håller stressreaktionen igång.
- Självmedkänsla har tre delar: vänlighet mot sig själv, insikten att alla har det svårt ibland och att se det som händer utan att förstora det.
- Program som tränar självmedkänsla har i studier gett måttliga minskningar av stress, nedstämdhet och självkritik [K11].
- Självmedkänsla är inte att sänka kraven, utan att sluta straffa sig själv för att man är människa.

**Känn efter:** K2 Vänlig hand.

**Prova:** Efter en motgång: skriv några rader till dig själv som en vän skulle skriva.

**Reflektera**
1. Hur låter din inre röst när något går fel?
2. Vad skrev du till dig själv?
3. Vad hände med kroppen när tonen ändrades?

*Fasavslut: sammanfattning av fas 4.*

### Fas 5 – Vardagen

Modul 13 inleds med en mellanmätning (avsnitt 7).

#### Modul 13. Andra människor

**Efter modulen kan du …**
- beskriva hur andra människor påverkar stress och återhämtning
- söka och ge stöd i vardagen
- sätta en gräns på ett lugnt sätt

**Förstå**
- Andras lugn smittar av sig, liksom deras stress. Det kallas samreglering.
- Starka sociala relationer hänger ihop med bättre hälsa och längre liv, i samma storleksordning som andra välkända riskfaktorer [K13].
- Små kontakter räknas: ett samtal med en granne, ett meddelande till en vän.
- Gränser skyddar relationer.

**Känn efter:** M1 Röst och ansikte, M2 Ljud tillsammans (valfri, med någon du litar på).

**Prova:** En medveten kontakt per dag. Lägg märke till hur kroppen känns före och efter.

**Reflektera**
1. Vilka kontakter gav energi och vilka tog energi?
2. Fanns det någon du ville höra av dig till men inte gjorde?
3. Var behöver du en tydligare gräns?

#### Modul 14. Arbete och återhämtning

**Efter modulen kan du …**
- använda fyra sorters återhämtning efter arbetet
- skapa en övergång mellan arbete och fritid
- känna igen varningstecken på utmattning och veta vart du vänder dig

**Förstå**
- Återhämtning efter arbete handlar om fyra upplevelser: mental frånkoppling, avslappning, att lära sig eller klara något nytt, och kontroll över sin fritid [K14].
- Frånkoppling är ofta svårast och viktigast.
- Utmattningssyndrom är en sjukdom som kommer efter lång tid med hög stress och för lite återhämtning. Det märks både i kroppen och psykiskt [K15].
- Om du har haft hög stress länge och fått flera symtom som trötthet, sömnproblem, koncentrationssvårigheter eller nedstämdhet: kontakta vårdcentralen eller 1177. Sök hellre tidigt [K15].

**Känn efter:** V1 Övergång efter arbetsdagen.

**Prova:** En frånkopplingsrutin varje arbetsdag: samma lilla handling som markerar att arbetet är slut.

**Reflektera**
1. Vilken av de fyra återhämtningsformerna saknar du mest?
2. Fungerade övergången?
3. Märker du några varningstecken hos dig själv just nu?

#### Modul 15. Kapacitet och gränser

**Efter modulen kan du …**
- planera belastning och återhämtning över en vecka
- säga nej eller inte nu till något som överskrider din kapacitet

**Förstå**
- Kapacitet varierar med sömn, sjukdom, livshändelser och period.
- Belastning behöver följas av återhämtning, på dagen och över veckan.
- Planerad återhämtning blir oftare av än återhämtning som ska hinnas med.

**Känn efter:** V2 Långsam rörelse med uppmärksamhet.

**Prova:** Planera in återhämtning i kalendern för nästa vecka, minst en stund per dag.

**Reflektera**
1. Höll planen?
2. Vad trängde undan återhämtningen?
3. Vad behöver du säga nej till?

#### Modul 16. Vanor som håller

**Efter modulen kan du …**
- bygga en ny vana i små steg kopplad till något du redan gör
- formulera en om–så-plan
- hantera ett återfall utan att ge upp

**Förstå**
- Vanor byggs av upprepning i samma sammanhang. Det tar ofta två månader eller mer, och tiden varierar mycket mellan personer och beteenden [K16].
- Att missa en dag förstör inte vanan [K16].
- Om–så-planer ("om jag kommer hem från jobbet, så gör jag övergångsövningen") ökar chansen att en avsikt blir handling [K17].

**Känn efter:** H1 Egen kombination.

**Prova:** Formulera en om–så-plan för den övning eller vana du vill behålla.

**Reflektera**
1. Vilken vana har redan fastnat under kursen?
2. Vad är din om–så-plan?
3. Vad gör du om du tappar den?

*Fasavslut: sammanfattning av fas 5.*

### Fas 6 – Integration

#### Modul 17. Din egen plan

**Efter modulen kan du …**
- sätta ihop en personlig verktygslåda med 3–5 verktyg
- känna igen dina egna varningssignaler
- veta när och var du söker mer hjälp

**Förstå**
- Underhåll kräver mindre än inlärning, men inte noll.
- Dina varningssignaler är personliga. Du har sett dem under kursen.
- Vart man vänder sig: vårdcentral, 1177, företagshälsovård, och vid akut fara 112.

**Känn efter:** O4 Vrid och se.

**Prova:** Slutmätning (avsnitt 7). Skriv din plan för de kommande tre månaderna i planmallen (avsnitt 8.5).

**Reflektera**
1. Vad har förändrats sedan modul 1?
2. Vilka verktyg tar du med dig?
3. Vad gör du om stressen kommer tillbaka?

*Kursavslut: "Du har avslutat Restore." Planen och verktygen finns kvar i appen.*

---

## 5. Övningsbibliotek

### 5.1 Övningar

Alla övningar har en kort version (2–5 min) och en hel version. Intensitet: **Låg** = öppna ögon möjligt, sittande eller stående, inget fokus inåt längre än en minut. **Måttlig** = längre inåtriktad uppmärksamhet eller liggande.

| Id | Namn | Beskrivning | Längd (kort/hel) | Intensitet | Modul |
| --- | --- | --- | --- | --- | --- |
| O1 | Landa i rummet | Låt blicken vandra långsamt i rummet. Stanna vid det som är behagligt eller intressant. Märk underlaget. | 2 / 6 min | Låg | 1, 2 |
| O2 | Alla sinnen | Orientering genom syn, hörsel, lukt, beröring i tur och ordning. | 3 / 8 min | Låg | 3 |
| O3 | Huvud, nacke, ögon | Långsamma vridningar av huvudet där ögonen leder. | 3 / 7 min | Låg | 3 |
| O4 | Vrid och se | Orientering med långsam rotation av hela överkroppen. | 3 / 8 min | Låg | 17 |
| S1 | Bärande hållning | Hitta en upprätt, avspänd hållning med stöd från underlaget. | 3 / 8 min | Låg | 4 |
| S2 | Släppa ned i underlaget | Låt tyngden vila i stol, golv eller säng, del för del. | 3 / 10 min | Måttlig | 4 |
| A1 | Lång utandning | Långsam andning där utandningen är längre än inandningen. Inga uppehåll. | 2 / 8 min | Låg | 5 |
| A2 | Plats för inandningen | Låt inandningen fylla magen och flankerna utan ansträngning. | 2 / 8 min | Låg | 5 |
| A3 | Brummande utandning | Förläng utandningen med ett lågt brummande ljud. | 2 / 6 min | Låg | 5 |
| R1 | Leder i rörelse | Små, långsamma rörelser i käke, axlar, handleder, höfter, fotleder. | 3 / 10 min | Låg | 6 |
| R2 | Spänn och släpp | Spänn en muskelgrupp lätt i 5 sekunder, släpp och märk skillnaden. | 3 / 12 min | Låg | 6 |
| R3 | Ländryggen | Uppmärksamhet och lätt rörelse i ländryggen, sittande eller liggande, med andning mot ryggen. | 3 / 8 min | Låg | 6 |
| R4 | Lugn rörelse | Mjuk, flödande helkroppsrörelse i stående, med ljudguide. | 5 / 15 min | Låg | 6 |
| L1 | Kroppsavläsning efter aktivitet | Kort genomgång av puls, andning, värme och trötthet efter rörelse. | 2 / 5 min | Låg | 7 |
| L2 | Kroppens våningar | Liggande uppmärksamhet i fötter, bäcken, mage, bröst, hals, huvud, med fokus på tyngd och andning. | 5 / 15 min | Måttlig | 8 |
| P1 | Pendla | Hitta en neutral eller behaglig plats i kroppen. Pendla kort till ett lätt obehag och tillbaka. | 3 / 10 min | Måttlig | 9 |
| P2 | Ut ur huvudet | Orientering i rummet kombinerad med lång utandning när tankarna snurrar. | 2 / 5 min | Låg | 10 |
| K1 | Hålla om | En hand på bröstet och en på magen, eller armarna i kors. Märk värme och tryck. | 2 / 8 min | Låg | 11 |
| K2 | Vänlig hand | Som K1, med en vänlig mening till dig själv. | 3 / 8 min | Låg | 12 |
| M1 | Röst och ansikte | Orientering mot ljud och ansikten, live eller på bild. | 3 / 6 min | Låg | 13 |
| M2 | Ljud tillsammans | Brummande utandning tillsammans med en annan person. | 3 / 6 min | Låg | 13 |
| V1 | Övergång efter arbetsdagen | Orientering, tre långa utandningar, en fysisk markering (byta skor, gå ut). | 2 / 5 min | Låg | 14 |
| V2 | Långsam rörelse med uppmärksamhet | Mycket långsamma, små rörelser i rygg och armar där uppmärksamheten följer rörelsen. | 5 / 15 min | Låg | 15 |
| H1 | Egen kombination | Deltagaren väljer 2–3 tidigare övningar i valfri ordning. | Valfri | Varierar | 16 |
| N1 | Landa nu | Stoppregelns sekvens som eget verktyg (avsnitt 6.2). Alltid tillgänglig. | 1–2 min | Låg | Alla |

### 5.2 Övningsmanus – krav

Varje övning skrivs som ett manus med:

1. **Inledning** (en mening om vad övningen är)
2. **Inramning:** "Du kan ha ögonen öppna hela tiden. Du kan sluta när du vill."
3. **Steg** i korta instruktioner, en per skärm i textläge
4. **Pauser** markerade med längd
5. **Stoppregel** (avsnitt 6.2) i kort form, minst en gång i manuset
6. **Avslutning:** orientera tillbaka till rummet, notera hur du har det nu
7. **Alternativ:** sittande, stående, liggande; kortare version

Manus skrivs nya för Restore. Inga manus eller formuleringar från annat kursmaterial får återanvändas.

Rörelseövningar som bygger på idéer från etablerade somatiska rörelsemetoder beskrivs med Restores egna ord. Skyddade metodnamn används inte i produkten (se avsnitt 13).

### 5.3 Övningsläge – beteende

- Ljud spelas med text som följer med (textning). Allt ljud har manus i text.
- Synliga kontroller: **Pausa** och **Avsluta**.
- Efter Avsluta i förtid: "Avbröt du för att det blev för mycket?" Ja → N1 Landa nu och information om stoppregeln. Nej → tillbaka.
- Efter avslutad övning: en fråga "Hur har du det nu?" med tre val (lugnare, ungefär som innan, sämre). Sämre → visa N1 och normala reaktioner/varningstecken.

---

## 6. Säkerhet

### 6.1 Självkontroll

Självkontrollen görs i modul 1 och kan göras om när som helst under Jag → Säkerhet.

**Principer**
- Deltagaren läser frågorna och väljer själv vilka som stämmer.
- Svaren visar riktad information. De sparas inte och skickas inte någonstans.
- Inget svar blockerar kursen. Fråga 1 visar akuthänvisningen före allt annat.
- Tonen är saklig och respektfull, aldrig skrämmande.

**Inledning (text i appen)**
> Restore passar de flesta, men inte alla och inte alltid. Läs frågorna och markera de som stämmer för dig. Dina svar sparas inte. De används bara för att visa råd som passar dig just nu.

| # | Fråga | Visas om markerad |
| --- | --- | --- |
| 1 | Har du just nu tankar på att inte vilja leva eller att skada dig själv? | Visas först och tydligt: "Det här är viktigare än kursen. Prata med någon i dag. Ring Mind Självmordslinjen 90101 eller 1177. Vid akut fara: ring 112." Kursen rekommenderas inte nu. Deltagaren kan gå vidare. Eftersom svaret inte sparas visas Hjälp och vård alltid synligt i appen (avsnitt 6.4). |
| 2 | Får du behandling för psykisk ohälsa just nu, till exempel depression, bipolär sjukdom, psykos eller ätstörning? | Prata med din behandlare innan du börjar. Restore ersätter inte behandling. Börja med korta versioner och låg intensitet. |
| 3 | Går du i traumabehandling, eller väcks svåra minnen ofta när du fokuserar på kroppen? | Ha ögonen öppna, välj korta versioner och sittande alternativ. Hoppa över liggande övningar till att börja med. Stäm av med din behandlare. |
| 4 | Har du haft panikattacker, eller blir du orolig av att känna hjärtslag eller andning? | Börja andningsövningarna lugnt och kort, med öppna ögon. Modul 4 förklarar varför kroppssignaler kan kännas larmande. Avbryt vid yrsel. |
| 5 | Har du upplevt att omgivningen känns overklig eller att du "försvinner" från dig själv? | Börja med övningarna i fas 2 med öppna ögon. Om det händer ofta eller varar länge: tala med vården. |
| 6 | Är du gravid eller har du nyligen fött barn? | Övningarna kan göras, men undvik att ligga länge på rygg sent i graviditeten. Fråga barnmorskan om fysisk aktivitet i modul 7. |
| 7 | Har du en sjukdom som påverkar andning, hjärta eller ansträngning, eller epilepsi? | Andningsövningarna görs i lugnt tempo utan uppehåll. Fråga vården om rätt nivå på fysisk aktivitet. Avbryt vid obehag. |
| 8 | Har du ont i kroppen eller begränsad rörlighet? | Alla rörelser kan göras mindre, sittande eller bara i tanken. Smärta som ökar är ett skäl att sluta. |
| 9 | Har du varit med om något svårt de senaste månaderna, eller sörjer du någon? | Det går bra att gå kursen. Reaktioner kan bli starkare än vanligt. Gå långsamt och använd korta versioner. |
| 10 | Har du haft hög stress länge och blivit mycket trött, glömsk eller nedstämd? | Det kan vara tecken på utmattning. Kontakta vårdcentralen eller 1177 innan eller parallellt med kursen. |

### 6.2 Stoppregel

Stoppregeln visas i modul 1, i varje övning och som verktyget N1 Landa nu.

**Avbryt övningen om du märker**
- yrsel, domningar eller stickningar
- att omgivningen eller du själv känns overklig
- panik eller kraftig hjärtklappning
- starka minnesbilder som tar över
- smärta som ökar

**Gör så här**
1. Öppna ögonen.
2. Sätt fötterna i golvet eller känn underlaget.
3. Säg tyst tre saker du ser.
4. Andas ut lugnt några gånger.
5. Ta en paus i minst fem minuter. Gör något vardagligt.

Fortsätt en annan dag med en kortare version. Om det händer flera gånger: välj andra övningar och tala med vården.

### 6.3 Normala reaktioner och varningstecken

**Vanligt och ofarligt**
- gäspningar, suckar, tårar
- trötthet efteråt
- värme, pirr, mag- och tarmljud
- lätt rastlöshet som går över

**Kontakta vården (vårdcentral eller 1177)**
- nedstämdhet eller hopplöshet som varar mer än två veckor
- overklighetskänsla som varar mer än ett dygn eller kommer tillbaka ofta
- panikattacker som blir fler
- sömnproblem som pågått i flera veckor och påverkar dagen
- tecken på utmattning (modul 14)

**Akut**
- tankar på att skada dig själv eller inte vilja leva: Mind Självmordslinjen 90101, 1177
- akut fara: 112

Hopplöshet, ihållande nedstämdhet eller overklighetskänsla beskrivs aldrig som tecken på framsteg.

### 6.4 Ständigt tillgängligt

- **Landa nu** (N1) nås från Idag, Verktyg och övningsläget.
- **Hjälp och vård** nås från Jag och från varje säkerhetsrelaterad text: 112, 1177, Mind Självmordslinjen 90101, med en mening om när var och en gäller.

### 6.5 Självskattningströsklar

Om deltagaren i självskattningen (avsnitt 7) anger stress 9–10 eller sömn/återhämtning 0–1 visas en vänlig text med vårdhänvisning. Logiken körs lokalt. Ingenting skickas.

---

## 7. Självskattning

### 7.1 Tillfällen

Modul 1 (baslinje), modul 9, modul 13 och modul 17. Deltagaren kan också göra en extra självskattning när som helst under Jag.

### 7.2 Frågor (version 1)

Tre egna frågor på en skala 0–10, tidsram senaste veckan:

1. Hur stressad har du känt dig?
2. Hur har du sovit?
3. Hur väl har du hunnit återhämta dig?

Frågorna är inte ett validerat instrument. De visas som deltagarens egen trend, utan gränsvärden eller tolkning av typen "hög stress".

### 7.3 Validerat instrument (senare)

PSS-10 (Perceived Stress Scale) har en validerad svensk version med normdata [K18]. Kommersiell användning kräver tillstånd från rättighetsinnehavaren [K18]. PSS-10 läggs till först när tillstånd finns. Upphovspersonen anger att skalan saknar diagnostiska gränsvärden, och appen ska inte visa några.

### 7.4 Modulens självskattning

I Reflektera: "Hur användbar var den här modulen för dig?" 1–5. Används bara lokalt för deltagarens egen översikt.

### 7.5 Visning

Under Jag → Utveckling: en enkel linje per fråga över mättillfällena. Text: "Siffrorna är till för dig. De är inte ett test."

---

## 8. Appen

### 8.1 Plattform

Progressiv webbapp (PWA). Installeras från webbläsaren till hemskärmen. Fungerar offline efter första nedladdning av en modul. Se avsnitt 14.

### 8.2 Informationsarkitektur

Bottennavigering med fem flikar:

| Flik | Syfte (en mening) |
| --- | --- |
| **Idag** | Visa den nästa relevanta saken att göra. |
| **Resan** | Visa var i kursen användaren är och ge åtkomst till alla faser och moduler. |
| **Verktyg** | Ge snabb åtkomst till övningar användaren har mött, och Landa nu. |
| **Kunskap** | Låta användaren läsa om begrepp och källor i lugn takt. |
| **Jag** | Samla plan, utveckling, säkerhet, inställningar och data. |

### 8.3 Flöden

**Första start**
1. Välkommen: vad Restore är och inte är (en skärm).
2. Hur kursen fungerar (en skärm).
3. Fortsätt till modul 1. Ingen registrering i version 1.

**Modulflöde**
Förstå → Känn efter → Prova → (dagar i vardagen) → Reflektera → Modul genomförd → nästa modul visas på Idag.

**Återkomst efter uppehåll (mer än 14 dagar)**
Idag visar: "Välkommen tillbaka. Du var i modul X." Ett val: **Fortsätt**. Sekundärt: "Börja med en kort övning först" (senast använda övning, kort version). Ingen skuld, inga förlorade dagar.

**Fasavslut**
Sammanfattningsskärm med fasens lärandemål i formen "Det här kan du nu". En handling: **Fortsätt till fas X**.

### 8.4 Skärmar

Varje skärm beskrivs med sin ena mening, enligt designspråket.

| Skärm | På den här skärmen ska användaren … |
| --- | --- |
| Välkommen | förstå vad Restore är och inte är. |
| Idag | starta nästa steg. |
| Modulöversikt | se modulens fyra steg och starta nästa. |
| Förstå-session | läsa ett kort i taget och gå vidare. |
| Övningsstart | välja kort eller hel version och starta. |
| Övningsläge | följa övningen. |
| Efter övning | ange hur hen har det nu. |
| Prova | förstå experimentet och bekräfta att hen ska pröva det. |
| Experimentlogg | markera att hen provade i dag (valfritt). |
| Reflektera | svara på frågorna. |
| Självkontroll | markera det som stämmer och läsa råden. |
| Stoppregel / Landa nu | landa och komma tillbaka till rummet. |
| Självskattning | svara på tre frågor. |
| Fasavslut | se vad hen nu kan och fortsätta. |
| Resan | välja fas eller modul. |
| Verktyg | välja en övning. |
| Kunskap | välja ett ämne att läsa. |
| Jag | nå plan, utveckling, säkerhet eller inställningar. |
| Min plan | skriva eller läsa sin plan. |
| Utveckling | se sin självskattning över tid. |
| Hjälp och vård | hitta rätt kontakt. |
| Inställningar | ändra påminnelse, ljud, text och data. |

### 8.5 Min plan (modul 17)

Planmallen har fem fält:
1. Mina verktyg (välj 3–5 övningar ur Verktyg)
2. Mina vardagsvanor (fritext, 1–3)
3. Mina varningssignaler (fritext)
4. Det här gör jag då (fritext)
5. Hit vänder jag mig (förifyllt med vårdcentral, 1177, 112; fritext för egna)

Planen kan visas, redigeras och exporteras som text.

### 8.6 Påminnelser

- Valfria. Av som standard. Erbjuds i slutet av modul 1.
- Deltagaren väljer dagar och tid.
- Text: "Restore finns här när du vill." Aldrig "Du har missat …".
- Pausas automatiskt efter 3 obesvarade påminnelser i följd, med en fråga nästa gång appen öppnas om de ska fortsätta.
- På iOS kräver webbaviseringar att appen lagts till på hemskärmen.

### 8.7 Offline

- Text och ljud för påbörjade moduler cachas.
- Användaren kan ladda ned hela kursen i inställningarna.
- Allt användardata sparas lokalt och fungerar utan nät.

---

## 9. Innehålls- och datamodell

### 9.1 Innehåll

Innehållet ligger som filer i kodförrådet, inte i en databas, så att det kan versionshanteras och granskas.

```
content/
  phases.json
  modules/
    01-saker-start/
      module.md          # metadata och lärandemål (frontmatter)
      forsta.md          # kort separerade med ---
      prova.md
      reflektera.md
    02-kroppen-som-reagerar/
    ...
  exercises/
    O1-landa-i-rummet.md # manus, metadata i frontmatter
    O1-landa-i-rummet.short.mp3
    O1-landa-i-rummet.full.mp3
  safety/
    sjalvkontroll.md
    stoppregel.md
    reaktioner.md
    hjalp-och-vard.md
  knowledge/
    *.md                 # begreppstexter
  sources.json           # källgrunden, K1–K18
```

**Modulens frontmatter (exempel)**

```yaml
id: m05
number: 5
phase: 3
title: Andning
objectives:
  - använda långsam andning med förlängd utandning
  - ha realistiska förväntningar på vad andningsövningar kan göra
exercises: [A1, A2, A3]
experiment:
  title: En minut vid övergångar
  suggestedDays: 5
reflection:
  - Vilken variant passade dig bäst?
  - När var det lättast att komma ihåg?
  - Märkte du någon skillnad före och efter?
measurement: false
sources: [K2]
estimatedMinutes: { forsta: 7, kann: 8, prova: 2, reflektera: 4 }
```

**Övningens frontmatter (exempel)**

```yaml
id: A1
title: Lång utandning
intensity: low          # low | moderate
durations: { short: 120, full: 480 }   # sekunder
positions: [sitting, standing, lying]
eyesOpenPossible: true
audio: { short: A1-lang-utandning.short.mp3, full: A1-lang-utandning.full.mp3 }
modules: [5]
```

### 9.2 Användardata (lokalt)

```ts
type Progress = {
  moduleId: string
  steps: { forsta?: Date; kann?: Date; prova?: Date; reflektera?: Date }
  completedAt?: Date
}

type ExperimentLog = { moduleId: string; date: string /* YYYY-MM-DD */ }

type Reflection = {
  moduleId: string
  answers: string[]
  usefulness?: 1 | 2 | 3 | 4 | 5
  createdAt: Date
}

type Rating = {
  occasion: 'm01' | 'm09' | 'm13' | 'm17' | 'extra'
  stress: number    // 0–10
  sleep: number     // 0–10
  recovery: number  // 0–10
  createdAt: Date
}

type ExerciseSession = {
  exerciseId: string
  version: 'short' | 'full'
  completed: boolean
  stoppedEarlyTooMuch?: boolean
  after?: 'calmer' | 'same' | 'worse'
  createdAt: Date
}

type Plan = {
  tools: string[]          // övnings-id
  habits: string[]
  warningSigns: string
  actions: string
  contacts: string
  updatedAt: Date
}

type Settings = {
  reminders?: { days: number[]; time: string }
  safetyConfirmedAt?: Date   // bekräftelsen i modul 1, inte svaren
  textSize: 'default' | 'large'
  audioCaptions: boolean
}
```

Självkontrollens svar sparas inte. Endast att bekräftelsen i modul 1 har gjorts sparas.

---

## 10. Integritet och data

1. **Lokalt först.** All användardata sparas på enheten (IndexedDB). Version 1 har inget konto och ingen server som tar emot användardata.
2. **Inga hälsouppgifter lämnar enheten.** Självkontroll, självskattning, reflektioner och logg stannar lokalt.
3. **Export och radering.** Under Jag → Data: exportera allt som en fil, och radera allt med en bekräftelse.
4. **Ingen spårning av innehåll.** Ingen analys av vad användaren skriver eller svarar. Eventuell produktstatistik (till exempel att appen startats) kräver aktivt samtycke och får inte innehålla hälsouppgifter.
5. **Inga tredjepartsskript** för reklam eller spårning.
6. **Synk mellan enheter** kräver konto och server. Det ligger utanför version 1 och kräver en ny integritetsbedömning (art. 9 GDPR) innan det byggs.
7. **Konsekvens:** byter användaren telefon försvinner data om hen inte exporterat. Detta förklaras i inställningarna.

---

## 11. Tillgänglighet

- WCAG 2.2 nivå AA.
- Allt ljud har text. Övningar kan göras helt i textläge.
- Stöd för större text och systemets textstorlek.
- Respektera inställningen för reducerad rörelse.
- Kontrast enligt AA även för sekundär text.
- Alla interaktiva element går att nå med skärmläsare och tangentbord.
- Tryckytor minst 44 × 44 pt.
- Inga moment kräver att användaren ligger ned, står eller hör. Alternativ finns alltid.

---

## 12. Ton och språk

### 12.1 Röst

Kort, tydlig, vuxen, lugn, saklig, icke-dömande. Du-tilltal. Svenska utan anglicismer där det finns bra svenska ord.

### 12.2 Exempel

| Undvik | Använd |
| --- | --- |
| Fantastiskt! Du är grym! | Session genomförd |
| 7 dagar i rad! | Du har provat 3 gånger |
| Du har missat din övning | Fortsätt när du vill |
| Läk ditt nervsystem | Öva upp verktyg för stress |
| Släpp lagrad stress | Märk hur kroppen har det nu |

### 12.3 Förbjudna påståenden

Följande får inte förekomma i någon text, ljud, marknadsföring eller framtida chatt:

- att Restore botar, läker, behandlar eller förebygger sjukdom
- att trauma eller stress "lagras" i kroppen eller nervsystemet och "släpps"
- att nervsystemet har "fastnat" eller är "dysreglerat" som förklaring till sjukdom
- förklaringsmodeller med "ventral vagus", "dorsal vagus", vagusnervens "tonus" eller "stimulering av vagusnerven" som verkningsmekanism [K19]
- att övningar påverkar binjurar, njurar eller hormonnivåer på ett specifikt sätt [K20]
- att diagnoser (till exempel bipolär sjukdom, migrän, fibromyalgi, autoimmun sjukdom) förklaras av nervsystemets tillstånd
- att obehag, hopplöshet eller overklighetskänsla är tecken på att något "släpper" eller "läker"
- att övningar är säkra i alla lägen
- att barns nervsystem formas permanent av enskilda omvårdnadsval

### 12.4 Ordlista

| Ord i Restore | Betydelse |
| --- | --- |
| Tillstånd | Hur kroppen och sinnet har det just nu: uppvarvad, alert, lugn, trött, avstängd |
| Landa | Att rikta uppmärksamheten mot omgivningen och underlaget |
| Orientera | Att låta blicken och sinnena utforska omgivningen |
| Signal | En förnimmelse inifrån kroppen |
| Återhämtning | Tid och aktiviteter som låter kroppen och tanken varva ned och bygga upp |
| Experiment | En liten vardagsuppgift att pröva och iaktta |
| Verktyg | En övning eller vana du kan använda när du behöver |

---

## 13. Juridik och regelverk

### 13.1 Medicinteknisk produkt

Restore ska positioneras som utbildning och friskvård, inte som ett verktyg för att diagnostisera, behandla eller förebygga sjukdom. Programvara med medicinskt syfte kan omfattas av EU:s förordning om medicintekniska produkter (MDR). Därför:

- Inga påståenden om behandling eller diagnos (avsnitt 12.3).
- Självkontrollen ger information, inte bedömning eller diagnos.
- Självskattningen visar trend utan gränsvärden eller tolkning.
- Ändringar som lägger till symtombedömning, behandlingsprogram för diagnoser eller kliniska gränsvärden kräver ny regulatorisk bedömning innan de byggs.

### 13.2 Marknadsföring

Marknadsföringslagen kräver att påståenden kan styrkas. Säljtexter håller samma evidensnivå som kursen och följer listan i 12.3.

### 13.3 Personuppgifter

Se avsnitt 10. Version 1 behandlar inga personuppgifter centralt. Betalning (om sådan införs) hanteras av betalleverantören och kopplas inte till kursdata.

### 13.4 Upphovsrätt och varumärken

- Allt kursinnehåll, alla manus och allt ljud skrivs och spelas in nytt för Restore.
- PSS-10 och andra skalor används bara med tillstånd (avsnitt 7.3).
- Skyddade metodnamn för rörelsemetoder används inte. Övningarna beskrivs med egna ord.
- Namnet Restore behöver en varumärkeskontroll innan lansering (vanligt ord, flera appar med liknande namn).

### 13.5 Ålder

Användarvillkoren anger 18 år. Appen frågar inte efter ålder.

---

## 14. Teknik

Förslag. Kan ändras utan att specifikationen i övrigt påverkas.

| Område | Förslag | Skäl |
| --- | --- | --- |
| App | PWA med Vite, TypeScript och ett komponentramverk (React eller Svelte) | En kodbas för mobil och dator, ingen appbutik krävs i version 1 |
| Innehåll | Markdown med frontmatter i `content/`, byggs till JSON vid build | Versionshanterat, granskningsbart |
| Lokal lagring | IndexedDB via ett tunt bibliotek (t.ex. Dexie) | Fungerar offline, klarar strukturerad data |
| Offline | Service worker (t.ex. Workbox), cache per modul | Övningar ska fungera utan nät |
| Ljud | AAC eller MP3, 64–96 kbit/s mono, med WebVTT-textning | Liten filstorlek, tillgängligt |
| Hosting | Statisk hosting med CDN | Ingen server för användardata |
| Test | Enhetstester för progression och säkerhetslogik, end-to-end för modulflöde | Säkerhetslogiken får inte gå sönder |

**Säkerhetslogik som måste ha tester**
- Modul 1 kan inte hoppas över.
- Fråga 1 i självkontrollen visar akuthänvisningen innan något annat råd.
- Självkontrollens svar skrivs aldrig till lagring.
- Avbruten övning med "för mycket" visar alltid Landa nu.
- Självskattningströsklar (6.5) visar vårdhänvisning.
- Landa nu och Hjälp och vård nås från varje flik.

---

## 15. Innehållsproduktion

1. **Ordning:** modul 1–4 skrivs först och pilottestas innan resten skrivs klart.
2. **Per modul:** lärandemål → Förstå-kort → övningsmanus → experiment → reflektionsfrågor → faktagranskning mot källgrunden → språkgranskning mot avsnitt 12.
3. **Ljud:** en röst för hela kursen. Lugnt tempo, inga bakgrundsljud som stör textning. Kort och hel version spelas in separat.
4. **Granskning:** varje modul läses av någon med vårdkompetens innan lansering, med fokus på säkerhetstexter och förbjudna påståenden.
5. **Förstå-kort:** högst 60 ord per kort, ett budskap per kort.

---

## 16. Release och acceptanskriterier

### 16.1 Version 1 (pilot)

- Hela appen med alla fem flikar.
- Modul 1–8 fullt producerade (text och ljud). Modul 9–17 med text och ljud senast när första pilotdeltagarna når fas 4.
- Självkontroll, stoppregel, Landa nu, Hjälp och vård.
- Självskattning med egna frågor.
- Lokal lagring, export, radering.
- Påminnelser.

### 16.2 Senare

- PSS-10 efter tillstånd.
- Konto och synk mellan enheter, efter integritetsbedömning.
- Betalning.
- Fördjupningsspår (rörelsepass, ljud och röst, natur och återhämtning, ilska som gränssignal).
- Andra språk.

### 16.3 Acceptanskriterier för version 1

1. En ny användare kan gå från första start till genomförd modul 1 utan instruktion.
2. Modul 1 går inte att hoppa över.
3. Självkontrollens svar finns inte i lagringen efter att skärmen lämnats (verifieras i test).
4. Varje övning kan startas i kort och hel version, pausas och avslutas.
5. Varje övning har text som motsvarar ljudet.
6. Landa nu nås med högst två tryck från varje flik.
7. Appen fungerar offline för påbörjade moduler.
8. Export ger en läsbar fil med allt användardata. Radering tar bort allt.
9. Inga texter bryter mot listan i 12.3 (manuell granskning plus sökning efter förbjudna ord).
10. WCAG 2.2 AA för kärnflödet (Idag → session → övning → efter övning).
11. Ingen skärm har mer än en primär handling.

---

## 17. Öppna frågor

| Fråga | Påverkar |
| --- | --- |
| Affärsmodell: engångsköp, prenumeration eller gratis pilot? | Betalning, konto, juridik |
| Vem läser in ljudet? | Produktionsplan |
| Tillstånd för PSS-10? | Avsnitt 7.3 |
| Vem granskar innehållet med vårdkompetens? | Avsnitt 15 |
| Varumärkeskontroll av namnet Restore | Lansering |
| Ska appen även finnas i App Store och Google Play senare? | Teknik, aviseringar på iOS |
| Hur rekryteras och följs pilotdeltagare upp? | Framgångsmått |

---

## 18. Källgrund

| Id | Källa | Används i |
| --- | --- | --- |
| K1 | McEwen BS. [Protective and damaging effects of stress mediators](https://pubmed.ncbi.nlm.nih.gov/9428819/). N Engl J Med 1998;338:171–179. Se även [McEwen, Central effects of stress hormones](https://pmc.ncbi.nlm.nih.gov/articles/PMC2474765). | 2, 3 |
| K2 | Fincham GW m.fl. [Effect of breathwork on stress and mental health](https://www.nature.com/articles/s41598-022-27247-y). Scientific Reports 2023. | 5 |
| K3 | Hillier S, Worley A. [The Effectiveness of the Feldenkrais Method](https://go.gale.com/ps/i.do?asid=549215b2&id=GALE%7CA458645908&it=r&p=AONE&sid=AONE&u=googlescholar&v=2.1). Evid Based Complement Alternat Med 2015. Stöd för lugn, uppmärksam rörelse; svagt men lovande. | 6, 15 |
| K4 | FYSS. [Rekommendationer om fysisk aktivitet och stillasittande för vuxna](https://vardgivare.regionorebrolan.se/siteassets/media/levnadsvanor/fysisk-aktivitet/rek-vuxna-fysisk-aktivitet--21.pdf) (2021). | 7 |
| K5 | Noetel M m.fl. [Effect of exercise for depression](https://jyx.jyu.fi/handle/123456789/93572). BMJ 2024;384:e075847. | 7 |
| K6 | Gardiner C m.fl. [The effect of caffeine on subsequent sleep](https://eprints.leedsbeckett.ac.uk/id/eprint/9625/1/TheEffectOfCaffeineOnSubsequentSleepASystematicReviewAndMetaanalysisPV-WEAKLEY.pdf). Sleep Med Rev 2023;69:101764. | 8 |
| K7 | Crum AJ, Salovey P, Achor S. [Rethinking stress: the role of mindsets](https://sparq.stanford.edu/sites/g/files/sbiybj19021/files/media/file/crum_et_al._2013_-_rethinking_stress.pdf). J Pers Soc Psychol 2013;104:716–733. | 9 |
| K8 | [Defusion techniques on self-referential thought: a meta-analysis of believability and discomfort](https://contextualscience.org/publications/defusion_techniques_selfreferential_thought_laboratorybased_experimental_research). J Contextual Behav Sci, 40, 100999. Laboratoriestudier i icke-kliniska grupper. | 10 |
| K9 | Dippel A, Brosschot JF, Verkuil B. [Effects of worry postponement on daily worry: a meta-analysis](https://scholarlypublications.universiteitleiden.nl/access/item%3A4105123/download). Int J Cogn Ther 2023. Sju RCT, små effekter. | 10 |
| K10 | Khalsa SS m.fl. [Interoception and mental health: a roadmap](https://pubmed.ncbi.nlm.nih.gov/29884281/). Biol Psychiatry Cogn Neurosci Neuroimaging 2018;3:501–513. | 4 |
| K11 | Ferrari M m.fl. [Self-compassion interventions and psychosocial outcomes: a meta-analysis of RCTs](https://acuresearchbank.acu.edu.au/item/87545/self-compassion-interventions-and-psychosocial-outcomes-a-meta-analysis-of-rcts). Mindfulness 2019;10:1455–1473. | 12 |
| K12 | Värderingsarbete inom ACT. Används som pedagogiskt verktyg för motivation, utan effektpåstående. Fördjupande källa väljs vid manusskrivning. | 1, 17 |
| K13 | Holt-Lunstad J, Smith TB, Layton JB. [Social relationships and mortality risk](https://journals.plos.org/plosmedicine/article/info:doi/10.1371/journal.pmed.1000316). PLoS Med 2010;7:e1000316. | 13 |
| K14 | Sonnentag S, Fritz C. [The Recovery Experience Questionnaire](https://kops.uni-konstanz.de/entities/publication/901f4299-e3f5-46af-99cb-a27bdd4bca71). J Occup Health Psychol 2007;12:204–221. | 14 |
| K15 | 1177. [Utmattningssyndrom](https://www.1177.se/Orebrolan/sjukdomar--besvar/hjarna-och-nerver/utmattningssyndrom/). | 14 |
| K16 | Lally P m.fl. How are habits formed: modelling habit formation in the real world. Eur J Soc Psychol 2010. [Sammanfattning, BPS](https://bps.org.uk/research-digest/how-form-habit). | 16 |
| K17 | Gollwitzer PM, Sheeran P. [Implementation intentions and goal achievement: a meta-analysis](https://kops.uni-konstanz.de/entities/publication/2e749bfb-8533-437c-8203-7e788c910c5f). Adv Exp Soc Psychol 2006;38:69–119. | 16 |
| K18 | Nordin M, Nordin S. [Psychometric evaluation and normative data of the Swedish version of the 10-item PSS](https://pubmed.ncbi.nlm.nih.gov/24118069/). Scand J Psychol 2013. Om tillstånd: [PSS-översikt](https://www.tacklit.com/assessments/perceived-stress-scale-pss). | 7 |
| K19 | [Polyvagal theory debunked in comprehensive new study](https://insightplus.mja.com.au/2026/9/polyvagal-theory-debunked-in-comprehensive-new-study). MJA InSight+, sep 2026. | 12.3 |
| K20 | Cadegiani FA, Kater CE. [Adrenal fatigue does not exist: a systematic review](https://link.springer.com/content/pdf/10.1186/s12902-016-0128-4.pdf). BMC Endocr Disord 2016. | 12.3 |
| K21 | Hjälplinjer: [Mind Självmordslinjen 90101](https://www.svt.se/kultur/aviciis-familj-ger-stort-bidrag-till-sjalvmordslinjen), 1177, 112. Kontrolleras före varje release. | 6 |
