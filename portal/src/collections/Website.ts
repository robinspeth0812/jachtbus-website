import type { CollectionConfig, Field } from "payload";
import { beheerder } from "../access";
import { faqPaginas, provincies, publicatieStatussen, referentieMogelijkheden, reviewBronnen, weekdagen } from "../lib/opties";
import { zoekKaartpunt } from "../lib/kaartpunt";
import { herbouwSite, herbouwSiteNaVerwijderen } from "../lib/siteBuild";

/**
 * Website content. Public reading only goes through GET /api/site-inhoud
 * (lib/siteInhoudEndpoint.ts), which picks published items and known fields.
 * The REST routes of these collections are login only, so internal fields
 * such as prices and ingredients can never leak.
 */
const toegang: CollectionConfig["access"] = {
  read: ({ req }) => Boolean(req.user),
  create: beheerder,
  update: beheerder,
  delete: beheerder,
};
const haken: CollectionConfig["hooks"] = { afterChange: [herbouwSite], afterDelete: [herbouwSiteNaVerwijderen] };
const status: Field = { name: "status", type: "select", required: true, defaultValue: "concept", index: true, options: [...publicatieStatussen] };

export const Arrangementen: CollectionConfig = {
  slug: "arrangementen",
  labels: { singular: "Arrangement", plural: "Arrangementen" },
  admin: { useAsTitle: "titel" },
  defaultSort: "volgorde",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, maxLength: 80 },
    { name: "titel", type: "text", required: true, maxLength: 120 },
    { name: "kort", type: "text", required: true, maxLength: 240 },
    { name: "tekst", type: "textarea", required: true, maxLength: 8000 },
    { name: "volgorde", type: "number", defaultValue: 0 },
    { name: "interneRichtprijs", type: "number", min: 0 },
    {
      name: "ingredienten",
      type: "array",
      fields: [
        { name: "naam", type: "text", required: true, maxLength: 120 },
        { name: "perGast", type: "number", min: 0 },
        { name: "eenheid", type: "text", maxLength: 20 },
      ],
    },
    status,
  ],
};

export const Referenties: CollectionConfig = {
  slug: "referenties",
  labels: { singular: "Referentie", plural: "Referenties" },
  admin: { useAsTitle: "titel" },
  defaultSort: "-datum",
  access: toegang,
  hooks: { ...haken, beforeChange: [zoekKaartpunt] },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, maxLength: 80 },
    { name: "titel", type: "text", required: true, maxLength: 140 },
    { name: "plaats", type: "text", required: true, maxLength: 80 },
    { name: "lat", type: "number" },
    { name: "lng", type: "number" },
    { name: "gelegenheid", type: "text", required: true, maxLength: 80 },
    { name: "mogelijkheden", type: "select", hasMany: true, options: [...referentieMogelijkheden] },
    { name: "gasten", type: "number", min: 1 },
    { name: "datum", type: "date" },
    { name: "verhaal", type: "textarea", required: true, maxLength: 8000 },
    { name: "foto", type: "upload", relationTo: "media" },
    { name: "extraFotos", type: "upload", relationTo: "media", hasMany: true },
    { name: "toestemming", type: "checkbox", defaultValue: false },
    status,
  ],
};

export const Reviews: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Review", plural: "Reviews" },
  admin: { useAsTitle: "naam" },
  defaultSort: "-createdAt",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 100 },
    { name: "gelegenheid", type: "text", maxLength: 80 },
    { name: "plaats", type: "text", maxLength: 80 },
    { name: "tekst", type: "textarea", required: true, maxLength: 2000 },
    { name: "foto", type: "upload", relationTo: "media" },
    { name: "referentie", type: "relationship", relationTo: "referenties", index: true },
    { name: "bron", type: "select", required: true, options: [...reviewBronnen] },
    { name: "bronUrl", type: "text", maxLength: 500 },
    { name: "bewijs", type: "text", maxLength: 240 },
    status,
  ],
};

export const Veelgesteld: CollectionConfig = {
  slug: "veelgesteld",
  labels: { singular: "Veelgestelde vraag", plural: "Veelgestelde vragen" },
  admin: { useAsTitle: "vraag" },
  defaultSort: "volgorde",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "vraag", type: "text", required: true, maxLength: 240 },
    { name: "antwoord", type: "textarea", required: true, maxLength: 4000 },
    { name: "pagina", type: "select", required: true, defaultValue: "algemeen", options: [...faqPaginas] },
    { name: "volgorde", type: "number", defaultValue: 0 },
    status,
  ],
};

export const Plaatsen: CollectionConfig = {
  slug: "plaatsen",
  labels: { singular: "Plaats", plural: "Plaatsen" },
  admin: { useAsTitle: "naam" },
  defaultSort: "naam",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 80 },
    { name: "provincie", type: "select", required: true, options: [...provincies] },
    status,
  ],
};

/** Public events where people can come and eat at the bus. Past ones drop off the site by themselves. */
export const Evenementen: CollectionConfig = {
  slug: "evenementen",
  labels: { singular: "Event", plural: "Events" },
  admin: { useAsTitle: "titel" },
  defaultSort: "datum",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "titel", type: "text", required: true, maxLength: 120 },
    { name: "datum", type: "date", required: true, index: true },
    { name: "totDatum", type: "date", index: true },
    { name: "vanTijd", type: "text", maxLength: 5 },
    { name: "totTijd", type: "text", maxLength: 5 },
    { name: "plaats", type: "text", required: true, maxLength: 80 },
    { name: "locatie", type: "text", maxLength: 160 },
    { name: "tekst", type: "textarea", maxLength: 1000 },
    { name: "linkTekst", type: "text", maxLength: 60 },
    { name: "linkUrl", type: "text", maxLength: 500 },
    { name: "foto", type: "upload", relationTo: "media" },
    status,
  ],
};

export const Mededelingen: CollectionConfig = {
  slug: "mededelingen",
  labels: { singular: "Mededeling", plural: "Mededelingen" },
  admin: { useAsTitle: "tekst" },
  defaultSort: "volgorde",
  access: toegang,
  hooks: haken,
  fields: [
    { name: "tekst", type: "text", required: true, maxLength: 140 },
    { name: "dagen", type: "select", hasMany: true, options: [...weekdagen] },
    { name: "vanTijd", type: "text", maxLength: 5 },
    { name: "totTijd", type: "text", maxLength: 5 },
    { name: "vanaf", type: "date" },
    { name: "tot", type: "date" },
    { name: "linkTekst", type: "text", maxLength: 60 },
    { name: "linkUrl", type: "text", maxLength: 500 },
    { name: "volgorde", type: "number", defaultValue: 100 },
    status,
  ],
};
