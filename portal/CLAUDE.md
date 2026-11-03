# Portaal Jachtbus

Beheerportaal voor de Jachtbus op `portal.jachtbusfoodtruck.nl`. Eigen `package.json`, geen workspace: de Astro-site in de root weet hier niets van, behalve via de API.

## Stack

Next.js 16 (App Router), Payload 3.92 (exacte versies, alle `@payloadcms/*` gelijk), Tailwind v4, lucide-react, @dnd-kit. Lokaal SQLite (`jachtbus-dev.db`, schema push), productie Postgres met `prodMigrations`. Geen Dockerfile: Coolify bouwt het.

## Structuur

- `src/app/(dashboard)/(beheer)/`: alle schermen achter de inlog. `src/app/(dashboard)/afdruk/`: A4-pagina's zonder zijbalk. `src/app/(payload)/`: de Payload-admin en REST API.
- `src/collections/`, `src/globals/`, `src/jobs/`: het datamodel en de achtergrondtaken.
- `src/lib/velden.ts` + `velddefs.ts`: één definitie per veld stuurt zowel het formulier (`AutoVelden`) als de servercontrole (`leesVelden`). Nieuw veld: collection + velddef, klaar.
- `src/lib/modules.ts`: de eenvoudige website-modules, allemaal door `/website/[module]`.
- `src/lib/aanvraagEndpoint.ts`, `siteInhoudEndpoint.ts`: het contract met de site. Vorm niet wijzigen zonder de site mee te nemen.

## Regels

- Alle zichtbare tekst Nederlands en informeel (je en jij, nooit u). Code mag Nederlandse namen hebben, commentaar is Engels.
- **Nooit een em dash**, nergens: geen tekst, geen commentaar, geen docs.
- WCAG 2.2 AA: zie `PRODUCT.md`. Status is altijd kleur plus woord plus icoon: gebruik `Label` uit `components/ui.tsx`.
- Kleuren alleen uit de tokens in `globals.css`. Geel nooit als groot vlak.
- Elke server action begint met `vereisGebruiker()` of `vereisBeheerder()` en werkt met `overrideAccess: false`, tenzij er een reden in het commentaar staat.
- Medewerkers zien geen offertes, website en instellingen: bewaakt door access control op de collection en `vereisBeheerder` op de pagina.
- Prijzen (`Offertes`, `interneRichtprijs`) komen nooit in `/api/site-inhoud`. Reviews komen alleen uit een echte bron, referenties alleen met toestemming.
- Datums zonder tijd staan op 12:00 UTC (`dagNaarIso`, `isoNaarDag`).
- Voorbeelddata alleen in `scripts/voorbeeld-vullen.ts`. Geen secrets in de repo: alleen `.env.example`.

## Commando's

```bash
npm run dev                # poort 3010
npm run typecheck
npm run echte-inhoud       # echte teksten, plaatsen; veilig om vaker te draaien
npm run voorbeeld          # alleen lokaal, weigert bij DATABASE_URL
npm run generate:types     # na een wijziging in collections

# Schema gewijzigd, lokaal: gooi de database weg (voorkomt een vraag van schema push)
rm -f jachtbus-dev.db && npm run echte-inhoud && npm run voorbeeld

# Nieuwe Postgres-migratie (Git Bash; dummywaarden, geen verbinding nodig)
PAYLOAD_SECRET=dummy DATABASE_URL=postgres://x:x@localhost:5432/x npx payload migrate:create <naam>
```

Lokaal inloggen: zie de kop van `scripts/voorbeeld-vullen.ts`.
