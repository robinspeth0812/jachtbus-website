import type { CollectionConfig } from "payload";
import { beheerder } from "../access";
import { btwTarieven, offerteStatussen } from "../lib/opties";

/** Internal quotes. Owners only: staff never see prices, and the public API never reads this. */
export const Offertes: CollectionConfig = {
  slug: "offertes",
  labels: { singular: "Offerte", plural: "Offertes" },
  admin: { useAsTitle: "titel", defaultColumns: ["nummer", "titel", "status", "geldigTot"] },
  defaultSort: "-createdAt",
  access: { create: beheerder, read: beheerder, update: beheerder, delete: beheerder },
  fields: [
    { name: "nummer", type: "text", required: true, maxLength: 20, index: true },
    { name: "titel", type: "text", required: true, maxLength: 140 },
    { name: "status", type: "select", required: true, defaultValue: "concept", index: true, options: [...offerteStatussen] },
    { name: "klant", type: "relationship", relationTo: "klanten", required: true, index: true },
    { name: "aanvraag", type: "relationship", relationTo: "aanvragen", index: true },
    { name: "klus", type: "relationship", relationTo: "klussen", index: true },
    { name: "geldigTot", type: "date", required: true },
    { name: "verstuurdOp", type: "date" },
    { name: "intro", type: "textarea", maxLength: 2000 },
    { name: "slot", type: "textarea", maxLength: 2000 },
    {
      name: "regels",
      type: "array",
      fields: [
        { name: "omschrijving", type: "text", required: true, maxLength: 240 },
        { name: "aantal", type: "number", required: true, defaultValue: 1 },
        { name: "prijs", type: "number", required: true, defaultValue: 0 },
        { name: "btw", type: "select", required: true, defaultValue: "9", options: [...btwTarieven] },
      ],
    },
  ],
};
