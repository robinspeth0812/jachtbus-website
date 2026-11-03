import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";

/** A cleaning round: which points were done, by whom, and when. */
export const Schoonmaakrondes: CollectionConfig = {
  slug: "schoonmaakrondes",
  labels: { singular: "Schoonmaakronde", plural: "Schoonmaakrondes" },
  defaultSort: "-op",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  fields: [
    { name: "op", type: "date", required: true, index: true },
    { name: "klus", type: "relationship", relationTo: "klussen" },
    { name: "door", type: "relationship", relationTo: "users" },
    { name: "opmerking", type: "text", maxLength: 300 },
    {
      name: "punten",
      type: "array",
      fields: [
        { name: "punt", type: "text", required: true, maxLength: 120 },
        { name: "gedaan", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
