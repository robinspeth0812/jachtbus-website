/**
 * Option lists shared by collections and UI.
 * No Payload imports: this file is also used in client components.
 */
export type Optie = { value: string; label: string };

export const labelVan = (lijst: readonly Optie[], waarde: string | null | undefined): string =>
  lijst.find((o) => o.value === waarde)?.label ?? "-";

export const gelegenheden = [
  { value: "bruiloft", label: "Bruiloft" },
  { value: "bedrijfsfeest", label: "Bedrijfsfeest" },
  { value: "evenement", label: "Evenement" },
  { value: "festival", label: "Festival" },
  { value: "bbq", label: "BBQ" },
  { value: "verjaardag", label: "Verjaardag" },
  { value: "jubileum", label: "Jubileum" },
  { value: "overige", label: "Iets anders" },
] as const;
export type Gelegenheid = (typeof gelegenheden)[number]["value"];

/** How a job is sorted on the references page. Same words as on the site. */
export const referentieGelegenheden = [
  { value: "Bruiloft", label: "Bruiloft" },
  { value: "Bedrijfsfeest", label: "Bedrijfsfeest" },
  { value: "Tuinfeest", label: "Tuinfeest" },
  { value: "Evenement", label: "Evenement" },
] as const;
export const referentieMogelijkheden = [
  { value: "Walking dinner", label: "Walking dinner" },
  { value: "BBQ-smoker", label: "BBQ-smoker" },
  { value: "Streetfood", label: "Streetfood" },
  { value: "Buffet", label: "Buffet" },
  { value: "Aan tafel", label: "Aan tafel" },
] as const;

export const momentenOpties = [
  { value: "borrel", label: "Borrel" },
  { value: "diner", label: "Diner" },
  { value: "avondsnack", label: "Avondsnack" },
] as const;
export type Moment = (typeof momentenOpties)[number]["value"];

/** Order is the route a request travels. */
export const aanvraagFasen = [
  { value: "nieuw", label: "Nieuw" },
  { value: "contact", label: "Contact gehad" },
  { value: "offerte", label: "Offerte uit" },
  { value: "bevestigd", label: "Bevestigd" },
  { value: "afgewezen", label: "Geen match" },
] as const;
export type AanvraagFase = (typeof aanvraagFasen)[number]["value"];

export const klusStatussen = [
  { value: "optie", label: "Optie" },
  { value: "bevestigd", label: "Bevestigd" },
  { value: "afgerond", label: "Afgerond" },
  { value: "geannuleerd", label: "Geannuleerd" },
] as const;
export type KlusStatus = (typeof klusStatussen)[number]["value"];
/** These claim the bus on their date. */
export const bezetteStatussen: KlusStatus[] = ["optie", "bevestigd"];

export const offerteStatussen = [
  { value: "concept", label: "Concept" },
  { value: "verstuurd", label: "Verstuurd" },
  { value: "geaccepteerd", label: "Geaccepteerd" },
  { value: "afgewezen", label: "Afgewezen" },
  { value: "verlopen", label: "Verlopen" },
] as const;
export type OfferteStatus = (typeof offerteStatussen)[number]["value"];

export const btwTarieven = [
  { value: "9", label: "9%" },
  { value: "21", label: "21%" },
] as const;

export const taakSoorten = [
  { value: "reageren", label: "Reageren" },
  { value: "offerte-sturen", label: "Offerte sturen" },
  { value: "nabellen", label: "Nabellen" },
  { value: "afstemmen", label: "Laatste afstemming" },
  { value: "review", label: "Review vragen" },
  { value: "factuur", label: "Factuur sturen" },
  { value: "keuring", label: "Keuring of onderhoud" },
  { value: "eigen", label: "Eigen taak" },
] as const;
export type TaakSoort = (typeof taakSoorten)[number]["value"];

export const keuringSoorten = [
  { value: "apk", label: "APK" },
  { value: "gas", label: "Gaskeuring" },
  { value: "brand", label: "Brandblussers" },
  { value: "elektra", label: "Elektra (NEN 3140)" },
  { value: "haccp", label: "HACCP-documenten" },
  { value: "verzekering", label: "Verzekering" },
  { value: "tachograaf", label: "Tachograaf" },
  { value: "onderhoud", label: "Klein onderhoud" },
  { value: "overig", label: "Overig" },
] as const;

/** Guide values, to check against the own hygiene code. Degrees Celsius. */
export const meetSoorten = [
  { value: "koeling", label: "Koeling", norm: "maximaal 7 °C", max: 7 },
  { value: "vriezer", label: "Vriezer", norm: "maximaal -18 °C", max: -18 },
  { value: "kern", label: "Kerntemperatuur", norm: "minimaal 75 °C", min: 75 },
  { value: "warmhouden", label: "Warmhouden", norm: "minimaal 60 °C", min: 60 },
] as const;
export type MeetSoort = (typeof meetSoorten)[number]["value"];

export const binnenNorm = (soort: string, temperatuur: number) => {
  const s = meetSoorten.find((m) => m.value === soort) as { min?: number; max?: number } | undefined;
  if (!s) return true;
  if (s.max !== undefined && temperatuur > s.max) return false;
  if (s.min !== undefined && temperatuur < s.min) return false;
  return true;
};

export const schoonmaakPunten = [
  "Werkbladen en snijplanken",
  "Koeling en vriezer, binnenkant",
  "Fornuis, oven en smoker",
  "Vloer van de bus",
  "Handenwasbak met zeep en papier",
  "Afval weg en bakken schoon",
  "Pannen, messen en gereedschap",
] as const;

export const provincies = [
  { value: "Drenthe", label: "Drenthe" },
  { value: "Groningen", label: "Groningen" },
  { value: "Friesland", label: "Friesland" },
] as const;

export const publicatieStatussen = [
  { value: "concept", label: "Concept" },
  { value: "gepubliceerd", label: "Op de site" },
] as const;

export const reviewBronnen = [
  { value: "Google", label: "Google" },
  { value: "Facebook", label: "Facebook" },
  { value: "E-mail van de klant", label: "E-mail van de klant" },
  { value: "WhatsApp van de klant", label: "WhatsApp van de klant" },
] as const;

export const faqPaginas = [
  { value: "algemeen", label: "Algemeen" },
  { value: "home", label: "Home" },
  { value: "catering", label: "Catering" },
  { value: "bruiloft", label: "Bruiloft" },
  { value: "bedrijfsfeest", label: "Bedrijfsfeest" },
  { value: "evenement", label: "Evenement" },
  { value: "bbq-smoker", label: "BBQ-smoker" },
  { value: "contact", label: "Contact" },
] as const;

export const teamRollen = [
  { value: "eigenaar", label: "Eigenaar" },
  { value: "kok", label: "Kok" },
  { value: "bediening", label: "Bediening" },
  { value: "chauffeur", label: "Chauffeur" },
  { value: "hulp", label: "Hulp" },
] as const;

export const weekdagen = [
  { value: "maandag", label: "Maandag" },
  { value: "dinsdag", label: "Dinsdag" },
  { value: "woensdag", label: "Woensdag" },
  { value: "donderdag", label: "Donderdag" },
  { value: "vrijdag", label: "Vrijdag" },
  { value: "zaterdag", label: "Zaterdag" },
  { value: "zondag", label: "Zondag" },
] as const;

export const gebruikerRollen = [
  { value: "eigenaar", label: "Eigenaar" },
  { value: "medewerker", label: "Medewerker" },
  { value: "superadmin", label: "Superadmin (webbouwer)" },
] as const;

export const ticketStatussen = [
  { value: "nieuw", label: "Nieuw" },
  { value: "mee-bezig", label: "Mee bezig" },
  { value: "wacht-op-melder", label: "Wacht op reactie" },
  { value: "klaar", label: "Klaar" },
  { value: "niet-gedaan", label: "Niet gedaan" },
] as const;
export type TicketStatus = (typeof ticketStatussen)[number]["value"];
export const openTicketStatussen: TicketStatus[] = ["nieuw", "mee-bezig", "wacht-op-melder"];

export const ticketSoorten = [
  { value: "website", label: "Website" },
  { value: "marketing", label: "Marketing" },
  { value: "socials", label: "Social media" },
  { value: "google", label: "Google-profiel" },
  { value: "portal", label: "Dit portaal" },
  { value: "anders", label: "Iets anders" },
] as const;

export const fotoLicenties = [
  { value: "eigen", label: "Eigen foto" },
  { value: "opdracht", label: "Fotograaf in opdracht" },
  { value: "stock", label: "Stockfoto, gekocht" },
  { value: "gratis", label: "Gratis licentie (Unsplash, Pexels)" },
  { value: "cc-by", label: "Creative Commons, met naamsvermelding" },
  { value: "toestemming", label: "Toestemming van de maker" },
] as const;

export const fotoPersonen = [
  { value: "geen", label: "Geen herkenbare personen" },
  { value: "toestemming", label: "Herkenbare personen, met toestemming" },
  { value: "geen-toestemming", label: "Herkenbare personen, nog geen toestemming" },
] as const;

export const tijdPatroon = /^([01]\d|2[0-3]):[0-5]\d$/;
export const emailPatroon = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
