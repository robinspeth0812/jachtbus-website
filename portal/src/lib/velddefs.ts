/**
 * Field definitions per module, used by forms and server actions alike.
 * No Payload imports: also used in client components.
 */
import {
  faqPaginas,
  fotoLicenties,
  fotoPersonen,
  gelegenheden,
  keuringSoorten,
  klusStatussen,
  momentenOpties,
  provincies,
  publicatieStatussen,
  referentieGelegenheden,
  referentieMogelijkheden,
  reviewBronnen,
  teamRollen,
  weekdagen,
} from "./opties";
import type { HerhaalDef, VeldDef } from "./velden";

const statusVeld: VeldDef = { naam: "status", label: "Staat dit op de site?", soort: "keuze", verplicht: true, opties: publicatieStatussen, breedte: "kort" };

export const ingredientenDef: HerhaalDef = {
  naam: "ingredienten",
  label: "Ingrediënten per gast",
  hulp: "Alleen intern. Vul in hoeveel je per gast nodig hebt: de boodschappenlijst van een klus rekent dit om naar het aantal gasten.",
  knop: "Ingrediënt toevoegen",
  kolommen: [
    { naam: "naam", label: "Ingrediënt", soort: "tekst", max: 120, breedte: "middel" },
    { naam: "perGast", label: "Per gast", soort: "getal", min: 0, stap: 0.001, breedte: "tijd" },
    { naam: "eenheid", label: "Eenheid", soort: "tekst", max: 20, breedte: "tijd", voorbeeld: "gram" },
  ],
};

export const arrangementVelden: VeldDef[] = [
  { naam: "titel", label: "Naam", soort: "tekst", verplicht: true, max: 120, breedte: "middel", hulp: "Zoals het op de site komt. Bijv. Walking dinner." },
  { naam: "kort", label: "Korte tekst", soort: "tekst", verplicht: true, max: 240, breedte: "lang", hulp: "Eén zin voor in een overzicht." },
  { naam: "tekst", label: "Hele tekst", soort: "lang", verplicht: true, max: 8000, rijen: 7, breedte: "lang" },
  { naam: "volgorde", label: "Volgorde", soort: "getal", min: 0, max: 999, breedte: "tijd", hulp: "Laag staat bovenaan." },
  { naam: "interneRichtprijs", label: "Richtprijs per persoon (intern)", soort: "getal", min: 0, stap: 0.01, breedte: "kort", hulp: "Alleen voor jezelf, komt nooit op de site." },
  statusVeld,
];

export const referentieVelden: VeldDef[] = [
  { naam: "titel", label: "Titel", soort: "tekst", verplicht: true, max: 140, breedte: "lang" },
  { naam: "plaats", label: "Plaats", soort: "tekst", verplicht: true, max: 80, breedte: "middel", hulp: "Hiermee komt de referentie vanzelf op de kaart van de site." },
  { naam: "lat", label: "Kaart: breedtegraad", soort: "getal", min: 50, max: 54, stap: 0.0001, breedte: "tijd", hulp: "Laat leeg, tenzij het punt op de kaart niet klopt." },
  { naam: "lng", label: "Kaart: lengtegraad", soort: "getal", min: 3, max: 8, stap: 0.0001, breedte: "tijd" },
  { naam: "gelegenheid", label: "Gelegenheid", soort: "keuze", verplicht: true, opties: referentieGelegenheden, breedte: "middel", hulp: "Hierop filteren bezoekers op de referentiepagina." },
  { naam: "mogelijkheden", label: "Wat hebben we gedaan?", soort: "meerkeuze", opties: referentieMogelijkheden, hulp: "Hierop filteren bezoekers ook. Kies wat van toepassing is." },
  { naam: "gasten", label: "Aantal gasten", soort: "getal", min: 1, max: 5000, breedte: "tijd" },
  { naam: "datum", label: "Datum", soort: "datum", breedte: "datum" },
  { naam: "verhaal", label: "Het verhaal", soort: "lang", verplicht: true, max: 8000, rijen: 7, breedte: "lang" },
  { naam: "foto", label: "Hoofdfoto", soort: "foto", bron: "media", leeg: "Geen foto" },
  { naam: "extraFotos", label: "Extra foto's", soort: "fotos", bron: "media" },
  { naam: "toestemming", label: "De klant vindt het goed dat dit op de site staat", soort: "vink", hulp: "Zonder deze vink gaat de referentie niet op de site." },
  statusVeld,
];

export const reviewVelden: VeldDef[] = [
  { naam: "naam", label: "Naam", soort: "tekst", verplicht: true, max: 100, breedte: "middel", hulp: "Zoals de reviewer zelf ondertekent." },
  { naam: "gelegenheid", label: "Gelegenheid", soort: "tekst", max: 80, breedte: "middel" },
  { naam: "plaats", label: "Plaats", soort: "tekst", max: 80, breedte: "middel" },
  { naam: "tekst", label: "Wat schreef die persoon?", soort: "lang", verplicht: true, max: 2000, rijen: 5, breedte: "lang", hulp: "Letterlijk overnemen. Niet zelf bijschaven." },
  { naam: "foto", label: "Foto", soort: "foto", bron: "media", leeg: "Geen foto", hulp: "Mag leeg. Is de review aan een referentie gekoppeld, dan komt daar de foto vandaan. Alleen foto's zonder herkenbare mensen, of met toestemming, komen op de site." },
  { naam: "referentie", label: "Hoort bij deze referentie", soort: "relatie", bron: "referenties", leeg: "Niet gekoppeld", breedte: "lang", hulp: "De site linkt dan naar dat verhaal, zodra de referentie gepubliceerd is met toestemming van de klant." },
  { naam: "bron", label: "Waar komt de review vandaan?", soort: "keuze", verplicht: true, opties: reviewBronnen, breedte: "middel", hulp: "Alleen echte reviews: zo blijft het eerlijk en mag het van de wet." },
  { naam: "bronUrl", label: "Link naar de review", soort: "url", breedte: "lang", hulp: "Bij Google en Facebook verplicht om op de site te zetten." },
  { naam: "bewijs", label: "Bewijs (intern)", soort: "tekst", max: 240, breedte: "lang", hulp: "Bij mail of WhatsApp: van wanneer is het bericht, en mag het op de site? Bijv. Mail van 3 mei, gevraagd en akkoord." },
  statusVeld,
];

export const faqVelden: VeldDef[] = [
  { naam: "vraag", label: "Vraag", soort: "tekst", verplicht: true, max: 240, breedte: "lang" },
  { naam: "antwoord", label: "Antwoord", soort: "lang", verplicht: true, max: 4000, rijen: 5, breedte: "lang" },
  { naam: "pagina", label: "Op welke pagina?", soort: "keuze", verplicht: true, opties: faqPaginas, breedte: "kort" },
  { naam: "volgorde", label: "Volgorde", soort: "getal", min: 0, max: 999, breedte: "tijd", hulp: "Laag staat bovenaan." },
  statusVeld,
];

export const plaatsVelden: VeldDef[] = [
  { naam: "naam", label: "Plaats", soort: "tekst", verplicht: true, max: 80, breedte: "middel" },
  { naam: "provincie", label: "Provincie", soort: "keuze", verplicht: true, opties: provincies, breedte: "kort" },
  statusVeld,
];

export const mededelingVelden: VeldDef[] = [
  { naam: "tekst", label: "Tekst op de balk", soort: "tekst", verplicht: true, max: 140, breedte: "lang", hulp: "Kort en duidelijk: één zin. Bijv. In december zijn we dicht van de 24e tot de 28e." },
  { naam: "dagen", label: "Dagen", soort: "meerkeuze", opties: weekdagen, hulp: "Niets aangevinkt = elke dag." },
  { naam: "vanTijd", label: "Van (tijd)", soort: "tijd", breedte: "tijd", hulp: "Leeg = vanaf 00:00." },
  { naam: "totTijd", label: "Tot (tijd)", soort: "tijd", breedte: "tijd", hulp: "Leeg = tot middernacht." },
  { naam: "vanaf", label: "Periode: van", soort: "datum", breedte: "datum", hulp: "Leeg = vanaf nu." },
  { naam: "tot", label: "Periode: tot en met", soort: "datum", breedte: "datum", hulp: "Leeg = geen einde. Deze dag telt mee." },
  { naam: "linkTekst", label: "Tekst van de link", soort: "tekst", max: 60, breedte: "middel", hulp: "Leeg = Meer info." },
  { naam: "linkUrl", label: "Link", soort: "url", breedte: "lang", hulp: "Optioneel. Begint met https:// of met / voor een pagina op de site." },
  { naam: "volgorde", label: "Volgorde", soort: "getal", min: 0, max: 999, breedte: "tijd", hulp: "Laag komt eerst, als er meer mededelingen tegelijk lopen." },
  statusVeld,
];

export const evenementVelden: VeldDef[] = [
  { naam: "titel", label: "Naam van het event", soort: "tekst", verplicht: true, max: 120, breedte: "lang", hulp: "Bijv. Koningsdag Assen of Foodtruckfestival Emmen." },
  { naam: "datum", label: "Datum", soort: "datum", verplicht: true, breedte: "datum", hulp: "De dag na het event staat het vanzelf niet meer op de site." },
  { naam: "totDatum", label: "Tot en met", soort: "datum", breedte: "datum", hulp: "Alleen bij een event van meer dagen." },
  { naam: "vanTijd", label: "Van (tijd)", soort: "tijd", breedte: "tijd" },
  { naam: "totTijd", label: "Tot (tijd)", soort: "tijd", breedte: "tijd" },
  { naam: "plaats", label: "Plaats", soort: "tekst", verplicht: true, max: 80, breedte: "kort" },
  { naam: "locatie", label: "Waar precies", soort: "tekst", max: 160, breedte: "middel", hulp: "Optioneel. Bijv. de Brink, of het adres." },
  { naam: "tekst", label: "Korte tekst", soort: "lang", max: 1000, rijen: 3, breedte: "lang", hulp: "Optioneel. Wat staat er op de kaart, of wat is er te doen?" },
  { naam: "linkTekst", label: "Tekst van de link", soort: "tekst", max: 60, breedte: "middel", hulp: "Leeg = Meer over dit event." },
  { naam: "linkUrl", label: "Link", soort: "url", breedte: "lang", hulp: "Optioneel. De site van het event, of de tickets." },
  { naam: "foto", label: "Foto", soort: "foto", hulp: "Optioneel." },
  statusVeld,
];

export const klantVelden: VeldDef[] = [
  { naam: "naam", label: "Naam", soort: "tekst", verplicht: true, max: 100, breedte: "middel" },
  { naam: "bedrijf", label: "Bedrijf", soort: "tekst", max: 120, breedte: "middel" },
  { naam: "email", label: "E-mail", soort: "email", breedte: "middel" },
  { naam: "telefoon", label: "Telefoon", soort: "telefoon", breedte: "kort" },
  { naam: "adres", label: "Adres", soort: "tekst", max: 160, breedte: "middel" },
  { naam: "plaats", label: "Plaats", soort: "tekst", max: 80, breedte: "kort" },
  { naam: "notities", label: "Notities", soort: "lang", max: 4000, rijen: 4, breedte: "lang", hulp: "Alleen wat je voor het werk nodig hebt. Geen gevoelige dingen." },
];

export const keuringVelden: VeldDef[] = [
  { naam: "naam", label: "Wat moet er gebeuren?", soort: "tekst", verplicht: true, max: 120, breedte: "middel", hulp: "Bijv. APK van de bus." },
  { naam: "soort", label: "Soort", soort: "keuze", verplicht: true, opties: keuringSoorten, breedte: "kort" },
  { naam: "vervalt", label: "Moet klaar zijn op", soort: "datum", verplicht: true, breedte: "datum" },
  { naam: "laatsteKeer", label: "Laatst gedaan op", soort: "datum", breedte: "datum" },
  { naam: "intervalMaanden", label: "Hoe vaak, in maanden", soort: "getal", min: 1, max: 120, breedte: "kort", hulp: "Bijv. 12. Dan schuift de datum door als je op Gedaan klikt." },
  { naam: "herinnerDagen", label: "Taak hoeveel dagen vooraf", soort: "getal", min: 1, max: 365, breedte: "kort" },
  { naam: "uitvoerder", label: "Wie doet het", soort: "tekst", max: 120, breedte: "middel", hulp: "Garage, installateur of verzekeraar." },
  { naam: "notitie", label: "Notitie", soort: "lang", max: 2000, rijen: 3, breedte: "lang" },
];

export const teamVelden: VeldDef[] = [
  { naam: "naam", label: "Naam", soort: "tekst", verplicht: true, max: 100, breedte: "middel" },
  { naam: "rol", label: "Rol", soort: "keuze", verplicht: true, opties: teamRollen, breedte: "kort" },
  { naam: "telefoon", label: "Telefoon", soort: "telefoon", breedte: "kort" },
  { naam: "email", label: "E-mail", soort: "email", breedte: "middel" },
  { naam: "werkdagen", label: "Kan meestal op", soort: "meerkeuze", opties: weekdagen },
  { naam: "notitie", label: "Notitie", soort: "lang", max: 2000, rijen: 3, breedte: "lang", hulp: "Bijv. heeft geen rijbewijs voor de bus, of kan alleen in de avond." },
  { naam: "actief", label: "Actief, kan ingepland worden", soort: "vink" },
];

export const nietBeschikbaarDef: HerhaalDef = {
  naam: "nietBeschikbaar",
  label: "Niet beschikbaar op",
  knop: "Datum toevoegen",
  kolommen: [
    { naam: "dag", label: "Datum", soort: "datum", breedte: "datum" },
    { naam: "reden", label: "Reden", soort: "tekst", max: 120, breedte: "middel" },
  ],
};

export const fotoVelden: VeldDef[] = [
  { naam: "alt", label: "Wat is er te zien?", soort: "tekst", verplicht: true, max: 200, breedte: "lang", hulp: "Voor wie de foto niet kan zien, en voor Google. Bijv. Peer schept pulled pork uit de smoker." },
  { naam: "maker", label: "Maker", soort: "tekst", max: 120, breedte: "middel", hulp: "Zoals de fotograaf genoemd wil worden." },
  { naam: "licentie", label: "Licentie", soort: "keuze", opties: fotoLicenties, leeg: "Nog niet bekend", breedte: "middel" },
  { naam: "bronUrl", label: "Bron-link", soort: "url", breedte: "lang" },
  { naam: "personen", label: "Staan er mensen herkenbaar op?", soort: "keuze", opties: fotoPersonen, leeg: "Nog niet bekeken", breedte: "middel", hulp: "Portretrecht. Alleen foto's zonder herkenbare mensen, of met toestemming, kunnen op de site." },
];

export const klusPlanningVelden: VeldDef[] = [
  { naam: "titel", label: "Naam van de klus", soort: "tekst", verplicht: true, max: 140, breedte: "lang", hulp: "Bijv. Bruiloft Jansen in Roden." },
  { naam: "status", label: "Status", soort: "keuze", verplicht: true, opties: klusStatussen, breedte: "kort" },
  { naam: "datum", label: "Datum", soort: "datum", verplicht: true, breedte: "datum", groep: "Wanneer" },
  { naam: "aankomst", label: "Aankomst", soort: "tijd", breedte: "tijd" },
  { naam: "opbouw", label: "Opbouw klaar", soort: "tijd", breedte: "tijd" },
  { naam: "serveren", label: "Serveren", soort: "tijd", breedte: "tijd" },
  { naam: "klaar", label: "Klaar", soort: "tijd", breedte: "tijd" },
  { naam: "klant", label: "Klant", soort: "relatie", bron: "klanten", leeg: "Nog geen klant gekoppeld", breedte: "middel", groep: "Voor wie" },
  { naam: "gasten", label: "Aantal gasten", soort: "getal", min: 1, max: 5000, breedte: "tijd" },
  { naam: "arrangement", label: "Arrangement", soort: "relatie", bron: "arrangementen", leeg: "Nog niet gekozen", breedte: "middel" },
  { naam: "dieetwensen", label: "Dieetwensen en allergieën", soort: "lang", max: 2000, rijen: 3, breedte: "lang" },
  { naam: "crew", label: "Wie gaat er mee?", soort: "relaties", bron: "team", groep: "Team" },
  { naam: "notities", label: "Notities", soort: "lang", max: 4000, rijen: 3, breedte: "lang" },
];

export const klusLocatieVelden: VeldDef[] = [
  { naam: "plaats", label: "Plaats", soort: "tekst", max: 80, breedte: "middel" },
  { naam: "adres", label: "Adres of locatie", soort: "tekst", max: 200, breedte: "lang" },
  { naam: "kilometers", label: "Kilometers vanaf Gasselte", soort: "getal", min: 0, max: 2000, breedte: "kort", hulp: "Enkele reis." },
  { naam: "chkRuimte", label: "Ruimte: 6,5 x 2,5 meter vrij voor de bus", soort: "vink", groep: "Past de bus hier?" },
  { naam: "chkOndergrond", label: "Ondergrond: stevig en vlak (gras of grind mag)", soort: "vink" },
  { naam: "chkToegang", label: "Toegang: bereikbaar voor 3,5 ton", soort: "vink" },
  { naam: "chkStroom", label: "Stroom: 230V/16A binnen 25 meter", soort: "vink" },
  { naam: "chkWeerplan", label: "Weerplan afgesproken", soort: "vink" },
  { naam: "weerplan", label: "Wat doen we bij slecht weer?", soort: "lang", max: 1000, rijen: 2, breedte: "lang" },
  { naam: "locatieNotitie", label: "Bijzonderheden op de locatie", soort: "lang", max: 2000, rijen: 3, breedte: "lang", hulp: "Bijv. poort is 3 meter breed, sleutel bij de buren." },
];

export const draaiboekDef: HerhaalDef = {
  naam: "draaiboek",
  label: "Draaiboek",
  hulp: "Bij opslaan komt alles op tijd te staan.",
  knop: "Regel toevoegen",
  kolommen: [
    { naam: "wat", label: "Wat", soort: "tekst", max: 200, breedte: "lang" },
    { naam: "tijd", label: "Tijd", soort: "tijd", breedte: "tijd" },
    { naam: "wie", label: "Wie", soort: "tekst", max: 80, breedte: "kort" },
  ],
};

export const boodschapDef: HerhaalDef = {
  naam: "nieuw",
  label: "Zelf toevoegen",
  knop: "Regel toevoegen",
  kolommen: [
    { naam: "naam", label: "Wat", soort: "tekst", max: 120, breedte: "middel" },
    { naam: "hoeveelheid", label: "Hoeveel", soort: "getal", min: 0, stap: 0.01, breedte: "tijd" },
    { naam: "eenheid", label: "Eenheid", soort: "tekst", max: 20, breedte: "tijd" },
  ],
};

export const klusNaAfloopVelden: VeldDef[] = [
  { naam: "hoeGingHet", label: "Hoe ging het?", soort: "lang", max: 4000, rijen: 4, breedte: "lang", hulp: "Wat ging goed, wat doe je volgende keer anders?" },
  { naam: "fotos", label: "Foto's van deze klus", soort: "fotos", bron: "media" },
  { naam: "reviewGevraagd", label: "Om een review gevraagd", soort: "vink" },
  { naam: "factuurVerstuurd", label: "Factuur verstuurd", soort: "vink" },
];

export const offerteKopVelden: VeldDef[] = [
  { naam: "titel", label: "Onderwerp", soort: "tekst", verplicht: true, max: 140, breedte: "lang", hulp: "Bijv. Walking dinner voor 80 gasten." },
  { naam: "klant", label: "Klant", soort: "relatie", bron: "klanten", verplicht: true, leeg: "Kies een klant", breedte: "middel" },
  { naam: "geldigTot", label: "Geldig tot", soort: "datum", verplicht: true, breedte: "datum" },
  { naam: "intro", label: "Tekst boven de regels", soort: "lang", max: 2000, rijen: 3, breedte: "lang" },
  { naam: "slot", label: "Tekst onder de regels", soort: "lang", max: 2000, rijen: 3, breedte: "lang" },
];

export const aanvraagHandmatigVelden: VeldDef[] = [
  { naam: "gelegenheid", label: "Gelegenheid", soort: "keuze", verplicht: true, opties: gelegenheden, breedte: "kort" },
  { naam: "datum", label: "Datum", soort: "datum", breedte: "datum" },
  { naam: "tijd", label: "Tijd", soort: "tijd", breedte: "tijd" },
  { naam: "momenten", label: "Momenten", soort: "meerkeuze", opties: momentenOpties },
  { naam: "plaats", label: "Plaats", soort: "tekst", max: 120, breedte: "middel" },
  { naam: "gasten", label: "Aantal gasten", soort: "getal", min: 1, max: 5000, breedte: "tijd" },
  { naam: "locatie", label: "Locatie", soort: "tekst", max: 300, breedte: "lang" },
  { naam: "naam", label: "Naam", soort: "tekst", verplicht: true, max: 100, breedte: "middel" },
  { naam: "bedrijf", label: "Bedrijf", soort: "tekst", max: 120, breedte: "middel" },
  { naam: "email", label: "E-mail", soort: "email", verplicht: true, breedte: "middel" },
  { naam: "telefoon", label: "Telefoon", soort: "telefoon", breedte: "kort" },
  { naam: "opmerking", label: "Opmerking", soort: "lang", max: 3000, rijen: 4, breedte: "lang" },
];
