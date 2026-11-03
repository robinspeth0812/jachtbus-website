import type { VeldDef } from "@/lib/velden";

/** Flat on purpose: the page maps the nested global to these names and back. */
export const instellingenVelden: VeldDef[] = [
  { naam: "telefoon", label: "Telefoon op de site", soort: "telefoon", breedte: "kort", groep: "Contact" },
  { naam: "whatsapp", label: "WhatsApp-nummer", soort: "telefoon", breedte: "kort" },
  { naam: "email", label: "E-mail op de site", soort: "email", breedte: "middel", hulp: "Dit adres staat op de site en op offertes." },
  { naam: "instagram", label: "Instagram", soort: "url", breedte: "lang", groep: "Profielen" },
  { naam: "facebook", label: "Facebook", soort: "url", breedte: "lang" },
  { naam: "google", label: "Google-bedrijfsprofiel", soort: "url", breedte: "lang" },
  { naam: "aanvraagAan", label: "Wie krijgt een mail bij een nieuwe aanvraag?", soort: "relaties", bron: "gebruikers", hulp: "Niemand gekozen: dan krijgt de eigenaar hem.", groep: "Wie krijgt welke mail" },
  { naam: "aanvraagExtra", label: "Ook naar dit adres", soort: "email", breedte: "middel" },
  { naam: "herinneringAan", label: "Wie krijgt herinneringen over taken die te laat zijn?", soort: "relaties", bron: "gebruikers" },
  { naam: "herinneringExtra", label: "Ook naar dit adres", soort: "email", breedte: "middel" },
];
