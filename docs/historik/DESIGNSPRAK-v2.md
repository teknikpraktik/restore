# Restore 2.0 – designspråk

Ersätter designspråket för Restore 1 (`docs/historik/DESIGNSPRAK-v1.md`). Stilmallen finns i `src/styles/base.css`.

## Princip

Extremt minimalistiskt och funktionellt. Restore ska se ut som välformgiven teknisk dokumentation eller en modern digital universitetslärobok. Typografi, informationshierarki, radlängd och konsekvent navigation går före dekoration.

Undvik: varm wellnesspalett, beige, pastell, gradienter, stora rundade kort, kraftiga skuggor, dekorativa illustrationer och andra konventioner från generiska dashboards.

## Färg

| Token | Värde | Användning |
| --- | --- | --- |
| `--bg` | `#ffffff` | Bakgrund |
| `--bg-subtle` | `#f6f6f6` | Räkneexempel, faktarutor, förklaringar, hover |
| `--bg-active` | `#ececec` | Aktivt underkapitel i menyn |
| `--text` | `#111111` | Brödtext, rubriker, knappar |
| `--text-2` | `#4a4a4a` | Ingresser, sekundär text |
| `--text-3` | `#6b6b6b` | Metadata, numrering, kapitel under produktion (kontrast 5,3:1) |
| `--line` / `--line-strong` | `#e4e4e4` / `#c8c8c8` | Linjer och ramar |
| `--pass` | `#1a7f37` | **Endast** bocken för godkänt underkapitel |

Grönt används inte för något annat: inte för rätt svar i kontrollen, inte för knappar och inte för länkar. Rätt och fel svar markeras med text (*Rätt svar*, *Ditt svar*), ramtjocklek och genomstrykning.

## Typografi

- Systemets sans-serif (Inter om det finns installerat, annars system-ui).
- Brödtext 18 px på desktop, 17 px på mobil, radavstånd 1,65.
- Läsbredd högst 46 rem (cirka 830 px).
- Rubriker 650 i vikt med lätt negativ spärrning. h1 2 rem, h2 1,375 rem, h3 1,1 rem.
- Etiketter (rutornas typ, frågetyp, innehållsförteckning) i versaler, 0,72–0,75 rem, spärrade.
- Siffror i menyn och tabeller med tabulära siffror.
- Formler med KaTeX. Långa formler radbryts i källtexten (`aligned`) så att de ryms på mobil.

## Layout

**Desktop (från 1024 px):** fast sidhuvud (56 px), vänstermeny 304 px som scrollar separat, läsyta. Från 1360 px visas en smal lokal innehållsförteckning (220 px) till höger, med markering av det avsnitt som läses.

**Mobil:** sidhuvud med knappen *Meny* som öppnar en panel med webbplatsens sidor och hela kursnavigeringen. Innehållsförteckningen visas som en utfällbar ruta överst i kapitlet. Ingen bottennavigering. Tabeller med fyra eller fler kolumner staplas så att varje rad blir ett block med kolumnrubrik framför värdet.

## Komponenter

- **Vänstermeny:** modulnamn som knapp med pil, nummer och, när något är godkänt, antal godkända (`1/8`). Underkapitel med nummer och titel; aktivt kapitel i halvfet stil på grå bakgrund; kapitel under produktion i grå text; godkända med grön bock.
- **Rutor:** Definition (vänsterkant 3 px svart), Faktaruta och Räkneexempel (ljusgrå botten), Teoretisk modell och Pedagogisk förenkling (streckad ram), Evidensläge, Säkerhet. Hörnradie 0.
- **Knappar:** svart fylld för huvudhandling, vit med svart ram för sekundär. Hörnradie 2 px.
- **Kunskapskontroll:** alternativ som rader med ram och bokstav; valt alternativ med tjockare ram. Efter rättning: förklaring på ljusgrå botten.
- **Illustrationer:** `Figure` med bild, bildtext och källa. Svartvita vetenskapliga teckningar på vit bakgrund.

## Tillgänglighet

Synlig fokusmarkering (2 px svart), länk för att hoppa till innehållet, fokus flyttas till sidans rubrik vid sidbyte, menyknapparna har `aria-expanded`, godkänt-bocken har textalternativ, ej producerade kapitel har en dold textmarkering i menyn, och reducerad rörelse respekteras.
