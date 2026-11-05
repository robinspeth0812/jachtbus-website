import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from "payload";
import { nederlandseTijd } from "./datum";
import type { AanvraagFase, TaakSoort } from "./opties";

const UUR = 60 * 60 * 1000;
const DAG = 24 * UUR;

type Regel = { soort: TaakSoort; titel: (naam: string) => string; vervalt: (a: { datum?: string | null }) => Date | null };

/**
 * What must happen when a request enters a phase: one task per phase. When the
 * request moves on, the open task of the previous phase is closed.
 * "Geen match" gets nothing.
 */
export const opvolgRegels: Partial<Record<AanvraagFase, Regel>> = {
  nieuw: {
    soort: "reageren",
    titel: (naam) => `Reageer op de aanvraag van ${naam}`,
    vervalt: () => new Date(Date.now() + DAG),
  },
  contact: {
    soort: "offerte-sturen",
    titel: (naam) => `Stuur ${naam} een offerte`,
    vervalt: () => new Date(Date.now() + 2 * DAG),
  },
  offerte: {
    soort: "nabellen",
    titel: (naam) => `Bel ${naam} na over de offerte`,
    vervalt: () => new Date(Date.now() + 3 * DAG),
  },
  bevestigd: {
    soort: "afstemmen",
    titel: (naam) => `Laatste afstemming met ${naam}`,
    // A week before the date at 9:00. Already past: within the hour.
    vervalt: ({ datum }) => {
      if (!datum) return null;
      const weekEerder = new Date(new Date(datum).getTime() - 7 * DAG);
      const d = nederlandseTijd(weekEerder.toISOString().slice(0, 10), "09:00");
      return d.getTime() < Date.now() ? new Date(Date.now() + UUR) : d;
    },
  },
};

export const volgAanvraagOp: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req, context }) => {
  if (context.geenOpvolging) return doc;
  if (operation === "update" && previousDoc?.fase === doc.fase) return doc;

  const { payload } = req;
  if (operation === "update") {
    await payload.update({
      collection: "taken",
      where: { and: [{ aanvraag: { equals: doc.id } }, { klaar: { equals: false } }, { soort: { not_equals: "eigen" } }] },
      data: { klaar: true, klaarOp: new Date().toISOString() },
      req,
    });
  }

  const regel = opvolgRegels[doc.fase as AanvraagFase];
  const vervalt = regel?.vervalt(doc);
  if (regel && vervalt) {
    await payload.create({
      collection: "taken",
      data: { titel: regel.titel(doc.naam), vervalt: vervalt.toISOString(), aanvraag: doc.id, soort: regel.soort },
      req,
    });
  }
  return doc;
};

/** Gone with the request, gone with its tasks: no loose names left behind (AVG). */
export const ruimTakenOp: CollectionAfterDeleteHook = async ({ id, req }) => {
  await req.payload.delete({ collection: "taken", where: { aanvraag: { equals: id } }, req });
};

/** Light CRM: a request links to the client with the same mail address, or makes one. */
export const koppelKlant: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== "create" || data.klant || !data.email) return data;
  const email = String(data.email).toLowerCase();
  const { payload } = req;
  const { docs } = await payload.find({ collection: "klanten", where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true, req });
  const klant =
    docs[0] ??
    (await payload.create({
      collection: "klanten",
      data: { naam: data.naam, bedrijf: data.bedrijf || "", email, telefoon: data.telefoon || "", plaats: data.plaats || "" },
      overrideAccess: true,
      req,
    }));
  return { ...data, klant: klant.id };
};

/** A finished job leaves two follow-ups: ask for a review and send the invoice. */
export const volgKlusOp: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req, context }) => {
  if (context.geenOpvolging) return doc;
  if (doc.status !== "afgerond" || (operation === "update" && previousDoc?.status === "afgerond")) return doc;
  const morgen = new Date(Date.now() + DAG).toISOString();
  const { payload } = req;
  if (!doc.factuurVerstuurd) {
    await payload.create({ collection: "taken", data: { titel: `Stuur de factuur voor ${doc.titel}`, vervalt: morgen, klus: doc.id, soort: "factuur" }, req });
  }
  if (!doc.reviewGevraagd) {
    await payload.create({ collection: "taken", data: { titel: `Vraag om een review na ${doc.titel}`, vervalt: morgen, klus: doc.id, soort: "review" }, req });
  }
  return doc;
};

export const ruimKlusTakenOp: CollectionAfterDeleteHook = async ({ id, req }) => {
  await req.payload.delete({ collection: "taken", where: { klus: { equals: id } }, req });
};
