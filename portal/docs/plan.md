# Plan: portaal Jachtbus

## Voor wie

Peer (eigenaar) en later een of twee medewerkers, 40 tot 70 jaar, vaak op de telefoon naast de bus. Robin (webbouwer) is superadmin en beantwoordt tickets. Afgeleid van het ÁMOI-dashboard, in de huisstijl van de bus.

## Wat erin zit, en waarom

| Onderdeel | Wat | Waarom |
| --- | --- | --- |
| **Home** | Moi, Peer. Waar staat de bus, wat moet vandaag, vier tellers, laatste aanvragen, komende klussen. | Tien seconden en je weet het. |
| **Aanvragen** | Bord met fasen (slepen, of "Verplaats naar"). Alles uit het formulier, waarschuwing onder 40 gasten of bij een bezette datum, bellen, WhatsApp, mail, knop Maak klus. | Geen aanvraag raakt zoek. Elke fase maakt zijn eigen taak. |
| **Offertes** | Regels met btw 9% en 21%, totaal, statussen, A4-afdruk en PDF. | Offerte in een paar minuten, vanuit de aanvraag. |
| **Agenda** | Maand en lijst, op de telefoon alleen lijst. Dubbel geboekt valt op. | Er is maar één bus. |
| **Klussen** | Tijden, klant, locatiecheck (ruimte, ondergrond, toegang, stroom, weerplan), draaiboek, boodschappen op schaal, na afloop. | Alles van een klus op één plek, ook voor wie meegaat. |
| **Taken** | Vanzelf uit aanvragen, klussen en keuringen, plus eigen taken. Te laat krijg je één keer per mail. | Het geheugen van het bedrijf. |
| **Klanten** | Licht CRM uit aanvragen, geschiedenis, en verwijderen op verzoek (AVG). | Terugkerende klanten herkennen, en netjes omgaan met gegevens. |
| **Keuringen en onderhoud** | APK, gas, blussers, NEN 3140, HACCP-documenten, verzekering, met datum en rapport. Op tijd een taak, Gedaan schuift de datum door. | Een verlopen keuring kan een klus kosten. |
| **Voedselveiligheid** | Temperatuur meten op de telefoon, schoonmaakronde, overzicht, CSV. | Je logboek voor de NVWA, in twintig seconden per meting. |
| **Team** | Wie gaat er mee, beschikbaarheid, inplannen. Inlogs en rollen. | Weten wie er zaterdag staat. |
| **Website** | Arrangementen, referenties, reviews, veelgestelde vragen, werkgebied, galerij, mededelingen. | De site aanpassen zonder de webbouwer. |
| **Instellingen** | Contact, profielen, wie welke mail krijgt, Site bijwerken. | Een keer instellen. |
| **Tickets** | Vragen en wensen aan Robin, met gesprek en bijlagen. | Niet kwijt in de mail. |

Bewust niet: facturen maken (blijft in de boekhouding), verschuifbare fotoplekken op de site (de site vraagt er niet om), audit trail.

## Datamodel

Aanvragen, Klanten, Klussen (met draaiboek en boodschappen als regels), Offertes (met regels), Taken, Keuringen, Metingen, Schoonmaakrondes, Team, Users, Arrangementen, Referenties, Reviews, Veelgesteld, Plaatsen, Mededelingen, Media, Bijlagen, Tickets. Plus twee globals: Instellingen en Sitestatus. Een aanvraag koppelt zichzelf op mailadres aan een klant, of maakt die aan.

## Koppeling met de site

- `POST /api/aanvraag`: het formulier op de site. Controle op de server, spamfilter (honeypot, tijd, 5 per uur per IP), bewaart in fase Nieuw, mailt de ontvangers en een bevestiging. Mail blokkeert nooit: zonder SMTP wordt het alleen gelogd.
- `GET /api/site-inhoud`: alles wat gepubliceerd is, gecachet, zonder prijzen of privégegevens.
- Wijziging in Website: de site wordt een minuut later opnieuw gebouwd als `SITE_BUILD_HOOK_URL` staat.

## Fases

1. **Nu**: dit portaal staat, lokaal getest met voorbeelddata.
2. **Live**: hosting, DNS en mail regelen (zie `hosting.md`), `npm run echte-inhoud`, inlogs maken.
3. **Site koppelen**: formulier naar `/api/aanvraag`, inhoud bij het bouwen uit `/api/site-inhoud`, build hook aanzetten.
4. **Vullen**: echte keuringsdatums, team, ingrediënten per arrangement, foto's, de eerste echte reviews.

## Wat de eigenaar nog moet doen of beslissen

- **Hosting**: Coolify-server met Postgres, volume voor `media/` en `bijlagen/`, DNS-record. Stappen in `hosting.md`.
- **Mail**: Resend-account en domein verifiëren, `SMTP_*` invullen. Welk adres staat op de site en op offertes? `info@brasseriejachtlust.nl` is vervallen, dus e-mail in Instellingen staat nog leeg.
- **Aanbetaling**: 50% is een voorstel. Op de offerte staat het als CONCEPT tot `AANBETALING_BEVESTIGD` op true staat in `src/lib/bedrijf.ts`.
- **Btw**: 9% en 21% zijn de keuzes. Vraag je boekhouder welke regels onder welk tarief vallen.
- **HACCP-normen**: 7 °C, -18 °C, 75 °C en 60 °C zijn richtwaarden. Controleer ze tegen jullie hygiënecode.
- **Plaatsen om na te kijken**: De Wilp ligt grotendeels in Groningen (staat op concept, Peer kiest de provincie). Leek ligt in Groningen, Roden in Drenthe: zo overgenomen, maar die twee grenzen aan elkaar, dus even checken. Een en Nooitgedacht zijn kleine plaatsen in Drenthe: controleer of dit de bedoelde zijn.
- **Kleuren**: lakcodes van de bus, dan worden groen en donker definitief.
- **Veelgestelde vragen**: de opdracht noemde teksten die niet zijn meegekomen. Nu overgenomen van de nieuwe site (`src/data/nieuw.ts`), inclusief "14 dagen vooraf" bij allergieën: klopt dat?
- **Google-profiel**: de echte link invullen in Instellingen. Tot die tijd gaat de knop naar het algemene Google-overzicht.
