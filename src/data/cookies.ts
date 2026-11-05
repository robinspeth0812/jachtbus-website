// Everything the site may place or load, by purpose. The banner and the cookie
// page are both built from this, so they can never disagree. A tracking service
// only counts once its ID is set in the environment: a build without IDs loads
// nothing and does not mention it either. New purpose? Add it here and in Consent
// (src/lib/consent.ts), and raise VERSION there so everybody is asked again.
import type { ConsentKey } from '../lib/consent';

const gaId = import.meta.env.PUBLIC_GA_ID as string | undefined;
const adsId = import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined;
const metaId = import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined;

export interface CookieService {
  /** Name of the service. */
  naam: string;
  /** What it does for the visitor or for us. */
  doel: string;
  /** Who runs it. */
  aanbieder: string;
  /** What ends up on the device, with how long it stays. */
  cookies: string;
  /** Whether data leaves the EU, and on what basis. */
  doorgifte: string;
  /** Legal basis. */
  grondslag: string;
  /** Privacy notice of the provider. */
  privacyUrl?: string;
}
export interface CookieGroup {
  /** Key in the stored choices. Empty for what is always on. */
  key?: ConsentKey;
  /** Name of the purpose. */
  naam: string;
  /** One line about the purpose. */
  tekst: string;
  /** Services under this purpose. */
  diensten: CookieService[];
}

const TOESTEMMING = 'Jouw toestemming (artikel 11.7a Telecommunicatiewet en artikel 6 lid 1 sub a AVG)';
const VS = 'Kan naar de VS gaan, op grond van het EU-US Data Privacy Framework (besluit van de Europese Commissie van 10 juli 2023)';
const GOOGLE = 'Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ierland';

const groups: CookieGroup[] = [
  {
    naam: 'Noodzakelijk',
    tekst: 'Zonder dit werkt de site niet en onthouden we je keuze niet.',
    diensten: [
      {
        naam: 'Je cookiekeuze',
        doel: 'Onthoudt wat je hier kiest, zodat we het niet elke keer vragen.',
        aanbieder: 'Jachtbus Foodtruck & Catering B.V.',
        cookies: 'jachtbus-toestemming, in de lokale opslag van je browser (12 maanden)',
        doorgifte: 'Nee, dit blijft in je browser',
        grondslag: 'Noodzakelijk, hiervoor is geen toestemming nodig',
      },
      {
        naam: 'Aanvraagformulier',
        doel: 'Bewaart je tussentijdse antwoorden terwijl je het formulier invult.',
        aanbieder: 'Jachtbus Foodtruck & Catering B.V.',
        cookies: 'Sessieopslag van je browser (weg als je het tabblad sluit)',
        doorgifte: 'Nee, dit blijft in je browser tot je verstuurt',
        grondslag: 'Noodzakelijk, hiervoor is geen toestemming nodig',
      },
    ],
  },
  {
    key: 'statistics',
    naam: 'Statistieken',
    tekst: 'Laat ons zien welke pagina\'s bezocht worden, zodat we de site beter kunnen maken.',
    diensten: gaId
      ? [{
          naam: 'Google Analytics 4',
          doel: 'Meet bezoeken en wat er op de site gebeurt.',
          aanbieder: GOOGLE,
          cookies: '_ga en _ga_<id> (13 maanden)',
          doorgifte: VS,
          grondslag: TOESTEMMING,
          privacyUrl: 'https://policies.google.com/privacy',
        }]
      : [],
  },
  {
    key: 'marketing',
    naam: 'Marketing',
    tekst: 'Meet of onze advertenties werken en maakt ze beter passend, ook buiten deze site.',
    diensten: [
      ...(adsId
        ? [{
            naam: 'Google Ads',
            doel: 'Meet welke advertenties tot een aanvraag leiden en kan advertenties op je afstemmen.',
            aanbieder: GOOGLE,
            cookies: '_gcl_au (3 maanden)',
            doorgifte: VS,
            grondslag: TOESTEMMING,
            privacyUrl: 'https://policies.google.com/privacy',
          }]
        : []),
      ...(metaId
        ? [{
            naam: 'Meta Pixel',
            doel: 'Meet of advertenties op Facebook en Instagram werken en kan ze op je afstemmen.',
            aanbieder: 'Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Ierland',
            cookies: '_fbp (3 maanden)',
            doorgifte: VS,
            grondslag: TOESTEMMING,
            privacyUrl: 'https://www.facebook.com/privacy/policy',
          }]
        : []),
    ],
  },
  {
    key: 'media',
    naam: 'Externe media',
    tekst: 'Inhoud van andere partijen, zoals de kaart met onze klussen. Die laadt pas na jouw ja.',
    diensten: [
      {
        naam: 'OpenFreeMap',
        doel: 'Toont de kaart met onze klussen.',
        aanbieder: 'OpenFreeMap (openfreemap.org)',
        cookies: 'Geen. De dienst ziet wel je IP-adres',
        doorgifte: 'Kan buiten de EU gaan',
        grondslag: TOESTEMMING,
        privacyUrl: 'https://openfreemap.org',
      },
    ],
  },
];

export const cookieGroups = groups.filter((group) => group.diensten.length > 0);
