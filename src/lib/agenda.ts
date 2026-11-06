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
