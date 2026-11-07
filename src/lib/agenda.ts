// Date helpers for the agenda. Dates arrive as YYYY-MM-DD; noon UTC keeps them on
// the same day everywhere, and the build runs in UTC while the visitor thinks in
// Dutch time.
import type { Bezet, Evenement } from './cms';

const dag = (iso: string) => new Date(`${iso}T12:00:00Z`);
export const formatDag = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('nl-NL', { timeZone: 'UTC', ...options }).format(dag(iso));

/** Today in the Netherlands as YYYY-MM-DD. */
export const vandaag = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());

/** The day `dagen` days after `iso`, as YYYY-MM-DD. */
export const dagPlus = (iso: string, dagen: number) => {
  const d = dag(iso);
  d.setUTCDate(d.getUTCDate() + dagen);
  return d.toISOString().slice(0, 10);
};

// The year only when it is not this year, so a date further ahead is never misread.
const metJaar = (iso: string) => (iso.slice(0, 4) !== vandaag().slice(0, 4) ? { year: 'numeric' as const } : {});
export const langeDatum = (iso: string) => formatDag(iso, { weekday: 'long', day: 'numeric', month: 'long', ...metJaar(iso) });

/** "zaterdag 12 juni" or "vrijdag 2 juli tot en met zondag 4 juli". */
export const wanneer = (item: { datum: string; totDatum?: string }) =>
  !item.totDatum || item.totDatum === item.datum ? langeDatum(item.datum) : `${langeDatum(item.datum)} tot en met ${langeDatum(item.totDatum)}`;

export const tijden = (item: Evenement) =>
  item.vanTijd && item.totTijd ? `${item.vanTijd} tot ${item.totTijd}` : item.vanTijd ? `Vanaf ${item.vanTijd}` : item.totTijd ? `Tot ${item.totTijd}` : '';

/** "juni 2027", for the month headings of the full agenda. */
export const maandNaam = (iso: string) => formatDag(iso, { month: 'long', year: 'numeric' });

export type AgendaRegel = { soort: 'event'; datum: string; item: Evenement } | { soort: 'bezet'; datum: string; item: Bezet };

/** Events and bookings in one list by date, events first on a shared day, grouped per month. */
export function agendaPerMaand(evenementen: Evenement[], bezet: Bezet[]) {
  const regels: AgendaRegel[] = [
    ...evenementen.map((item) => ({ soort: 'event' as const, datum: item.datum, item })),
    ...bezet.map((item) => ({ soort: 'bezet' as const, datum: item.datum, item })),
  ].sort((a, b) => a.datum.localeCompare(b.datum) || (a.soort === b.soort ? 0 : a.soort === 'event' ? -1 : 1));
  const maanden = new Map<string, AgendaRegel[]>();
  for (const regel of regels) {
    const sleutel = regel.datum.slice(0, 7);
    maanden.set(sleutel, [...(maanden.get(sleutel) ?? []), regel]);
  }
  return [...maanden].map(([sleutel, items]) => ({ sleutel, naam: maandNaam(`${sleutel}-01`), items }));
}

export interface KalenderDag {
  datum: string;
  /** Public events on this day, also the middle days of a longer event. */
  events: Evenement[];
  /** A private booking covers this day. */
  bezet: boolean;
  vandaag: boolean;
  /** Before today: shown, but quiet. */
  voorbij: boolean;
}
export interface KalenderMaand {
  sleutel: string;
  naam: string;
  /** Weeks from Monday to Sunday; null for the days of the month before or after. */
  weken: (KalenderDag | null)[][];
  /** The events that touch this month, for the list under the grid. */
  events: Evenement[];
}

/** Every day from `datum` up to and including `totDatum`. */
const dagenVan = (item: { datum: string; totDatum?: string }) => {
  const dagen = [item.datum];
  while (item.totDatum && dagen[dagen.length - 1] < item.totDatum && dagen.length < 62) dagen.push(dagPlus(dagen[dagen.length - 1], 1));
  return dagen;
};

/**
 * Month grids from this month up to the last month with something in it, at
 * most `maxMaanden`, so you can page through without gaps.
 */
export function kalenderMaanden(evenementen: Evenement[], bezet: Bezet[], maxMaanden = 18): KalenderMaand[] {
  const nu = vandaag();
  const perDag = new Map<string, Evenement[]>();
  for (const item of evenementen) for (const d of dagenVan(item)) perDag.set(d, [...(perDag.get(d) ?? []), item]);
  const bezetDagen = new Set(bezet.flatMap(dagenVan));
  const laatste = [...perDag.keys(), ...bezetDagen].reduce((max, d) => (d > max ? d : max), nu);

  const maanden: KalenderMaand[] = [];
  let [jaar, maand] = nu.split('-').map(Number);
  const eind = laatste.slice(0, 7);
  while (maanden.length < maxMaanden) {
    const sleutel = `${jaar}-${String(maand).padStart(2, '0')}`;
    if (sleutel > eind && maanden.length > 0) break;
    const aantal = new Date(Date.UTC(jaar, maand, 0)).getUTCDate();
    // Monday is the first day of the week in the Netherlands.
    const start = (new Date(Date.UTC(jaar, maand - 1, 1)).getUTCDay() + 6) % 7;
    const cellen: (KalenderDag | null)[] = Array.from({ length: start }, () => null);
    for (let d = 1; d <= aantal; d++) {
      const datum = `${sleutel}-${String(d).padStart(2, '0')}`;
      cellen.push({ datum, events: perDag.get(datum) ?? [], bezet: bezetDagen.has(datum), vandaag: datum === nu, voorbij: datum < nu });
    }
    while (cellen.length % 7) cellen.push(null);
    const weken = Array.from({ length: cellen.length / 7 }, (_, i) => cellen.slice(i * 7, i * 7 + 7));
    const events = evenementen.filter((item) => item.datum.slice(0, 7) <= sleutel && (item.totDatum ?? item.datum).slice(0, 7) >= sleutel);
    maanden.push({ sleutel, naam: maandNaam(`${sleutel}-01`), weken, events });
    [jaar, maand] = maand === 12 ? [jaar + 1, 1] : [jaar, maand + 1];
  }
  return maanden;
}
