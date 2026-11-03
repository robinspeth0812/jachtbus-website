import { headersWithCors, type Endpoint, type PayloadRequest } from "payload";
import { BEDRIJF } from "./bedrijf";
import { dagNaarIso, datumLang, nederlandseDatum } from "./datum";
import { ontvangersVan, stuurMelding, stuurTekstMail } from "./mail";
import { emailPatroon, gelegenheden, type Gelegenheid, labelVan, type Moment, momentenOpties } from "./opties";
import { ipVan, isSpam, overLimiet } from "./spam";

/**
 * POST /api/aanvraag: the request form on the site (multipart FormData).
 * Stores a request in phase Nieuw and mails the recipients from Instellingen
 * plus a confirmation to the sender. Mail never blocks success.
 */
const antwoord = (req: PayloadRequest, status: number, body: object) =>
  Response.json(body, { status, headers: headersWithCors({ headers: new Headers(), req }) });

export type AanvraagVelden = {
  gelegenheid: string;
  gelegenheid_overig: string;
  datum: string;
  tijd: string;
  momenten: string[];
  plaats: string;
  gasten: string;
  locatie: string;
  naam: string;
  email: string;
  telefoon: string;
  opmerking: string;
};

/** Pure validation, separate from Payload. */
export function controleer(ruw: AanvraagVelden, vandaag = nederlandseDatum()) {
  const fouten: Record<string, string> = {};
  if (!gelegenheden.some((g) => g.value === ruw.gelegenheid)) fouten.gelegenheid = "Kies een gelegenheid.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ruw.datum) || Number.isNaN(Date.parse(ruw.datum))) fouten.datum = "Kies een datum.";
  else if (ruw.datum < vandaag) fouten.datum = "Kies een datum vanaf vandaag.";
  const gasten = Number(ruw.gasten);
  if (!Number.isInteger(gasten) || gasten < 1 || gasten > 5000) fouten.gasten = "Vul het aantal gasten in.";
  if (!ruw.plaats) fouten.plaats = "Vul de plaats in.";
  if (!ruw.naam) fouten.naam = "Vul je naam in.";
  if (!emailPatroon.test(ruw.email)) fouten.email = "Vul een e-mailadres in, zoals naam@voorbeeld.nl.";
  if (ruw.telefoon && !/^[+\d][\d\s\-()]{7,}$/.test(ruw.telefoon)) fouten.telefoon = "Vul een telefoonnummer in, zoals 06 12345678.";
  return fouten;
}

export const aanvraagEndpoint: Endpoint = {
  path: "/aanvraag",
  method: "post",
  handler: async (req) => {
    const { payload } = req;
    let form: FormData;
    try {
      form = await req.formData!();
    } catch {
      return antwoord(req, 400, { ok: false, fout: "Je aanvraag kon niet worden verstuurd." });
    }
    const tekst = (k: string, max: number) => {
      const v = form.get(k);
      return typeof v === "string" ? v.replace(/\r/g, "").trim().slice(0, max) : "";
    };

    // Bots hear "fine" and learn nothing.
    if (isSpam({ website: tekst("website", 200), ts: tekst("ts", 20) })) {
      payload.logger.info({ msg: "Aanvraag geweigerd", reden: "spam" });
      return antwoord(req, 200, { ok: true });
    }
    if (overLimiet(ipVan(req.headers))) {
      return antwoord(req, 429, { ok: false, fout: "Er zijn net veel aanvragen verstuurd vanaf dit adres. Probeer het over een uur opnieuw, of bel ons even." });
    }

    const velden: AanvraagVelden = {
      gelegenheid: tekst("gelegenheid", 20),
      gelegenheid_overig: tekst("gelegenheid_overig", 120),
      datum: tekst("datum", 10),
      tijd: tekst("tijd", 40),
      momenten: form.getAll("momenten").map(String).filter((m) => momentenOpties.some((o) => o.value === m)),
      plaats: tekst("plaats", 120),
      gasten: tekst("gasten", 6),
      locatie: tekst("locatie", 300),
      naam: tekst("naam", 100).replace(/\s+/g, " "),
      email: tekst("email", 200),
      telefoon: tekst("telefoon", 20),
      opmerking: tekst("opmerking", 3000),
    };
    const fouten = controleer(velden);
    if (Object.keys(fouten).length) return antwoord(req, 400, { ok: false, fout: "Controleer de velden.", fouten });

    let id: number;
    try {
      const doc = await payload.create({
        collection: "aanvragen",
        data: {
          gelegenheid: velden.gelegenheid as Gelegenheid,
          gelegenheidOverig: velden.gelegenheid_overig,
          datum: dagNaarIso(velden.datum),
          tijd: velden.tijd,
          momenten: velden.momenten as Moment[],
          plaats: velden.plaats,
          gasten: Number(velden.gasten),
          locatie: velden.locatie,
          naam: velden.naam,
          email: velden.email,
          telefoon: velden.telefoon,
          opmerking: velden.opmerking,
          fase: "nieuw",
          bron: "site",
        },
        overrideAccess: true,
      });
      id = doc.id;
    } catch {
      payload.logger.error("Aanvraag opslaan mislukt");
      return antwoord(req, 500, { ok: false, fout: "Versturen lukte niet. Probeer het later opnieuw, of bel ons even." });
    }

    // Do not wait: the visitor gets an answer at once, even when the mail server is slow.
    void stuurMails(req, velden, id).catch(() => payload.logger.error("Aanvraagmail mislukt"));
    return antwoord(req, 200, { ok: true });
  },
};

async function stuurMails(req: PayloadRequest, v: AanvraagVelden, id: number) {
  const { payload } = req;
  const wat = v.gelegenheid === "overige" && v.gelegenheid_overig ? v.gelegenheid_overig : labelVan(gelegenheden, v.gelegenheid);
  const wanneer = datumLang(v.datum);
  const aan = await ontvangersVan(payload, "aanvraag");
  await stuurMelding(payload, {
    aan,
    onderwerp: `Nieuwe aanvraag: ${wat.toLowerCase()} van ${v.naam}`,
    alineas: [
      `${v.naam} heeft een aanvraag gedaan via de site.`,
      `${wat}, ${v.gasten} gasten, ${wanneer}, ${v.plaats}.`,
      [v.telefoon, v.email].filter(Boolean).join(" of "),
      ...(Number(v.gasten) < BEDRIJF.minimumGasten ? [`Let op: minder dan ${BEDRIJF.minimumGasten} gasten.`] : []),
    ],
    pad: `/aanvragen/${id}`,
    knop: "Bekijk de aanvraag",
    antwoordAan: v.email,
  });
  const instellingen = await payload.findGlobal({ slug: "instellingen", depth: 0, overrideAccess: true });
  const telefoon = instellingen.contact?.telefoon || BEDRIJF.telefoon;
  await stuurTekstMail(payload, {
    aan: v.email,
    onderwerp: "We hebben je aanvraag binnen",
    alineas: [
      `Moi ${v.naam.split(" ")[0]},`,
      `Bedankt voor je aanvraag. We kijken er zo snel mogelijk naar en laten je weten of de bus op ${wanneer} kan komen.`,
      `Wat wij hebben genoteerd: ${wat}, ${v.gasten} gasten, ${v.plaats}.`,
      `Haast? Bel ons op ${telefoon}.`,
      "Groet,\nPeer en het team van de Jachtbus",
    ],
  });
}
