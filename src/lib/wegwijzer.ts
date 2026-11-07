// Where the signpost on the catering page sends you. Worked out at build time for
// every combination of answers, so the page only looks the answer up, and a new
// location page in src/data/nieuw.ts is picked up without touching this file.
//
// The order of what wins:
// 1. A location page for this occasion in this province (bruiloftscatering in Drenthe).
// 2. The page of the occasion.
// 3. The page of the province, when the occasion is "iets anders".
// 4. The page of the food, when only the food is known.
// Under the main link at most two more: the food, the occasion, the province.
import { aanvraagUrl, arrangementPaginas, locaties, regions, services, url } from '../data/nieuw';
import type { Region, Service } from '../data/nieuw';

export interface Wijzer {
  href: string;
  title: string;
  text: string;
}
export interface Advies {
  /** Href of the main link, empty when there is none. */
  hoofd: string;
  /** Hrefs of the extra links, in order. */
  ook: string[];
  /** Keys of the tips to show. */
  tips: string[];
  /** The request form with the occasion filled in. */
  aanvraag: string;
}

export const feesten = [
  ...services.filter((service) => service.soort === 'gelegenheid').map((service) => ({ value: service.gelegenheid, label: service.nav })),
  { value: 'overige', label: 'Iets anders' },
];

const naarDienst = (service: Service): Wijzer => ({ href: url(`catering/${service.slug}`), title: service.metaTitle, text: service.rowText });
const naarRegio = (region: Region): Wijzer => ({ href: url(region.slug), title: region.kruimel ?? region.metaTitle, text: region.intro });

/** Every page the signpost can point to. */
export const wijzers = (): Wijzer[] => [
  ...locaties.filter((item) => item.dienst).map(naarRegio),
  ...services.map(naarDienst),
  ...regions.map(naarRegio),
];

export const advies = (feest: string, waar: string, eten: string): Advies => {
  const dienst = services.find((service) => service.soort === 'gelegenheid' && service.gelegenheid === feest);
  const regio = regions.find((region) => region.naam === waar);
  const lokaal = dienst && regio && locaties.find((item) => item.dienst === dienst.slug && (item.provincie ?? item.naam) === regio.naam);
  const etenSlug = arrangementPaginas[eten];
  const etenDienst = etenSlug ? services.find((service) => service.slug === etenSlug) : undefined;

  const hoofd = lokaal ? naarRegio(lokaal) : dienst ? naarDienst(dienst) : regio ? naarRegio(regio) : etenDienst ? naarDienst(etenDienst) : undefined;
  const ook = [etenDienst && naarDienst(etenDienst), dienst && naarDienst(dienst), regio && !lokaal && naarRegio(regio)]
    .filter((item): item is Wijzer => !!item && item.href !== hoofd?.href)
    .slice(0, 2)
    .map((item) => item.href);
  const tips = [eten && !etenDienst ? `eten:${eten}` : '', feest === 'overige' ? 'overige' : '', waar === 'elders' ? 'elders' : ''].filter(Boolean);

  return { hoofd: hoofd?.href ?? '', ook, tips, aanvraag: aanvraagUrl(feest || undefined) };
};

/** The answer for every combination, keyed "feest|waar|eten" with empty parts for no answer.
 *  "elders" as the place means outside the three provinces. */
export const adviesTabel = (etenKeuzes: string[]) => {
  const tabel: Record<string, Advies> = {};
  for (const feest of ['', ...feesten.map((item) => item.value)]) {
    for (const waar of ['', ...regions.map((region) => region.naam), 'elders']) {
      for (const eten of ['', ...etenKeuzes]) tabel[`${feest}|${waar}|${eten}`] = advies(feest, waar, eten);
    }
  }
  return tabel;
};
