# Design: de bus is het merk

Geldt voor `/branding-2` en de nieuwe site onder `/nieuw`. Tokens en thema's staan
in `src/styles/voorstel-bus.css`, de onderdelen in `src/components/bus/`. De kleuren
zijn de swatches uit de merkpresentatie (Concept Creatie, pagina 11). De codes die
daar bij staan (Pantone, CMYK, HTML, RAL) zijn blauw en kloppen niet.

## Kleur

| Rol | Token | Waarde |
|---|---|---|
| Grote vlakken | `--color--bus-green` | `#00521d` |
| Details, lijnen, knoppen, nooit achtergrond | `--color--bus-yellow` | `#bd8f2e` |
| Tekst, zijpaneel, afsluiter | `--color--bus-black` | `#000000` |
| Rust om te lezen | `--color--marigold-1` | `#f8f3ea` |

Goud op groen haalt 3,2:1: genoeg voor lijnen en grote koppen, niet voor lopende tekst. Witte tekst op goud kan nooit (2,9:1), zwarte wel (7,1:1).

## Type

Asap op 75% breedte, gewicht 800, kleine letters, voor koppen. Open Sans voor
lopende tekst. Nothing You Could Do alleen voor de woorden van Peer.

## Vorm

Vierkante knoppen en velden met dikke rand. Foto's in een boog, cirkel, kom of met
één grote hoek (`BusPhoto`). Dikke lijnen in plaats van kaarten. Een lijst is geen
rij gelijke kaarten: rijen (`BusRows`) of kolommen met een lijn erboven (`BusMoments`).

## Beweging

De hero van de homepage is een slider: één hele foto, de volgende half, tot over de
rand van de pagina. Die schuift elke 5 seconden door, stopt bij hover of focus en
heeft een pauzeknop. Al het andere loopt mee met de scroll (lijnen tekenen zich,
foto's openen, plaatsnamen rollen, de bus rijdt over de route) of reageert op een
handeling (`BusFit` parkeert de bus). Bij `prefers-reduced-motion` staat alles stil.
