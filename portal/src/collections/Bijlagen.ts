import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";

/** Private files for tickets and inspections. Payload also checks `read` on the file itself. */
export const Bijlagen: CollectionConfig = {
  slug: "bijlagen",
  labels: { singular: "Bijlage", plural: "Bijlagen" },
  access: { read: ingelogd, create: ingelogd, update: ingelogd, delete: ingelogd },
  upload: {
    staticDir: "bijlagen",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],
  },
  fields: [],
};
