/**
 * Seeds only TRUE content: arrangements, FAQ wording as used on the site, the
 * places the bus has actually been, and the known phone number. No prices, no
 * reviews, no references. Safe to run more than once: existing items are kept.
 *
 *   npm run echte-inhoud
 *
 * Also usable in production (with DATABASE_URL set), once, after the first deploy.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";

const context = { geenSiteBuild: true };

const arrangementen = [
  {
    slug: "walking-dinner",
    titel: "Walking dinner",
    kort: "Zeven seizoensgerechten die we rondbrengen door je feest.",
    tekst: "Zeven seizoensgerechten die we rondbrengen door je feest. Niemand zit vast aan een tafel, en iedereen eet in zijn eigen tempo.",
  },
  {
    slug: "streetfood",
    titel: "Streetfood",
    kort: "Direct uit de bus, lekker informeel.",
    tekst: "Direct uit de bus, lekker informeel. Gasten halen het zelf aan het luik.",
  },
  {
    slug: "bbq-smoker",
    titel: "BBQ-smoker",
    kort: "Langzaam gegaard vlees, salades en huisgemaakte sauzen.",
    tekst: "BBQ van de smoker: langzaam gegaard vlees, salades en huisgemaakte sauzen.",
  },
  {
    slug: "buffet",
    titel: "Buffet",
    kort: "Gasten pakken zelf, wij vullen aan en houden alles vers.",
    tekst: "Gasten pakken zelf, wij vullen aan en houden alles vers.",
  },
  {
    slug: "aan-tafel",
    titel: "Aan tafel",
    kort: "Wij serveren uit, jij blijft zitten.",
    tekst: "Wij serveren uit, jij blijft zitten. Netjes, zonder poespas.",
  },
];

// Wording from the site (src/data/nieuw.ts), so portal and site start the same.
const faq: { vraag: string; antwoord: string }[] = [
  { vraag: "Wat kost de Jachtbus?", antwoord: "Dat hangt af van het aantal gasten, het menu en de vorm van je feest. We werken niet met een vaste kaart, dus je krijgt altijd een voorstel op maat. Doe je aanvraag, dan hoor je wat het voor jouw feest kost." },
  { vraag: "Vanaf hoeveel personen komen jullie?", antwoord: "We komen vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust, dan kijken we wat er kan." },
  { vraag: "Hoe ver van tevoren moet ik boeken?", antwoord: "Hoe eerder, hoe beter. Zomerse zaterdagen zijn het eerst weg. Check je datum via de aanvraag, dan hoor je of de bus nog vrij is." },
  { vraag: "Waar komen jullie allemaal?", antwoord: "In Drenthe, Groningen en Friesland. Ligt jouw plek er net buiten? Vraag het gerust, in overleg kan er vaak meer." },
  { vraag: "Wat als het regent?", antwoord: "Dan draaien we gewoon door, in overleg met een tent of overkapping erbij." },
  { vraag: "Regelen jullie ook de drankjes?", antwoord: "Dat kan, van de borrel tot een compleet drankenpakket. Zet het in je aanvraag, dan nemen we het mee in het voorstel." },
  { vraag: "Nemen jullie zelf bediening mee?", antwoord: "Ja. We komen met eigen bediening, dus niemand van je gasten hoeft achter de bar." },
  { vraag: "Kunnen jullie rekening houden met allergieën?", antwoord: "Ja. Geef allergieën en dieetwensen uiterlijk 14 dagen vooraf door, dan zorgen wij dat iedereen mee-eet." },
  { vraag: "Wat heeft de bus nodig op de locatie?", antwoord: "Een plek van minimaal 6,5 bij 2,5 meter, een stevige en vlakke ondergrond (gras of grind kan ook), een toegang waar 3,5 ton doorheen kan en 230V/16A binnen 25 meter." },
  { vraag: "Wat als er geen stroom is?", antwoord: "Meestal is daar een oplossing voor, bijvoorbeeld een aggregaat. Zet het in je aanvraag, dan denken we mee." },
];

type Provincie = "Drenthe" | "Groningen" | "Friesland";
// De Wilp stays a draft: most of it lies in Groningen province. Peer decides (docs/plan.md).
const plaatsen: { naam: string; provincie: Provincie; concept?: boolean }[] = [
  ...["Assen", "Gasselte", "Rolde", "Gieten", "Roden", "Eeserveen", "Een", "Drouwen", "Nooitgedacht", "Oudemolen", "Gasselternijveen"].map((naam) => ({ naam, provincie: "Drenthe" as const })),
  { naam: "De Wilp", provincie: "Drenthe", concept: true },
  ...["Stadskanaal", "Wedde", "Leek"].map((naam) => ({ naam, provincie: "Groningen" as const })),
  ...["Stiens", "Leeuwarden", "Drachten"].map((naam) => ({ naam, provincie: "Friesland" as const })),
];

const payload = await getPayload({ config });
let nieuw = 0;

for (const [i, a] of arrangementen.entries()) {
  const { totalDocs } = await payload.count({ collection: "arrangementen", where: { slug: { equals: a.slug } } });
  if (totalDocs) continue;
  await payload.create({ collection: "arrangementen", data: { ...a, volgorde: (i + 1) * 10, status: "gepubliceerd" }, context });
  nieuw++;
}
for (const [i, f] of faq.entries()) {
  const { totalDocs } = await payload.count({ collection: "veelgesteld", where: { vraag: { equals: f.vraag } } });
  if (totalDocs) continue;
  await payload.create({ collection: "veelgesteld", data: { ...f, pagina: "algemeen", volgorde: (i + 1) * 10, status: "gepubliceerd" }, context });
  nieuw++;
}
for (const p of plaatsen) {
  const { totalDocs } = await payload.count({ collection: "plaatsen", where: { naam: { equals: p.naam } } });
  if (totalDocs) continue;
  await payload.create({ collection: "plaatsen", data: { naam: p.naam, provincie: p.provincie, status: p.concept ? "concept" : "gepubliceerd" }, context });
  nieuw++;
}

const i = await payload.findGlobal({ slug: "instellingen", depth: 0 });
await payload.updateGlobal({
  slug: "instellingen",
  data: {
    contact: { telefoon: i.contact?.telefoon || "+31 592 656363", whatsapp: i.contact?.whatsapp || "+31 592 656363", email: i.contact?.email || null },
    profielen: { ...i.profielen, instagram: i.profielen?.instagram || "https://www.instagram.com/jachtbusfoodtruck/" },
  },
  context,
});

console.log(`Klaar: ${nieuw} nieuwe items. Bestaande items zijn niet aangeraakt.`);
process.exit(0);
