// Content from the portal, read once at build time. Without CMS_URL, or when
// the portal cannot be reached, the site builds from src/data/nieuw.ts and the
// lists that have no honest default (reviews, references) stay empty.
import { arrangementen as defaultArrangementen, contact, faqAlgemeen, photos } from '../data/nieuw';
import { dagPlus, vandaag } from './agenda';

export interface Review {
  naam: string;
  gelegenheid?: string;
  plaats?: string;
  tekst: string;
  bron: string;
  bronUrl?: string;
  fotoUrl?: string;
  fotoAlt?: string;
  caseSlug?: string;
  caseTitel?: string;
}
export interface Referentie {
  slug: string;
  titel: string;
  plaats: string;
  gelegenheid: string;
  mogelijkheden?: string[];
  gasten?: number;
  datum?: string;
  verhaal: string;
  fotoUrl?: string;
  fotoAlt?: string;
  lat?: number;
  lng?: number;
}
export interface Mededeling {
  tekst: string;
  linkTekst?: string;
  linkUrl?: string;
  vanaf?: string;
  tot?: string;
  dagen?: string[];
  vanTijd?: string;
  totTijd?: string;
}
export interface Evenement {
  titel: string;
  /** First day, YYYY-MM-DD. */
  datum: string;
  /** Last day for events of more than one day, YYYY-MM-DD. */
  totDatum?: string;
  vanTijd?: string;
  totTijd?: string;
  plaats: string;
  locatie?: string;
  tekst?: string;
  linkTekst?: string;
  linkUrl?: string;
  fotoUrl?: string;
  fotoAlt?: string;
}
/** A private booking: only the date is public, never who or where. */
export interface Bezet {
  /** First day, YYYY-MM-DD. */
  datum: string;
  /** Last day for bookings of more than one day, YYYY-MM-DD. */
  totDatum?: string;
}
interface Remote {
  contact?: { telefoon?: string; whatsapp?: string; email?: string };
  mededelingen?: Mededeling[];
  arrangementen?: { titel: string; kort: string; volgorde: number }[];
  referenties?: Referentie[];
  reviews?: Review[];
  faq?: { vraag: string; antwoord: string; pagina: string }[];
  evenementen?: Evenement[];
  bezet?: Bezet[];
}

// Two bookings on one day, or overlapping ones, show as one: spread them over
// their days, keep each day once and join days that follow each other.
function bezetteDagen(items: Bezet[]): Bezet[] {
  const vanaf = vandaag();
  const dagen = new Set<string>();
  for (const item of items) {
    const eind = item.totDatum && item.totDatum > item.datum ? item.totDatum : item.datum;
    // A typo in the end date never fills a whole year.
    for (let d = item.datum, n = 0; d <= eind && n < 31; d = dagPlus(d, 1), n++) if (d >= vanaf) dagen.add(d);
  }
  const blokken: Bezet[] = [];
  for (const d of [...dagen].sort()) {
    const laatste = blokken.at(-1);
    if (laatste && dagPlus(laatste.totDatum ?? laatste.datum, 1) === d) laatste.totDatum = d;
    else blokken.push({ datum: d });
  }
  return blokken;
}

let cached: Promise<Remote> | undefined;

// Labelled sample content to show the pages while the portal is not online yet.
// Only with VOORBEELD_INHOUD set, and only without a portal. Remove before launch.
async function loadVoorbeeld(): Promise<Remote> {
  const { default: voorbeeld } = await import('../data/voorbeeld-inhoud.json');
  // Sample dates count from the day of the build, so the coming month always has something to show.
  const op = (over: number) => dagPlus(vandaag(), over);
  const fotos = [photos.veld, photos.bediening, photos.plank, photos.grill, photos.festival, photos.bus];
  const foto = (index: number) => fotos[index % fotos.length].src.src;
  return {
    mededelingen: voorbeeld.mededelingen as Mededeling[],
    referenties: (voorbeeld.referenties as Referentie[]).map((item, index) => ({ ...item, fotoUrl: foto(index), fotoAlt: '' })),
    reviews: (voorbeeld.reviews as Review[]).map((item, index) => (item.fotoUrl ? { ...item, fotoUrl: foto(index), fotoAlt: '' } : item)),
    evenementen: voorbeeld.evenementen.map(({ over, dagen, ...item }) => ({ ...item, datum: op(over), ...(dagen ? { totDatum: op(over + dagen - 1) } : {}) })) as Evenement[],
    bezet: voorbeeld.bezet.map(({ over, dagen }) => ({ datum: op(over), ...(dagen ? { totDatum: op(over + dagen - 1) } : {}) })),
  };
}

function load(): Promise<Remote> {
  const base = import.meta.env.CMS_URL as string | undefined;
  if (!base) return import.meta.env.VOORBEELD_INHOUD ? loadVoorbeeld() : Promise.resolve({});
  return fetch(new URL('/api/site-inhoud', base))
    .then((response) => (response.ok ? (response.json() as Promise<Remote>) : {}))
    .catch((error) => {
      console.warn('Portal not reachable, building with the default content:', error);
      return {};
    });
}

/** Everything the portal manages, with the local defaults filled in. */
export async function getInhoud() {
  cached ??= load();
  const remote = await cached;
  return {
    email: remote.contact?.email || contact.email,
    mededelingen: remote.mededelingen ?? [],
    reviews: remote.reviews ?? [],
    referenties: remote.referenties ?? [],
    // The portal already leaves out what is over; this keeps it so between builds of a cached response.
    evenementen: (remote.evenementen ?? []).filter((item) => (item.totDatum ?? item.datum) >= vandaag()).sort((a, b) => a.datum.localeCompare(b.datum)),
    bezet: bezetteDagen(remote.bezet ?? []),
    arrangementen: remote.arrangementen?.length
      ? [...remote.arrangementen].sort((a, b) => a.volgorde - b.volgorde).map((item) => ({ title: item.titel, text: item.kort }))
      : defaultArrangementen,
    faq: remote.faq?.length ? remote.faq.filter((item) => item.pagina === 'algemeen') : faqAlgemeen,
  };
}
