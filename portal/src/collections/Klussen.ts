import type { CollectionConfig } from "payload";
import { ingelogd } from "../access";
import { klusStatussen } from "../lib/opties";
import { ruimKlusTakenOp, volgKlusOp } from "../lib/opvolging";

/** A booking: everything needed to do the job, from planning to after-job notes. */
export const Klussen: CollectionConfig = {
  slug: "klussen",
  labels: { singular: "Klus", plural: "Klussen" },
  admin: { useAsTitle: "titel", defaultColumns: ["titel", "datum", "status"] },
  defaultSort: "datum",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: ingelogd },
  hooks: { afterChange: [volgKlusOp], afterDelete: [ruimKlusTakenOp] },
  fields: [
    { name: "titel", type: "text", required: true, maxLength: 140 },
    { name: "status", type: "select", required: true, defaultValue: "optie", index: true, options: [...klusStatussen] },
    { name: "datum", type: "date", required: true, index: true },
    { name: "aankomst", type: "text", maxLength: 5 },
    { name: "opbouw", type: "text", maxLength: 5 },
    { name: "serveren", type: "text", maxLength: 5 },
    { name: "klaar", type: "text", maxLength: 5 },
    { name: "klant", type: "relationship", relationTo: "klanten", index: true },
    { name: "aanvraag", type: "relationship", relationTo: "aanvragen" },
    { name: "plaats", type: "text", maxLength: 80 },
    { name: "adres", type: "text", maxLength: 200 },
    { name: "kilometers", type: "number", min: 0 },
    { name: "gasten", type: "number", min: 1, max: 5000 },
    { name: "arrangement", type: "relationship", relationTo: "arrangementen" },
    { name: "dieetwensen", type: "textarea", maxLength: 2000 },
    { name: "crew", type: "relationship", relationTo: "team", hasMany: true },
    { name: "notities", type: "textarea", maxLength: 4000 },
    { name: "chkRuimte", type: "checkbox", defaultValue: false },
    { name: "chkOndergrond", type: "checkbox", defaultValue: false },
    { name: "chkToegang", type: "checkbox", defaultValue: false },
    { name: "chkStroom", type: "checkbox", defaultValue: false },
    { name: "chkWeerplan", type: "checkbox", defaultValue: false },
    { name: "weerplan", type: "textarea", maxLength: 1000 },
    { name: "locatieNotitie", type: "textarea", maxLength: 2000 },
    {
      name: "draaiboek",
      type: "array",
      fields: [
        { name: "tijd", type: "text", maxLength: 5 },
        { name: "wat", type: "text", required: true, maxLength: 200 },
        { name: "wie", type: "text", maxLength: 80 },
      ],
    },
    {
      name: "boodschappen",
      type: "array",
      fields: [
        { name: "naam", type: "text", required: true, maxLength: 120 },
        { name: "hoeveelheid", type: "number" },
        { name: "eenheid", type: "text", maxLength: 20 },
        { name: "gedaan", type: "checkbox", defaultValue: false },
        { name: "uitArrangement", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "hoeGingHet", type: "textarea", maxLength: 4000 },
    { name: "fotos", type: "upload", relationTo: "media", hasMany: true },
    { name: "reviewGevraagd", type: "checkbox", defaultValue: false },
    { name: "factuurVerstuurd", type: "checkbox", defaultValue: false },
  ],
};
