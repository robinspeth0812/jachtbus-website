import type { CollectionConfig } from "payload";
import { fotoLeesbaar, ingelogd } from "../access";
import { fotoLicenties, fotoPersonen } from "../lib/opties";
import { herbouwSite } from "../lib/siteBuild";

/**
 * Photo library. Keeps who made a photo, under which agreement it may be used,
 * and whether recognisable people are on it (portrait rights). Photos without
 * consent cannot be fetched from outside the portal.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Foto", plural: "Foto's" },
  access: { read: fotoLeesbaar, create: ingelogd, update: ingelogd, delete: ingelogd },
  hooks: { afterChange: [herbouwSite] },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes: [
      { name: "klein", width: 480 },
      { name: "groot", width: 1920 },
    ],
  },
  fields: [
    { name: "alt", label: "Wat is er te zien?", type: "text", required: true, maxLength: 200 },
    { name: "maker", type: "text", maxLength: 120 },
    { name: "licentie", type: "select", options: [...fotoLicenties] },
    { name: "bronUrl", type: "text", maxLength: 500 },
    { name: "personen", type: "select", options: [...fotoPersonen] },
  ],
};
