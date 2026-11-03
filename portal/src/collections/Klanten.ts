import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";

/** Light CRM. Filled from requests by mail address, or by hand. Deleting goes through the AVG action. */
export const Klanten: CollectionConfig = {
  slug: "klanten",
  labels: { singular: "Klant", plural: "Klanten" },
  admin: { useAsTitle: "naam", defaultColumns: ["naam", "email", "telefoon", "plaats"] },
  defaultSort: "naam",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 100 },
    { name: "bedrijf", type: "text", maxLength: 120 },
    { name: "email", type: "email", index: true },
    { name: "telefoon", type: "text", maxLength: 20 },
    { name: "adres", type: "text", maxLength: 160 },
    { name: "plaats", type: "text", maxLength: 80 },
    { name: "notities", type: "textarea", maxLength: 4000 },
  ],
};
