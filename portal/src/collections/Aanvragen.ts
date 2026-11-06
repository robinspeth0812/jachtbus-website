import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { aanvraagFasen, gelegenheden, momentenOpties } from "../lib/opties";
import { koppelKlant, ruimTakenOp, volgAanvraagOp } from "../lib/opvolging";
import { herbouwSiteBijBoeking, herbouwSiteNaVerwijderen } from "../lib/siteBuild";

/**
 * Requests for a job. The public form posts to /api/aanvraag (lib/aanvraagEndpoint.ts),
 * which validates and stores them; the REST route of this collection is login only.
 */
export const Aanvragen: CollectionConfig = {
  slug: "aanvragen",
  labels: { singular: "Aanvraag", plural: "Aanvragen" },
  admin: { useAsTitle: "naam", defaultColumns: ["naam", "gelegenheid", "datum", "fase"] },
  defaultSort: "-createdAt",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  hooks: { beforeChange: [koppelKlant], afterChange: [volgAanvraagOp, herbouwSiteBijBoeking], afterDelete: [ruimTakenOp, herbouwSiteNaVerwijderen] },
  fields: [
    { name: "gelegenheid", type: "select", required: true, options: [...gelegenheden] },
    { name: "gelegenheidOverig", type: "text", maxLength: 120 },
    { name: "datum", type: "date", index: true },
    { name: "tijd", type: "text", maxLength: 40 },
    { name: "momenten", type: "select", hasMany: true, options: [...momentenOpties] },
    { name: "plaats", type: "text", maxLength: 120 },
    { name: "gasten", type: "number", min: 1, max: 5000 },
    { name: "locatie", type: "text", maxLength: 300 },
    { name: "naam", type: "text", required: true, maxLength: 100 },
    { name: "bedrijf", type: "text", maxLength: 120 },
    { name: "email", type: "email", required: true },
    { name: "telefoon", type: "text", maxLength: 20 },
    { name: "opmerking", type: "textarea", maxLength: 3000 },
    { name: "fase", type: "select", required: true, defaultValue: "nieuw", index: true, options: [...aanvraagFasen] },
    { name: "notities", type: "textarea", maxLength: 4000 },
    { name: "bron", type: "select", defaultValue: "site", options: [{ label: "Formulier op de site", value: "site" }, { label: "Zelf ingevoerd", value: "handmatig" }] },
    { name: "klant", type: "relationship", relationTo: "klanten", index: true },
    { name: "klus", type: "relationship", relationTo: "klussen" },
  ],
};
