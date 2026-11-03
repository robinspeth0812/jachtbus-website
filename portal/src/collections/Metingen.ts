import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { meetSoorten } from "../lib/opties";

/** HACCP temperature log, kept as a record. */
export const Metingen: CollectionConfig = {
  slug: "metingen",
  labels: { singular: "Meting", plural: "Metingen" },
  admin: { useAsTitle: "soort", defaultColumns: ["op", "soort", "temperatuur"] },
  defaultSort: "-op",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  fields: [
    { name: "soort", type: "select", required: true, options: meetSoorten.map(({ value, label }) => ({ value, label })) },
    { name: "temperatuur", type: "number", required: true },
    { name: "binnenNorm", type: "checkbox", defaultValue: true },
    { name: "actie", type: "text", maxLength: 300 },
    { name: "op", type: "date", required: true, index: true },
    { name: "klus", type: "relationship", relationTo: "klussen" },
    { name: "door", type: "relationship", relationTo: "users" },
  ],
};
