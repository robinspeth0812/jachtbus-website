# Hosting: portal.jachtbusfoodtruck.nl

Het portaal draait op een vaste server met Coolify en Postgres, niet op Bunny. Er is geen Dockerfile nodig: Coolify bouwt het met Nixpacks vanuit de map `portal/`.

## 1. Database

In Coolify: **New Resource, PostgreSQL**. Noteer de interne connection string (`postgresql://...`).

## 2. App

**New Resource, Application**, uit deze GitHub-repo.

| Instelling | Waarde |
| --- | --- |
| Base directory | `/portal` |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Poort | `3000` |
| Domein | `https://portal.jachtbusfoodtruck.nl` |
| Node | 22 of nieuwer |

Let op: de site deployt apart via GitHub Actions. Zet in Coolify eventueel een watch path op `portal/**`, dan bouwt een wijziging aan de site het portaal niet opnieuw.

## 3. Bestanden bewaren

Voeg twee **persistent volumes** toe, anders ben je foto's en keuringsrapporten kwijt bij elke deploy:

- `/app/media`
- `/app/bijlagen`

## 4. Omgevingsvariabelen

Allemaal in Coolify, nooit in de repo. Voorbeeld: `.env.example`.

| Naam | Waarde |
| --- | --- |
| `PAYLOAD_SECRET` | minstens 32 willekeurige tekens (`openssl rand -hex 32`) |
| `PORT` | `3000` |
| `DATABASE_URL` | de string uit stap 1 |
| `NEXT_PUBLIC_SERVER_URL` | `https://portal.jachtbusfoodtruck.nl` (ook als build-variabele) |
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `resend` |
| `SMTP_PASS` | Resend API-key |
| `MAIL_VAN` | `portal@jachtbusfoodtruck.nl` (domein geverifieerd in Resend) |
| `SITE_BUILD_HOOK_URL` | zie stap 7 |
| `SITE_BUILD_HOOK_TOKEN` | zie stap 7 |

Migraties draaien vanzelf bij het starten (`prodMigrations`). Verander je het datamodel, maak dan eerst een migratie (zie `CLAUDE.md`).

## 5. DNS

Bij de DNS-beheerder van `jachtbusfoodtruck.nl`:

```
portal  A  <IP van de Coolify-server>
```

Laat de bestaande records voor de site staan. Coolify regelt het https-certificaat zodra de naam verwijst.

## 6. Eerste gebruiker

1. Open `https://portal.jachtbusfoodtruck.nl/admin` en maak de eerste gebruiker aan. Dat is Robin: zet de rol op Superadmin.
2. Log in op het portaal. Ga naar **Team, Wie kan inloggen** en maak Peer aan als Eigenaar, met een tijdelijk wachtwoord.
3. Eenmalig de echte inhoud: in de Coolify-terminal van de app `npm run echte-inhoud`.

`npm run voorbeeld` weigert op productie, omdat `DATABASE_URL` daar gezet is.

## 7. Site opnieuw bouwen na een wijziging (optioneel)

De site deployt via GitHub Actions. Maak een fine-grained token met *Contents: read and write* op de repo en zet:

```
SITE_BUILD_HOOK_URL=https://api.github.com/repos/<eigenaar>/<repo>/dispatches
SITE_BUILD_HOOK_TOKEN=<token>
```

Het portaal stuurt dan een `repository_dispatch` met `event_type: portal-inhoud`. De deploy-workflow moet daar nog op reageren:

```yaml
on:
  repository_dispatch:
    types: [portal-inhoud]
```

De workflow reageert daar al op. Zet in GitHub onder Settings, Secrets and variables, Actions, de variabelen `CMS_URL` (`https://portal.jachtbusfoodtruck.nl`) en `PUBLIC_AANVRAAG_ENDPOINT` (`https://portal.jachtbusfoodtruck.nl/api/aanvraag`). Dan haalt elke build de inhoud uit het portaal, en komt een nieuwe referentie vanzelf op de kaart.

## 8. Controleren

- `https://portal.jachtbusfoodtruck.nl/api/site-inhoud` geeft JSON zonder prijzen.
- Vul het formulier op de site in: de aanvraag staat in Nieuw en je krijgt een mail.
- `curl -I https://portal.jachtbusfoodtruck.nl` toont `X-Robots-Tag: noindex`.
