/**
 * Website modules with plain content: one list page and one form each, all
 * rendered by /website/[module]. No Payload imports: also used on the client.
 */
import { arrangementVelden, faqVelden, ingredientenDef, mededelingVelden, plaatsVelden, referentieVelden, reviewVelden } from "./velddefs";
import type { HerhaalDef, VeldDef } from "./velden";

export type WebsiteModule = {
  slug: "arrangementen" | "referenties" | "reviews" | "veelgesteld" | "plaatsen" | "mededelingen";
  pad: string;
  titel: string;
  enkel: string;
  titelVeld: string;
  sort: string;
  info: string;
  legeTitel: string;
  leeg: string;
  velden: VeldDef[];
  herhalingen?: HerhaalDef[];
  /** Filled from the title when empty. */
  metSlug?: boolean;
};

export const websiteModules: Record<string, WebsiteModule> = {
  arrangementen: {
    slug: "arrangementen",
    pad: "arrangementen",
    titel: "Arrangementen",
    enkel: "Arrangement",
    titelVeld: "titel",
    sort: "volgorde",
    info: "Wat je aanbiedt: de teksten staan op de site. De ingrediënten en richtprijs blijven in het portaal en worden nooit gepubliceerd.",
    legeTitel: "Nog geen arrangementen",
    leeg: "Zet hier wat je aanbiedt, zoals walking dinner of BBQ-smoker. Met ingrediënten per gast maakt het portaal straks zelf de boodschappenlijst van een klus.",
    velden: arrangementVelden,
    herhalingen: [ingredientenDef],
    metSlug: true,
  },
  referenties: {
    slug: "referenties",
    pad: "referenties",
    titel: "Referenties",
    enkel: "Referentie",
    titelVeld: "titel",
    sort: "-datum",
    info: "Klussen die op de site mogen staan als voorbeeld. Zonder toestemming van de klant gaat een referentie niet online.",
    legeTitel: "Nog geen referenties",
    leeg: "Een geslaagde klus? Schrijf kort op wat jullie deden, kies een foto en vraag de klant of het op de site mag.",
    velden: referentieVelden,
    metSlug: true,
  },
  reviews: {
    slug: "reviews",
    pad: "reviews",
    titel: "Reviews",
    enkel: "Review",
    titelVeld: "naam",
    sort: "-createdAt",
    info: "Alleen echte reviews, letterlijk overgenomen, met de bron erbij. Zelf verzonnen of aangepaste reviews zijn misleidend en mogen niet.",
    legeTitel: "Nog geen reviews",
    leeg: "Krijg je een mooie review op Google, of per mail of WhatsApp? Neem hem letterlijk over en zet de bron erbij. Na elke afgeronde klus staat er vanzelf een taak om erom te vragen.",
    velden: reviewVelden,
  },
  faq: {
    slug: "veelgesteld",
    pad: "faq",
    titel: "Veelgestelde vragen",
    enkel: "Vraag",
    titelVeld: "vraag",
    sort: "volgorde",
    info: "Per pagina op de site. Antwoord zoals je het aan de telefoon zou zeggen.",
    legeTitel: "Nog geen vragen",
    leeg: "Welke vraag krijg je steeds aan de telefoon? Zet hem hier met je antwoord, dan staat hij op de site.",
    velden: faqVelden,
  },
  werkgebied: {
    slug: "plaatsen",
    pad: "werkgebied",
    titel: "Werkgebied",
    enkel: "Plaats",
    titelVeld: "naam",
    sort: "naam",
    info: "Plaatsen waar de bus gestaan heeft, per provincie. De site toont ze in het werkgebied.",
    legeTitel: "Nog geen plaatsen",
    leeg: "Zet hier de plaatsen waar de bus al gestaan heeft. Alleen echte plaatsen: dat is het sterkste bewijs dat je er kunt komen.",
    velden: plaatsVelden,
  },
  mededelingen: {
    slug: "mededelingen",
    pad: "mededelingen",
    titel: "Mededelingen",
    enkel: "Mededeling",
    titelVeld: "tekst",
    sort: "-vanaf",
    info: "Een balk bovenaan de site, eventueel met een begin en eind. Zet hem uit door hem op Concept te zetten.",
    legeTitel: "Geen mededelingen",
    leeg: "Volgeboekt in juni, of vakantie? Zet het hier en de balk staat op de site zolang de periode loopt.",
    velden: mededelingVelden,
  },
};
