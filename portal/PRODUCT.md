# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Peer Wagenaar, eigenaar en gezicht van de Jachtbus, en later een of twee medewerkers. Leeftijd 40 tot 70. Ze gebruiken het portaal tussen de klussen door: vaak op de telefoon, naast de bus, soms met vette vingers en in de zon, en 's avonds op een laptop voor offertes. Robin (webbouwer) is superadmin en beantwoordt tickets. Geen van hen wil een handleiding lezen.

## Product Purpose

Eén plek om een foodtruck te runnen: aanvragen beantwoorden, offertes maken, klussen voorbereiden, de bus gekeurd en voedselveilig houden, en de website bijwerken zonder hulp. Het is geslaagd als Peer om 7 uur 's ochtends in tien seconden ziet wat er vandaag moet en waar de bus zaterdag staat, en als er geen aanvraag of keuring meer tussen wal en schip valt.

## Surface mode

Operate

## References

- ÁMOI-dashboard (apps/dashboard in de Amoi-repo): de anatomie, de groepering en de taal. Dit portaal is daarvan afgeleid.
- De zijkant van de bus zelf: gelakte panelen, een gele dakstreep, geometrische lijnen.

## Brand Commitments

- Tokens: groen `#00521d`, donkergroen `#003d15`, goud `#bd8f2e`, zwart `#000000` (swatches uit de merkpresentatie), beige `#f8f3ea`, beige voorgrond `#f1e8d5`, wit. Alle kleuren staan in `src/app/(dashboard)/globals.css`.
- Goud alleen voor details: lijnen, knoppen, actieve markeringen. Nooit als groot vlak.
- Rechte hoeken, witte panelen met een stevige donkere rand op beige.
- Asap condensed (extra vet, zinsbouw) alleen voor de begroeting en paginatitels. Al het andere in Open Sans. Cijfers tabular.
- Stem: Nederlands, je en jij, kort en nuchter Drents. "Moi, Peer". Nooit een em dash, geen "vrijblijvend", geen brochuretaal.

## Capabilities and Constraints

- WCAG 2.2 AA: doelen minimaal 44 px, status altijd kleur plus woord plus icoon, zichtbare focus, elk sleepgebaar heeft een knop-alternatief, reduced motion wordt gerespecteerd.
- De telefoon is volwaardig: onderbalk met Home, Aanvragen, Klussen, Meten en Menu. Lange formulieren houden de opslaan-knop in beeld.
- Geen verzonnen bedrijfsfeiten op de publieke kant. Voorbeelddata alleen via een los script, herkenbaar als "Voorbeeld", en nooit automatisch.
- Prijzen staan alleen in het portaal: de publieke API geeft ze nooit door.
- Next.js 16 en Payload 3, draait op een vaste server met Postgres.

## Assumptions

- Interview van impeccable init is vervangen door afleiding uit de opdracht, omdat dit is gebouwd door een subagent zonder vraagmogelijkheid. Peer of Robin mag dit bijstellen.
- De exacte donkertint en het groen zijn voorlopig tot de lakcodes van de bus er zijn.
- HACCP-normen (7 °C, -18 °C, 75 °C, 60 °C) zijn richtwaarden, nog na te lopen tegen de hygiënecode die Peer gebruikt.
