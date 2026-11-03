// Content from the portal, read once at build time. Without CMS_URL, or when
// the portal cannot be reached, the site builds from src/data/nieuw.ts and the
// lists that have no honest default (reviews, references) stay empty.
import { arrangementen as defaultArrangementen, contact, faqAlgemeen } from '../data/nieuw';

export interface Review {
  naam: string;
  gelegenheid?: string;
  plaats?: string;
  tekst: string;
  bron: string;
  bronUrl?: string;
}
export interface Referentie {
  slug: string;
  titel: string;
  plaats: string;
  gelegenheid: string;
  gasten?: number;
  datum?: string;
  verhaal: string;
  fotoUrl?: string;
  fotoAlt?: string;
}
export interface Mededeling {
  tekst: string;
  linkTekst?: string;
  linkUrl?: string;
  vanaf?: string;
  tot?: string;
}
interface Remote {
  contact?: { telefoon?: string; whatsapp?: string; email?: string };
  mededelingen?: Mededeling[];
  arrangementen?: { titel: string; kort: string; volgorde: number }[];
  referenties?: Referentie[];
  reviews?: Review[];
  faq?: { vraag: string; antwoord: string; pagina: string }[];
}

let cached: Promise<Remote> | undefined;

function load(): Promise<Remote> {
  const base = import.meta.env.CMS_URL as string | undefined;
  if (!base) return Promise.resolve({});
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
    arrangementen: remote.arrangementen?.length
      ? [...remote.arrangementen].sort((a, b) => a.volgorde - b.volgorde).map((item) => ({ title: item.titel, text: item.kort }))
      : defaultArrangementen,
    faq: remote.faq?.length ? remote.faq.filter((item) => item.pagina === 'algemeen') : faqAlgemeen,
  };
}
