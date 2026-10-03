# Restore – designspråk

Version 1.0 · 3 oktober 2026 · Per

Det här dokumentet styr hur Restore ser ut, rör sig och låter. Funktion och innehåll styrs av `PRODUKTSPECIFIKATION.md`. Del 1 är principerna. Del 2 är startvärden (tokens) och komponenter för bygget; värdena får justeras, principerna inte.

---

# Del 1 – Principer

Restore ska ha ett modernt, minimalistiskt och premiumbetonat designspråk inspirerat av Apples designfilosofi. Gränssnittet ska upplevas lugnt, självklart och genomarbetat utan att kännas sterilt eller kliniskt.

## Grundprincip

**Less interface, more experience.**

Användaren ska möta så lite visuell friktion som möjligt. Varje skärm ska ha ett tydligt primärt syfte och en tydlig nästa handling.

Undvik dashboards fyllda med information, många konkurrerande knappar, överdriven gamification och dekorativa element som inte fyller en funktion.

Restore ska kännas som ett verktyg man vill återvända till, inte som ett administrativt kurssystem.

## Visuell karaktär

Designen ska vara:

- minimalistisk
- luftig
- varm men saklig
- modern
- mjuk utan att bli lekfull
- premium utan att bli exklusiv
- trygg utan att använda typisk terapiestetik
- konsekvent och visuellt återhållsam

Undvik uttryck som känns new age, spirituella, medicinska eller typiska för mindfulnessappar.

## Färg

Använd en mycket begränsad färgpalett.

Basen ska bestå av ljusa, neutrala och något varma bakgrunder snarare än hårt vitt. Text ska huvudsakligen vara mörkt grafitgrå snarare än helt svart.

En enda diskret accentfärg används för:

- primära handlingar
- aktiv progression
- markerade tillstånd
- utvalda interaktiva element

Färg ska användas sparsamt och ha funktion. Undvik starka gradienter, stora färgfält och många statusfärger.

Säkerhetsinformation (stoppregel, Hjälp och vård) använder inte röd larmfärg. Den markeras med tydlig typografi och placering, inte med färg.

## Typografi

Typografin är ett av de viktigaste designelementen.

Använd ett modernt sans-serif-typsnitt med hög läsbarhet och neutral karaktär. Eftersträva känslan hos Apples San Francisco-systemtypografi utan att vara beroende av ett specifikt Apple-typsnitt.

Använd tydlig hierarki:

- **Stor rubrik** – kort och självsäker.
- **Ingress** – lugn förklaring med god radlängd.
- **Brödtext** – generöst radavstånd och hög läsbarhet.
- **Sekundär information** – mindre och visuellt nedtonad.

Undvik många olika textstorlekar, vikter och färger på samma skärm. Fetstil används sparsamt.

## Layout

Använd generöst med whitespace. Innehållet ska få utrymme att andas.

Skärmar ska normalt bestå av en tydlig vertikal informationshierarki:

1. **Var är jag?**
2. **Vad är viktigt just nu?**
3. **Vad ska jag göra?**
4. **Vad händer sedan?**

Undvik att försöka utnyttja varje pixel. På desktop hålls innehållet inom en smal läsyta. Restore ska inte expandera innehåll över hela skärmen bara för att utrymmet finns.

## Kort och ytor

Kort används endast när de hjälper användaren förstå informationsstrukturen. De ska ha:

- mjukt rundade hörn
- subtil bakgrundsskillnad
- mycket diskret kant eller skugga
- generös intern padding

Undvik ett gränssnitt där varje element ligger i ett eget kort. Whitespace ska i första hand skapa struktur.

## Knappar

Varje vy ska helst ha **en tydlig primär handling**, till exempel **Fortsätt**, **Starta övning** eller **Nästa**.

Primärknappar ska vara stora nog för mobil användning, enkla och tydliga. Sekundära handlingar tonas ned visuellt. Undvik flera lika starka knappar på samma skärm.

## Ikoner

Använd enkla linjeikoner med konsekvent formspråk. Ikoner ska förstärka förståelsen, inte fungera som dekoration. Undvik färgglada illustrationer och stora uppsättningar specialikoner.

## Rörelse och animation

Animation ska vara subtil och funktionell. Använd mjuka övergångar när:

- en session öppnas
- progression uppdateras
- en övning startar
- nytt innehåll introduceras

Animationerna ska ge känslan av kontinuitet och fysisk närvaro. Undvik studsande element, konfetti och spelifierade belöningsanimationer. Respektera alltid systemets inställning för reducerad rörelse.

## Progression

Progression ska vara tydlig men lågmäld, till exempel **Fas 3 av 6** och en tunn progressindikator.

Användaren ska alltid kunna förstå:

- var jag befinner mig
- vad jag redan gjort
- vad jag gör nu
- vad som kommer härnäst

Undvik XP, streaks, badges och poäng.

## Sessioner

När användaren genomför en session ska resten av applikationen visuellt försvinna. Bottennavigeringen döljs.

Sessionen ska kännas fokuserad: **en tanke → en instruktion → en handling → nästa**.

Visa inte hela lektionen som en lång textsida. Bryt innehållet i korta sekvenser som användaren går igenom stegvis.

## Övningsläge

Praktiska övningar har ett ännu mer avskalat gränssnitt. När en övning startar ser användaren huvudsakligen:

- **övningens namn**
- kort instruktion
- eventuell tidsindikator
- **Pausa**
- **Avsluta**

Allt annat tonas bort. Övningsläget ska upplevas lugnare än resten av applikationen: något mörkare eller mer dämpad yta, större text, inga andra element som rör sig än tidsindikatorn.

Skärmen får inte släckas under en pågående övning.

## Navigation

Mobilversionen prioriteras. Bottennavigering med fem destinationer:

**Idag · Resan · Verktyg · Kunskap · Jag**

Användaren ska kunna förstå informationsarkitekturen utan instruktion.

**Landa nu** är en sekundär knapp som alltid finns på Idag och Verktyg och i övningsläget. Den ska vara lätt att hitta, men inte konkurrera med skärmens primära handling.

## Startsidan (Idag)

Startsidan är inte en traditionell dashboard. Den svarar på frågan: **Vad är nästa relevanta sak för mig att göra?**

Exempel:

> Restore
>
> Fas 3 · Kroppen
> 41 % genomförd
>
> **Andning**
> Känn efter · 8 min
>
> **[Fortsätt]**

Därunder kan sekundär information visas, till exempel det pågående vardagsexperimentet eller senast använda övning. Undvik statistik som inte hjälper användaren att fatta ett beslut.

## Ton

Texten i gränssnittet ska vara kort, tydlig, vuxen, lugn, saklig och icke-dömande.

Undvik överdrivet uppmuntrande formuleringar som "Fantastiskt!", "Du är grym!" eller "7 dagar i rad!".

Använd hellre:

- **Session genomförd**
- **Du har avslutat fas 1**
- **Fortsätt när du vill**

Restore ska respektera användaren snarare än försöka manipulera fram engagemang. Se även produktspecifikationen, avsnitt 12.

## Övergripande känsla

Restore ska kännas som en kombination av **Apple Healths tydlighet**, **en välformgiven bok** och **ett lugnt professionellt träningsverktyg**.

Det ska inte kännas som ett LMS, en terapiportal, en mindfulnessapp, ett spel eller en AI-chatbot.

När det finns ett val mellan att lägga till ett visuellt element och att ta bort ett ska utgångspunkten vara att ta bort det.

När det finns ett val mellan att förklara något på samma skärm och att skapa en tydligare sekvens ska sekvensen prioriteras.

Varje skärm ska kunna sammanfattas med en enda mening: **"På den här skärmen ska användaren ______."** Om meningen kräver flera handlingar är skärmen sannolikt för komplex. Produktspecifikationen (avsnitt 8.4) har meningen för varje skärm.

---

# Del 2 – Startvärden och komponenter

Värdena nedan är utgångspunkt för bygget. Alla textfärger nedan klarar WCAG 2.2 AA (minst 4,5:1) mot sina bakgrunder i båda lägena; svagaste paret är `text-secondary` på `surface-exercise` (4,6:1). Kontrollera igen om värden ändras.

## Färg

| Token | Ljust läge | Mörkt läge | Användning |
| --- | --- | --- | --- |
| `bg` | `#F7F5F1` | `#151617` | Bakgrund |
| `surface` | `#EFECE6` | `#1E1F21` | Kort, sekundära ytor |
| `surface-exercise` | `#ECE8E1` | `#101112` | Övningsläge |
| `text` | `#2A2C2E` | `#E9E7E3` | Rubriker, brödtext |
| `text-secondary` | `#65686C` | `#A3A6AA` | Sekundär information |
| `line` | `#DEDAD3` | `#2C2E31` | Avdelare, kanter |
| `accent` | `#3D6A5D` | `#8DB8A9` | Primärknapp, aktiv progression, markering |
| `on-accent` | `#FFFFFF` | `#0F1A16` | Text på accent |

Ingen röd, gul eller grön statusfärg. Fel visas med text.

## Typografi

Typsnitt: systemets sans-serif (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`), eller Inter som webbtypsnitt om en enhetlig upplevelse krävs.

| Token | Storlek / radhöjd | Vikt | Användning |
| --- | --- | --- | --- |
| `title-l` | 32 / 38 | 600 | Stor rubrik, en per skärm |
| `title-m` | 24 / 30 | 600 | Modul- och övningsnamn |
| `lead` | 19 / 28 | 400 | Ingress |
| `body` | 17 / 26 | 400 | Brödtext |
| `body-exercise` | 21 / 32 | 400 | Instruktion i övningsläge |
| `secondary` | 15 / 22 | 400 | Sekundär information |
| `label` | 13 / 18 | 500 | Fasetikett, knapptext i små knappar |

Högst tre textstilar per skärm, övningsläget undantaget. Textstorlek följer systemets inställning.

## Avstånd och mått

- Basenhet 4 px. Använd 8, 16, 24, 32, 48, 64.
- Sidmarginal mobil: 24 px.
- Maximal läsbredd: 600 px.
- Hörnradie: kort 16 px, knappar 14 px, små element 8 px.
- Primärknapp: full bredd på mobil, höjd 52 px.
- Tryckytor: minst 44 × 44 px.
- Skugga: högst `0 1px 2px rgba(0,0,0,0.04)`. Hellre bakgrundsskillnad än skugga.

## Rörelse

| Token | Värde | Användning |
| --- | --- | --- |
| `motion-fast` | 150 ms, ease-out | Tryckrespons |
| `motion-base` | 250 ms, ease-in-out | Byte mellan kort i en session |
| `motion-slow` | 400 ms, ease-in-out | Öppna session, starta övning |

Vid reducerad rörelse: tona i stället för att flytta, eller visa direkt.

## Komponenter

| Komponent | Beskrivning |
| --- | --- |
| Primärknapp | Accentfärg, full bredd, en per skärm |
| Sekundärknapp | Textknapp i `text-secondary` eller kantlinje i `line` |
| Fasetikett | `label`, "Fas 3 · Kroppen" |
| Progressindikator | 2 px linje i `line` med fyllnad i `accent` |
| Nästa-kort (Idag) | Modulnamn, steg, tid, primärknapp |
| Sessionskort | Ett budskap, högst 60 ord, nästa-knapp |
| Övningsspelare | Namn, instruktion, tidsindikator (tunn ring eller linje), Pausa, Avsluta |
| Efter-övning-val | Tre lika stora val: Lugnare · Ungefär som innan · Sämre |
| Skala 0–10 | Horisontell skala med ändpunktstext, inget förvalt värde |
| Fritextfält | Stor yta, diskret kant, platshållartext som exempel |
| Landa nu | Sekundärknapp med enkel ikon, alltid samma placering |
| Hjälp och vård-rad | Namn, när den gäller, ringknapp |

## Ljud

- En röst genom hela kursen.
- Lugnt tempo med tydliga pauser.
- Ingen bakgrundsmusik under instruktioner. Om ljudmatta används: låg, jämn, utan melodi.
- Ingen gong, klocka eller ljudeffekt som signalerar belöning.
