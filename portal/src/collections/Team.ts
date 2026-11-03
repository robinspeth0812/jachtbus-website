import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { teamRollen, weekdagen } from "../lib/opties";

/** Crew that can be assigned to jobs. Not the same as logins: see Users. */
export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Teamlid", plural: "Team" },
  admin: { useAsTitle: "naam", defaultColumns: ["naam", "rol", "telefoon"] },
  defaultSort: "naam",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 100 },
    { name: "rol", type: "select", required: true, defaultValue: "hulp", options: [...teamRollen] },
    { name: "telefoon", type: "text", maxLength: 20 },
    { name: "email", type: "email" },
    { name: "werkdagen", type: "select", hasMany: true, options: [...weekdagen] },
    {
      name: "nietBeschikbaar",
      type: "array",
      fields: [
        { name: "dag", type: "date", required: true },
        { name: "reden", type: "text", maxLength: 120 },
      ],
    },
    { name: "notitie", type: "textarea", maxLength: 2000 },
    { name: "actief", type: "checkbox", defaultValue: true },
  ],
};
