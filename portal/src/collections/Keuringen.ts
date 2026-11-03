import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { keuringTaakHook, ruimKeuringTakenOp } from "../lib/keuring";
import { keuringSoorten } from "../lib/opties";

/** Inspections and upkeep of the bus, each with a due date and an automatic task. */
export const Keuringen: CollectionConfig = {
  slug: "keuringen",
  labels: { singular: "Keuring", plural: "Keuringen" },
  admin: { useAsTitle: "naam", defaultColumns: ["naam", "soort", "vervalt"] },
  defaultSort: "vervalt",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  hooks: { afterChange: [keuringTaakHook], afterDelete: [ruimKeuringTakenOp] },
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 120 },
    { name: "soort", type: "select", required: true, options: [...keuringSoorten] },
    { name: "vervalt", type: "date", required: true, index: true },
    { name: "laatsteKeer", type: "date" },
    { name: "intervalMaanden", type: "number", min: 1 },
    { name: "herinnerDagen", type: "number", min: 1, defaultValue: 30 },
    { name: "uitvoerder", type: "text", maxLength: 120 },
    { name: "notitie", type: "textarea", maxLength: 2000 },
    { name: "document", type: "upload", relationTo: "bijlagen" },
  ],
};
