/**
 * LOCAL ONLY. Fills every module with visibly fake data ("Voorbeeld"), so all
 * screens can be judged. Never run automatically, and refuses to run when
 * DATABASE_URL is set.
 *
 *   rm -f jachtbus-dev.db && npm run echte-inhoud && npm run voorbeeld
 *
 * Local logins, password for both: lokaal-alleen-2026
 *   peer@voorbeeld.nl   (eigenaar)
 *   robin@voorbeeld.nl  (superadmin)
 *   hulp@voorbeeld.nl   (medewerker)
 */
export {};

if (process.env.DATABASE_URL) {
  console.error("Dit script is alleen voor lokaal: DATABASE_URL is gezet, dus ik stop.");
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("../src/payload.config");
const { default: sharp } = await import("sharp");
const { dagNaarIso, dagPlus, nederlandseDatum } = await import("../src/lib/datum");

const payload = await getPayload({ config });
const context = { geenSiteBuild: true };
const WACHTWOORD = "lokaal-alleen-2026";

const { totalDocs: bestaand } = await payload.count({ collection: "users" });
if (bestaand) {
  console.error("Er staan al gebruikers in deze database. Gooi jachtbus-dev.db weg en begin opnieuw.");
  process.exit(1);
}

const vandaag = nederlandseDatum();
const op = (dagen: number) => dagNaarIso(dagPlus(vandaag, dagen));
/** Next Saturday, so the home line reads "Zaterdag staat de bus in Roden". */
const naarZaterdag = (6 - new Date(`${vandaag}T12:00:00Z`).getUTCDay() + 7) % 7 || 7;

const peer = await payload.create({ collection: "users", data: { email: "peer@voorbeeld.nl", password: WACHTWOORD, naam: "Peer", rol: "eigenaar" } });
const robin = await payload.create({ collection: "users", data: { email: "robin@voorbeeld.nl", password: WACHTWOORD, naam: "Robin", rol: "superadmin" } });
await payload.create({ collection: "users", data: { email: "hulp@voorbeeld.nl", password: WACHTWOORD, naam: "Voorbeeld Hulp", rol: "medewerker" } });

const lid = (naam: string, rol: "eigenaar" | "kok" | "bediening" | "chauffeur" | "hulp", telefoon: string, werkdagen: ("vrijdag" | "zaterdag" | "zondag")[]) =>
  payload.create({ collection: "team", data: { naam, rol, telefoon, werkdagen, actief: true } });
const tPeer = await lid("Peer", "eigenaar", "06 00000001", ["vrijdag", "zaterdag", "zondag"]);
const tKok = await lid("Voorbeeld Anna (kok)", "kok", "06 00000002", ["zaterdag", "zondag"]);
const tHulp = await lid("Voorbeeld Sem (bediening)", "bediening", "06 00000003", ["vrijdag", "zaterdag"]);

// Demo arrangements with ingredients: the true ones in echte-inhoud have no quantities.
const walking = await payload.create({
  collection: "arrangementen",
  data: {
    slug: "voorbeeld-walking-dinner",
    titel: "Voorbeeld: walking dinner",
    kort: "Voorbeeld van een arrangement met ingrediënten per gast.",
    tekst: "Dit is voorbeeldtekst om te zien hoe het scherm eruitziet.",
    volgorde: 900,
    interneRichtprijs: 42.5,
    status: "concept",
    ingredienten: [
      { naam: "Voorbeeld: seizoensgroente", perGast: 0.15, eenheid: "kilo" },
      { naam: "Voorbeeld: rundvlees", perGast: 0.12, eenheid: "kilo" },
      { naam: "Voorbeeld: brood", perGast: 0.5, eenheid: "stuks" },
      { naam: "Voorbeeld: dessertcrème", perGast: 0.08, eenheid: "liter" },
    ],
  },
  context,
});
const smoker = await payload.create({
  collection: "arrangementen",
  data: {
    slug: "voorbeeld-smoker",
    titel: "Voorbeeld: smoker",
    kort: "Voorbeeld van een tweede arrangement.",
    tekst: "Dit is voorbeeldtekst om te zien hoe het scherm eruitziet.",
    volgorde: 910,
    interneRichtprijs: 35,
    status: "concept",
    ingredienten: [
      { naam: "Voorbeeld: pulled pork", perGast: 0.25, eenheid: "kilo" },
      { naam: "Voorbeeld: coleslaw", perGast: 0.1, eenheid: "kilo" },
    ],
  },
  context,
});

/** A plain coloured placeholder with the word VOORBEELD on it. */
async function foto(tekst: string, kleur: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="${kleur}"/><text x="600" y="420" font-family="Arial" font-size="90" font-weight="700" fill="#fff" text-anchor="middle">VOORBEELD</text><text x="600" y="510" font-family="Arial" font-size="44" fill="#fff" text-anchor="middle">${tekst}</text></svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 70 }).toBuffer();
}
async function maakFoto(alt: string, kleur: string, personen: "geen" | "toestemming" | "geen-toestemming" | null) {
  const data = await foto(alt.replace("Voorbeeld: ", ""), kleur);
  return payload.create({
    collection: "media",
    data: { alt, maker: "Voorbeeld Fotograaf", licentie: "opdracht", personen },
    file: { data, mimetype: "image/jpeg", name: `${alt.replace(/\W+/g, "-").toLowerCase()}.jpg`, size: data.length },
    context,
  });
}
const fBus = await maakFoto("Voorbeeld: de bus op een erf", "#075e29", "geen");
await maakFoto("Voorbeeld: gasten aan de borrel", "#1b1817", "geen-toestemming");
await maakFoto("Voorbeeld: smoker in de tuin", "#57504a", null);

const aanvraag = (d: Record<string, unknown>) => payload.create({ collection: "aanvragen", data: { bron: "site", ...d } as never });

await aanvraag({ gelegenheid: "bruiloft", datum: op(180), tijd: "17:00", momenten: ["borrel", "diner"], plaats: "Rolde", gasten: 90, locatie: "Voorbeeld: boerderij aan de Hoofdstraat", naam: "Voorbeeld Jansen", email: "jansen@voorbeeld.nl", telefoon: "06 12345678", opmerking: "Dit is een voorbeeldaanvraag. We willen graag buiten eten als het droog is." });
await aanvraag({ gelegenheid: "verjaardag", datum: op(40), tijd: "16:00", momenten: ["diner"], plaats: "Gieten", gasten: 25, locatie: "Voorbeeld: in de tuin", naam: "Voorbeeld De Vries", email: "devries@voorbeeld.nl", telefoon: "06 22345678", opmerking: "Kleine groep: toont de waarschuwing onder 40 gasten." });
const a3 = await aanvraag({ gelegenheid: "bedrijfsfeest", datum: op(naarZaterdag), tijd: "18:00", momenten: ["diner", "avondsnack"], plaats: "Assen", gasten: 120, locatie: "Voorbeeld: bedrijfsterrein", naam: "Voorbeeld Bakker BV", email: "bakker@voorbeeld.nl", telefoon: "0592 123456", opmerking: "Datum valt samen met een klus: toont de waarschuwing dat de bus al ergens staat.", fase: "contact" });
const a4 = await aanvraag({ gelegenheid: "jubileum", datum: op(60), tijd: "15:00", momenten: ["borrel"], plaats: "Leek", gasten: 60, naam: "Voorbeeld Smit", email: "smit@voorbeeld.nl", telefoon: "06 32345678", fase: "offerte" });
const a5 = await aanvraag({ gelegenheid: "bruiloft", datum: op(naarZaterdag), tijd: "16:00", momenten: ["borrel", "diner", "avondsnack"], plaats: "Roden", gasten: 80, locatie: "Voorbeeld: Schuur aan de Esch 1", naam: "Voorbeeld Mulder", email: "mulder@voorbeeld.nl", telefoon: "06 42345678", fase: "bevestigd" });
await aanvraag({ gelegenheid: "festival", datum: op(90), plaats: "Maastricht", gasten: 500, naam: "Voorbeeld Festival", email: "festival@voorbeeld.nl", opmerking: "Ver buiten het werkgebied.", fase: "afgewezen" });
await aanvraag({ gelegenheid: "overige", gelegenheidOverig: "Voorbeeld: open dag", datum: op(25), plaats: "Drachten", gasten: 150, naam: "Voorbeeld Visser", email: "visser@voorbeeld.nl", telefoon: "+31 6 52345678" });

const klantVan = (a: { klant?: unknown }) => (typeof a.klant === "object" && a.klant ? (a.klant as { id: number }).id : (a.klant as number));

const klus1 = await payload.create({
  collection: "klussen",
  data: {
    titel: "Voorbeeld: bruiloft Mulder in Roden",
    status: "bevestigd",
    datum: op(naarZaterdag),
    aankomst: "13:00",
    opbouw: "15:00",
    serveren: "17:30",
    klaar: "23:00",
    klant: klantVan(a5),
    aanvraag: a5.id,
    plaats: "Roden",
    adres: "Voorbeeld: Schuur aan de Esch 1",
    kilometers: 42,
    gasten: 80,
    arrangement: walking.id,
    dieetwensen: "Voorbeeld: 2x vegetarisch, 1x glutenvrij.",
    crew: [tPeer.id, tKok.id, tHulp.id],
    notities: "Voorbeeldklus om alle schermen te laten zien.",
    chkRuimte: true,
    chkOndergrond: true,
    chkToegang: true,
    chkStroom: false,
    chkWeerplan: false,
    locatieNotitie: "Voorbeeld: de poort is 3 meter breed.",
    draaiboek: [
      { tijd: "13:00", wat: "Aankomst, bus op zijn plek", wie: "Peer" },
      { tijd: "15:00", wat: "Opbouw klaar, koeling meten", wie: "Voorbeeld Anna" },
      { tijd: "16:00", wat: "Borrel uit de bus", wie: "Voorbeeld Sem" },
      { tijd: "17:30", wat: "Eerste gang", wie: "Iedereen" },
      { tijd: "23:00", wat: "Afbouwen en schoonmaakronde", wie: "Iedereen" },
    ],
    boodschappen: [
      { naam: "Voorbeeld: seizoensgroente", hoeveelheid: 12, eenheid: "kilo", gedaan: true, uitArrangement: true },
      { naam: "Voorbeeld: rundvlees", hoeveelheid: 9.6, eenheid: "kilo", gedaan: false, uitArrangement: true },
      { naam: "Voorbeeld: brood", hoeveelheid: 40, eenheid: "stuks", gedaan: false, uitArrangement: true },
      { naam: "Voorbeeld: servetten", hoeveelheid: 200, eenheid: "stuks", gedaan: false, uitArrangement: false },
    ],
  },
});
await payload.update({ collection: "aanvragen", id: a5.id, data: { klus: klus1.id }, context: { geenOpvolging: true } });

const k = await payload.create({ collection: "klanten", data: { naam: "Voorbeeld Hoekstra", bedrijf: "Voorbeeld Metaal BV", email: "hoekstra@voorbeeld.nl", telefoon: "06 62345678", plaats: "Stadskanaal", notities: "Voorbeeld: belt liever dan dat hij mailt." } });
// Two jobs on one day: shows the double booking everywhere.
await payload.create({ collection: "klussen", data: { titel: "Voorbeeld: bedrijfsfeest Hoekstra in Stadskanaal", status: "bevestigd", datum: op(naarZaterdag + 14), aankomst: "15:00", serveren: "18:00", klant: k.id, plaats: "Stadskanaal", gasten: 110, arrangement: smoker.id, crew: [tPeer.id], kilometers: 22 } });
await payload.create({ collection: "klussen", data: { titel: "Voorbeeld: tuinfeest in Gasselte (optie)", status: "optie", datum: op(naarZaterdag + 14), plaats: "Gasselte", gasten: 45, kilometers: 2 } });
await payload.create({ collection: "klussen", data: { titel: "Voorbeeld: jubileum in Drachten", status: "bevestigd", datum: op(naarZaterdag + 7), aankomst: "14:00", serveren: "17:00", plaats: "Drachten", gasten: 70, kilometers: 68 } });
// Already happened: leaves the invoice and review tasks behind.
await payload.create({
  collection: "klussen",
  data: { titel: "Voorbeeld: straatfeest in Assen", status: "afgerond", datum: op(-10), plaats: "Assen", gasten: 55, kilometers: 24, hoeGingHet: "Voorbeeld: alles op tijd op, volgende keer meer brood.", fotos: [fBus.id] },
});

const offerte = (d: Record<string, unknown>) => payload.create({ collection: "offertes", data: d as never });
const regels = [
  { omschrijving: "Voorbeeld: walking dinner, per persoon", aantal: 80, prijs: 42.5, btw: "9" },
  { omschrijving: "Voorbeeld: borrelhapjes, per persoon", aantal: 80, prijs: 6, btw: "9" },
  { omschrijving: "Voorbeeld: drankenpakket", aantal: 1, prijs: 480, btw: "21" },
];
const intro = "Beste klant,\n\nDit is een voorbeeldofferte om te zien hoe het er op papier uitziet.";
await offerte({ nummer: "2026-001", titel: "Voorbeeld: bruiloft voor 80 gasten", status: "geaccepteerd", klant: klantVan(a5), aanvraag: a5.id, klus: klus1.id, geldigTot: op(10), verstuurdOp: op(-30), intro, slot: "Vragen? Bel of mail ons gerust.", regels });
await offerte({ nummer: "2026-002", titel: "Voorbeeld: jubileum voor 60 gasten", status: "verstuurd", klant: klantVan(a4), aanvraag: a4.id, geldigTot: op(21), verstuurdOp: op(-3), intro, regels: regels.slice(0, 2) });
await offerte({ nummer: "2026-003", titel: "Voorbeeld: bedrijfsfeest voor 120 gasten", status: "concept", klant: klantVan(a3), aanvraag: a3.id, geldigTot: op(30), intro, regels: regels.slice(0, 1) });
await offerte({ nummer: "2026-004", titel: "Voorbeeld: verlopen offerte", status: "verstuurd", klant: k.id, geldigTot: op(-4), verstuurdOp: op(-34), regels: regels.slice(1, 2) });

await payload.create({ collection: "taken", data: { titel: "Voorbeeld: extra gasfles bestellen", vervalt: op(-1), soort: "eigen", voor: peer.id, omschrijving: "Eigen taak die te laat is." } });
await payload.create({ collection: "taken", data: { titel: "Voorbeeld: tentadres vragen voor Roden", vervalt: new Date(Date.now() + 3 * 3600e3).toISOString(), soort: "eigen", klus: klus1.id } });

const keuring = (naam: string, soort: string, dagen: number, intervalMaanden: number, uitvoerder: string, laatste?: number) =>
  payload.create({ collection: "keuringen", data: { naam, soort, vervalt: op(dagen), intervalMaanden, uitvoerder, herinnerDagen: 30, laatsteKeer: laatste === undefined ? undefined : op(laatste) } as never });
await keuring("Voorbeeld: gaskeuring", "gas", -5, 12, "Voorbeeld Gastechniek", -370);
await keuring("Voorbeeld: elektra NEN 3140", "elektra", 15, 12, "Voorbeeld Elektra", -350);
await keuring("Voorbeeld: APK van de bus", "apk", 22, 12, "Voorbeeld Garage", -343);
await keuring("Voorbeeld: brandblussers", "brand", 200, 12, "Voorbeeld Brandveilig", -165);
await keuring("Voorbeeld: HACCP-documenten nalopen", "haccp", 60, 12, "Peer", -305);
await keuring("Voorbeeld: verzekering", "verzekering", 400, 12, "Voorbeeld Assurantie", -30);
await keuring("Voorbeeld: klein onderhoud", "onderhoud", 120, 6, "Voorbeeld Garage", -60);

const meting = (soort: "koeling" | "vriezer" | "kern" | "warmhouden", temperatuur: number, binnenNorm: boolean, uren: number, actie?: string) =>
  payload.create({ collection: "metingen", data: { soort, temperatuur, binnenNorm, actie, op: new Date(Date.now() - uren * 3600e3).toISOString(), door: peer.id } });
await meting("koeling", 4, true, 2);
await meting("vriezer", -19, true, 2);
await meting("kern", 78, true, 26);
await meting("koeling", 9.5, false, 50, "Voorbeeld: deur stond open. Dicht gedaan, na een uur 5 graden.");
await meting("warmhouden", 64, true, 50);

await payload.create({
  collection: "schoonmaakrondes",
  data: {
    op: new Date(Date.now() - 26 * 3600e3).toISOString(),
    door: peer.id,
    opmerking: "Voorbeeld: alles gedaan behalve de vloer.",
    punten: [
      { punt: "Werkbladen en snijplanken", gedaan: true },
      { punt: "Koeling en vriezer, binnenkant", gedaan: true },
      { punt: "Vloer van de bus", gedaan: false },
    ],
  },
});

await payload.create({
  collection: "referenties",
  data: { slug: "voorbeeld-boerderijfeest", titel: "Voorbeeld: boerderijfeest", plaats: "Voorbeelddorp", gelegenheid: "Tuinfeest", gasten: 70, datum: op(-40), verhaal: "Dit is een voorbeeldverhaal, geen echte klus. Het laat zien hoe een referentie eruitziet.", foto: fBus.id, toestemming: true, status: "gepubliceerd" },
  context,
});
await payload.create({
  collection: "referenties",
  data: { slug: "voorbeeld-zonder-toestemming", titel: "Voorbeeld: nog geen toestemming", plaats: "Voorbeelddorp", gelegenheid: "Bruiloft", verhaal: "Voorbeeld: blijft concept tot de klant akkoord is.", toestemming: false, status: "concept" },
  context,
});
// Visibly test data, spread over the map. Saving runs the lookup of the map
// position, as it does for a real reference.
const kaartCases = [
  { slug: "bruiloft-assen", titel: "Testcase: bruiloft in de tuin", plaats: "Assen", gelegenheid: "Bruiloft", gasten: 90, datum: "2026-06-13", verhaal: "Testtekst. Hier vertelt Peer straks hoe de dag verliep, wat er op het menu stond en wat de gasten ervan vonden." },
  { slug: "bedrijfsfeest-assen", titel: "Testcase: personeelsfeest", plaats: "Assen", gelegenheid: "Bedrijfsfeest", gasten: 120, datum: "2026-09-04", verhaal: "Testtekst. Twee klussen in dezelfde plaats komen naast elkaar op de kaart te staan." },
  { slug: "walking-dinner-gasselte", titel: "Testcase: walking dinner op het erf", plaats: "Gasselte", gelegenheid: "Tuinfeest", gasten: 45, datum: "2026-05-23", verhaal: "Testtekst. Een klus bij ons om de hoek." },
  { slug: "tuinfeest-roden", titel: "Testcase: tuinfeest", plaats: "Roden", gelegenheid: "Tuinfeest", gasten: 60, datum: "2026-07-18", verhaal: "Testtekst. Zo ziet een klus eruit in de kaart." },
  { slug: "bruiloft-leeuwarden", titel: "Testcase: bruiloft in Friesland", plaats: "Leeuwarden", gelegenheid: "Bruiloft", gasten: 110, datum: "2026-08-08", verhaal: "Testtekst. Zo zie je de spreiding tot ver over de provinciegrens." },
  { slug: "evenement-drachten", titel: "Testcase: dorpsfeest", plaats: "Drachten", gelegenheid: "Evenement", gasten: 200, datum: "2026-06-27", verhaal: "Testtekst. Een evenement met wat meer volk." },
  { slug: "bbq-stiens", titel: "Testcase: BBQ-smoker op locatie", plaats: "Stiens", gelegenheid: "Bedrijfsfeest", gasten: 50, datum: "2026-07-04", verhaal: "Testtekst. Het noordelijkste punt op de kaart." },
  { slug: "bedrijfsfeest-stadskanaal", titel: "Testcase: jubileum van een bedrijf", plaats: "Stadskanaal", gelegenheid: "Bedrijfsfeest", gasten: 75, datum: "2026-04-17", verhaal: "Testtekst. Een jubileum in Groningen." },
  { slug: "tuinfeest-wedde", titel: "Testcase: verjaardag in Westerwolde", plaats: "Wedde", gelegenheid: "Tuinfeest", gasten: 40, datum: "2026-05-09", verhaal: "Testtekst. Precies het minimum aantal gasten." },
  // Not in the site's list of known towns: these two only land on the map
  // because the portal looks up their position when saving.
  { slug: "bruiloft-zuidlaren", titel: "Testcase: bruiloft aan het meer", plaats: "Zuidlaren", gelegenheid: "Bruiloft", gasten: 80, datum: "2026-09-12", verhaal: "Testtekst. Deze plaats stond nog niet in de lijst van de site: het portaal zocht het punt zelf op." },
  { slug: "evenement-emmen", titel: "Testcase: open dag", plaats: "Emmen", gelegenheid: "Evenement", gasten: 150, datum: "2026-10-03", verhaal: "Testtekst. Ook dit punt zocht het portaal zelf op." },
];
// What the test jobs did, so the filters on the references page have something to show.
const kaartMogelijkheden: Record<string, ("Walking dinner" | "BBQ-smoker" | "Streetfood" | "Buffet" | "Aan tafel")[]> = {
  "bruiloft-assen": ["Walking dinner", "Streetfood"],
  "bedrijfsfeest-assen": ["BBQ-smoker"],
  "walking-dinner-gasselte": ["Walking dinner"],
  "tuinfeest-roden": ["Streetfood"],
  "bbq-stiens": ["BBQ-smoker"],
  "bedrijfsfeest-stadskanaal": ["Buffet"],
  "bruiloft-zuidlaren": ["Aan tafel"],
};
const kaartCaseIds: Record<string, number> = {};
for (const item of kaartCases) {
  const kaartCase = await payload.create({
    collection: "referenties",
    data: { ...item, mogelijkheden: kaartMogelijkheden[item.slug], slug: `testcase-${item.slug}`, foto: item.slug === "bruiloft-assen" ? fBus.id : undefined, toestemming: true, status: "gepubliceerd" },
    context,
  });
  kaartCaseIds[item.slug] = kaartCase.id;
  // The lookup service asks for at most one request per second.
  await new Promise((resolve) => setTimeout(resolve, 1100));
}
await payload.create({
  collection: "reviews",
  data: { naam: "Voorbeeld Reviewer", gelegenheid: "Voorbeeld", plaats: "Voorbeelddorp", tekst: "Dit is geen echte review, alleen voorbeeldtekst om het scherm te kunnen beoordelen.", bron: "E-mail van de klant", bewijs: "Voorbeeld: mail van 3 mei", status: "gepubliceerd" },
  context,
});
// Linked to a job in each province, so the local pages can filter on them.
for (const [naam, gelegenheid, plaats, tekst, referentie] of [
  ["Voorbeeld Bruidspaar", "Bruiloft", "Assen", "Voorbeeld: hier komt straks een echte reactie van een bruidspaar. Dit is geen echte review.", kaartCaseIds["bruiloft-assen"]],
  ["Voorbeeld Bedrijf", "Bedrijfsfeest", "Groningen", "Voorbeeld: hier komt straks een echte reactie van een bedrijf. Dit is geen echte review.", kaartCaseIds["bedrijfsfeest-stadskanaal"]],
  ["Voorbeeld Feestvierder", "Tuinfeest", "Drachten", "Voorbeeld: hier komt straks een echte reactie van iemand die een tuinfeest gaf. Dit is geen echte review.", kaartCaseIds["evenement-drachten"]],
] as const) {
  await payload.create({ collection: "reviews", data: { naam, gelegenheid, plaats, tekst, referentie, bron: "E-mail van de klant", bewijs: "Voorbeeld: geen echte mail", status: "gepubliceerd" }, context });
}
await payload.create({ collection: "reviews", data: { naam: "Voorbeeld Google", tekst: "Voorbeeld: nog geen bronlink, dus nog niet op de site.", bron: "Google", status: "concept" }, context });
await payload.create({ collection: "mededelingen", data: { tekst: "Voorbeeld: in de kerstweek zijn we dicht.", linkTekst: "Plan je feest", linkUrl: "/aanvraag", vanaf: op(-1), tot: op(50), dagen: ["maandag", "dinsdag"], vanTijd: "09:00", totTijd: "17:00", volgorde: 100, status: "concept" }, context });

const ticket = await payload.create({ collection: "tickets", data: { titel: "Voorbeeld: kan de openingsfoto anders?", soort: "website", omschrijving: "Dit is een voorbeeldticket. Op de home staat nog een oude foto.", status: "wacht-op-melder", melder: peer.id } });
await payload.update({ collection: "tickets", id: ticket.id, data: { berichten: [{ door: robin.id, tekst: "Voorbeeld: kun je me de nieuwe foto sturen?", op: new Date().toISOString(), statusNaar: "wacht-op-melder" }] } });
await payload.create({ collection: "tickets", data: { titel: "Voorbeeld: Google-profiel nakijken", soort: "google", omschrijving: "Voorbeeldticket dat net binnen is.", status: "nieuw", melder: peer.id } });

await payload.updateGlobal({ slug: "instellingen", data: { mail: { aanvraag: { aan: [peer.id] }, herinnering: { aan: [peer.id] } } }, context });

console.log("Klaar. Inloggen met peer@voorbeeld.nl en het wachtwoord uit de kop van dit script.");
process.exit(0);
