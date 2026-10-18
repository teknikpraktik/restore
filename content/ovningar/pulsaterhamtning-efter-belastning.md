---
titel: Pulsens återhämtning efter standardiserad belastning
sammanfattning: >-
  Belasta kroppen med tre minuters steppning i fast takt och mät hur snabbt pulsen återgår.
  Försöket ger en skattning av reglerkretsens tidskonstant och visar skillnaden mellan en snabb
  och en långsam återgångsfas.
system: [Kardiovaskulära systemet, Autonoma nervsystemet]
typ: Belastnings- och återhämtningsförsök
tid: 25
svarighetsgrad: medel
evidens: etablerad
utrustning:
  - Ett trappsteg eller en stadig pall, 15–25 cm hög
  - Metronom (finns som gratis app eller webbsida) eller musik i känt tempo
  - Klocka eller mobiltelefon med tidtagarur
  - Pulsklocka eller pulsband (rekommenderat)
  - En stol
matvarden:
  - id: vila
    etikett: Vilopuls sittande
    enhet: slag/min
  - id: slut
    etikett: Puls direkt när belastningen avslutas
    enhet: slag/min
  - id: s30
    etikett: Puls efter 30 sekunder
    enhet: slag/min
  - id: s60
    etikett: Puls efter 60 sekunder
    enhet: slag/min
  - id: s120
    etikett: Puls efter 120 sekunder
    enhet: slag/min
  - id: s180
    etikett: Puls efter 180 sekunder
    enhet: slag/min
  - id: anstrangning
    etikett: Upplevd ansträngning vid avslut (0–10)
  - id: stegh
    etikett: Steghöjd och metronomtakt
    typ: text
---

## Syfte

Att mäta hur snabbt hjärtfrekvensen återgår mot vilonivån efter en standardiserad belastning, och att använda mätvärdena för att skatta en tidskonstant enligt modellen för exponentiell återgång.

## Teoretisk bakgrund

Under muskelarbete ökar hjärtfrekvensen genom att den vagala aktiviteten till sinusknutan minskar och den sympatiska ökar. När arbetet upphör återgår pulsen, men inte i ett jämnt förlopp. Imai och medarbetare visade att pulsens fall under de första 30 sekunderna efter arbete nästan helt försvann vid blockad av vagusnerven med atropin, men var i stort sett oberoende av sympatisk blockad och arbetets intensitet. Den senare, långsammare fasen påverkades däremot även av sympatisk aktivitet och arbetsbelastning. Den snabba fasen var snabbare hos vältränade skidåkare och långsammare hos patienter med kronisk hjärtsvikt [@imai1994].

Pulsåterhämtningen har också studerats som riskmarkör. I en kohort på 2 428 personer som genomgick arbetsprov var en minskning med högst 12 slag per minut under den första minuten efter maximalt arbete förenad med ökad dödlighet under sex års uppföljning, även efter justering för andra riskfaktorer [@cole1999]. En metaanalys av prospektiva kohortstudier har bekräftat sambandet [@qiu2017]. Sambanden är observationella och gäller standardiserade arbetsprov, inte hemmaförsök.

Om återgången beskrivs med teorins ekvation 6 kan tidskonstanten skattas från två mätpunkter. Med vilopulsen $y_\infty$, pulsen vid avslutat arbete $y_0$ och pulsen $y(t)$ vid tiden $t$:

$$
\tau \approx \frac{t}{\ln\left(\dfrac{y_0 - y_\infty}{y(t) - y_\infty}\right)}
$$

## Genomförande

1. Ställ in metronomen på 96 slag per minut. En stegcykel består av fyra slag: höger fot upp, vänster fot upp, höger fot ned, vänster fot ned. Det ger 24 stegcykler per minut.
2. Sitt stilla i 5 minuter och mät vilopulsen under den sista minuten.
3. Ställ dig vid steget. Starta tidtagaruret och stega i metronomens takt i exakt 3 minuter. Byt gärna ledande fot efter halva tiden.
4. Registrera pulsen i samma ögonblick som du slutar. Sätt dig direkt på stolen och sitt stilla.
5. Registrera pulsen efter 30, 60, 120 och 180 sekunder. Utan pulsmätare: räkna slagen under 10 sekunder strax före varje tidpunkt och multiplicera med 6. Räkningen blir osäker vid höga pulsvärden; försöket rekommenderas därför med pulsmätare.
6. Skatta din upplevda ansträngning vid avslutet på en skala från 0 (ingen ansträngning) till 10 (maximal ansträngning).
7. Beräkna pulsåterhämtningen efter 60 sekunder som pulsen vid avslutat arbete minus pulsen efter 60 sekunder.
8. Skatta tidskonstanten med formeln ovan, en gång med värdet vid 30 sekunder och en gång med värdet vid 120 sekunder.
9. Upprepa försöket en annan dag vid samma tidpunkt, med samma steghöjd och takt, för att se hur reproducerbart resultatet är.

## Observationer

Registrera vilopuls, puls vid avslut, puls efter 30, 60, 120 och 180 sekunder, upplevd ansträngning samt steghöjd och metronomtakt. Rita gärna pulsen som funktion av tiden efter avslutat arbete och markera vilopulsen som en vågrät linje.

## Förväntat resultat

Pulsen sjunker snabbast under den första halvminuten och därefter allt långsammare. Den skattade tidskonstanten blir därför vanligen kortare med 30-sekundersvärdet än med 120-sekundersvärdet. Efter tre minuter ligger pulsen ofta fortfarande något över vilopulsen. Hur hög pulsen blir under arbetet beror på kondition, kroppsvikt, steghöjd och dagsform.

## Tolkning

Om en enkel exponentiell modell beskrev förloppet fullständigt skulle tidskonstanten bli densamma oavsett vilken mätpunkt som används. Att den inte blir det visar att återgången består av minst två processer med olika hastighet: en snabb vagal reaktivering och en långsammare återgång av sympatisk aktivitet, cirkulerande katekolaminer, kroppstemperatur och ämnesomsättning [@imai1994]. Det är ett exempel på att en verklig reglering ofta består av flera parallella återkopplingar med olika tidskonstanter.

Att pulsen efter tre minuter inte nått vilonivån betyder inte att regleringen är ofullständig. Kroppen har efter arbetet fortfarande förhöjd ämnesomsättning och temperatur, och den nivå som pulsen närmar sig under de första minuterna är därför inte densamma som vilonivån före arbetet.

## Evidensläge

Den fysiologiska mekanismen bakom pulsens snabba återgång, vagal reaktivering, är etablerad kunskap från farmakologiska blockadförsök [@imai1994]. Sambandet mellan långsam pulsåterhämtning och risk är väl belagt i observationsstudier av kliniska arbetsprov [@cole1999; @qiu2017], men visar samband och inte orsak. Steppning hemma är inte ett validerat konditionstest, och resultatet kan inte jämföras med gränsvärden från kliniska arbetsprov.

## Begränsningar

- Belastningen är densamma i absoluta termer men inte i relativa: en tyngre eller mindre vältränad person arbetar på en högre andel av sin kapacitet.
- Pulsåterhämtningen beror på om du sitter, står eller går efter arbetet. Jämför bara försök med samma protokoll.
- Formeln för tidskonstanten förutsätter att vilopulsen är den nivå pulsen närmar sig, vilket bara gäller ungefärligt.
- Optiska pulsmätare kan reagera fördröjt vid snabba förändringar, och felet är i genomsnitt större under aktivitet än i vila [@bent2020]. Ett pulsband som mäter hjärtats elektriska signal är säkrare.
- Ett enskilt försök säger lite om förändringar över tid. Dagsform, sömn, koffein, temperatur och vätskestatus påverkar resultatet.

## Variationer

- **Enklare:** Gå i rask takt i trappor eller på stället i 3 minuter i stället för att stega.
- **Dos och svar:** Gör försöket med metronomtakt 80 och 112 slag per minut på olika dagar och jämför toppuls och tidskonstant. Svarar den snabba fasen på belastningens storlek på samma sätt som den långsamma?
- **Återhämtningsform:** Jämför sittande vila med lugn gång efter arbetet, med samma belastning.
- **Över tid:** Upprepa försöket en gång i veckan under en period med regelbunden konditionsträning. Använd variationen mellan de första försöken för att bedöma vilka förändringar som är större än mätbruset.

## Säkerhet

Belastningen är måttlig för de flesta. Avbryt vid bröstsmärta, uttalad andfåddhet, yrsel eller oregelbunden puls. Den som har känd hjärtsjukdom eller av vården avråtts från fysisk ansträngning bör inte genomföra försöket utan att först rådgöra med sin vårdgivare.

## Analysfrågor

1. Vilken tidskonstant fick du med 30-sekunders- respektive 120-sekundersvärdet? Vad säger skillnaden om antalet processer som bidrar till återgången?
2. Varför sjunker pulsen snabbare i början än i slutet av återhämtningen? Förklara med vagusnervens och det sympatiska nervsystemets olika verkningssätt på sinusknutan.
3. Om du upprepade försöket: hur stor var skillnaden i pulsåterhämtning efter 60 sekunder mellan försöken? Hur stor förändring skulle du behöva se över en träningsperiod för att tro att den är verklig?
4. Varför kan resultaten från kliniska arbetsprov, till exempel gränsen 12 slag per minut, inte tillämpas på ditt eget försök?
