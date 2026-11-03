import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { taakSoorten } from "../lib/opties";

/**
 * Internal task list. The system creates tasks from requests, finished jobs and
 * inspection deadlines; people add their own. Overdue tasks go out once by mail
 * (jobs/herinneringen.ts).
 */
export const Taken: CollectionConfig = {
  slug: "taken",
  labels: { singular: "Taak", plural: "Taken" },
  admin: { useAsTitle: "titel", defaultColumns: ["titel", "vervalt", "klaar"] },
  defaultSort: "vervalt",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  fields: [
    { name: "titel", type: "text", required: true, maxLength: 200 },
    { name: "omschrijving", type: "textarea", maxLength: 2000 },
    { name: "voor", type: "relationship", relationTo: "users", index: true },
    { name: "door", type: "relationship", relationTo: "users" },
    { name: "vervalt", type: "date", required: true, index: true },
    { name: "aanvraag", type: "relationship", relationTo: "aanvragen", index: true },
    { name: "klus", type: "relationship", relationTo: "klussen", index: true },
    { name: "keuring", type: "relationship", relationTo: "keuringen", index: true },
    { name: "soort", type: "select", required: true, defaultValue: "eigen", options: [...taakSoorten] },
    { name: "klaar", type: "checkbox", defaultValue: false, index: true },
    { name: "klaarOp", type: "date" },
    { name: "gemaild", type: "checkbox", defaultValue: false },
  ],
};
