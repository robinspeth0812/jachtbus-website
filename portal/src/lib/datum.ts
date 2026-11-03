/**
 * Dates without a time are stored at 12:00 UTC, so the ISO date part is always
 * the intended day. Times typed by users are read as Dutch time.
 */
export const dagNaarIso = (dag: string) => `${dag}T12:00:00.000Z`;
export const isoNaarDag = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");

/** Today (or the given moment) as YYYY-MM-DD in the Netherlands. */
export const nederlandseDatum = (d: Date = new Date()) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });

export const dagPlus = (dag: string, dagen: number) => {
  const d = new Date(`${dag}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dagen);
  return d.toISOString().slice(0, 10);
};

/** Whole days from `van` to `naar`, both YYYY-MM-DD. */
export const dagenTussen = (van: string, naar: string) =>
  Math.round((new Date(`${naar}T12:00:00Z`).getTime() - new Date(`${van}T12:00:00Z`).getTime()) / 864e5);

/** A day and time as meant in the Netherlands, as a moment in time. The server runs in UTC. */
export const nederlandseTijd = (dag: string, uur: string) => {
  const gok = new Date(`${dag}T${uur}:00Z`);
  const daar = new Date(gok.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
  const hier = new Date(gok.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(gok.getTime() - (daar.getTime() - hier.getTime()));
};

const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", ...o });
const lang = f({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const langZonderJaar = f({ weekday: "long", day: "numeric", month: "long" });
const midden = f({ day: "numeric", month: "long", year: "numeric" });
const kort = f({ weekday: "short", day: "numeric", month: "short" });
const weekdag = f({ weekday: "long" });
const maand = f({ month: "long", year: "numeric" });
const dagMaand = f({ day: "numeric", month: "long" });
const moment = f({ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const zeker = (iso: string) => (iso.length === 10 ? dagNaarIso(iso) : iso);

export const datumLang = (iso: string | null | undefined) => (iso ? lang.format(new Date(zeker(iso))) : "-");
export const datumLangKort = (iso: string | null | undefined) => (iso ? langZonderJaar.format(new Date(zeker(iso))) : "-");
export const datum = (iso: string | null | undefined) => (iso ? midden.format(new Date(zeker(iso))) : "-");
export const kortDatum = (iso: string | null | undefined) => (iso ? kort.format(new Date(zeker(iso))) : "-");
export const dagNaam = (iso: string) => weekdag.format(new Date(zeker(iso)));
export const maandNaam = (dag: string) => maand.format(new Date(zeker(dag)));
export const dagEnMaand = (iso: string) => dagMaand.format(new Date(zeker(iso)));
export const momentTekst = (iso: string | null | undefined) => (iso ? moment.format(new Date(iso)) : "-");
