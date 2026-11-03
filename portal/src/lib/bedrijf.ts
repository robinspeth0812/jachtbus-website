/** Fixed company facts. No Payload imports: also used in client components. */
export const BEDRIJF = {
  naam: "Jachtbus Foodtruck & Catering B.V.",
  kvk: "96772174",
  adres: "Julianalaan 54",
  postcode: "9462 PH",
  plaats: "Gasselte",
  telefoon: "+31 592 656363",
  site: "https://jachtbusfoodtruck.nl",
  vertrekpunt: "Gasselte",
  minimumGasten: 40,
} as const;

/** Name the team knows the web builder by. */
export const WEBBOUWER = "Robin";

/**
 * The 50% deposit is a proposal. Until Peer confirms it, the quote print view
 * marks the note as a draft. Set to true after confirmation.
 */
export const AANBETALING_BEVESTIGD = false;

export const GOOGLE_PROFIEL_URL = "https://business.google.com/locations";
export const INSTAGRAM_URL = "https://www.instagram.com/";

/** "0612345678" or "+31 6 12345678" to "31612345678", for wa.me. Null if not a Dutch number. */
export function telefoonInternationaal(waarde: string | null | undefined): string | null {
  const cijfers = (waarde ?? "").replace(/[\s\-().]/g, "");
  if (/^0[1-9]\d{8}$/.test(cijfers)) return `31${cijfers.slice(1)}`;
  if (/^\+31[1-9]\d{8}$/.test(cijfers)) return cijfers.slice(1);
  if (/^0031[1-9]\d{8}$/.test(cijfers)) return cijfers.slice(2);
  return null;
}
