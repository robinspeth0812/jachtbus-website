import type { CollectionConfig } from "payload";
import { beheerder, ingelogd } from "../access";
import { ticketSoorten, ticketStatussen } from "../lib/opties";

/** Requests from the team to the web builder. Conversation lives in `berichten`. */
export const Tickets: CollectionConfig = {
  slug: "tickets",
  labels: { singular: "Ticket", plural: "Tickets" },
  admin: { useAsTitle: "titel", defaultColumns: ["titel", "status", "melder", "updatedAt"] },
  defaultSort: "-updatedAt",
  access: { create: ingelogd, read: ingelogd, update: ingelogd, delete: beheerder },
  fields: [
    { name: "titel", type: "text", required: true, maxLength: 140 },
    { name: "soort", type: "select", required: true, defaultValue: "website", options: [...ticketSoorten] },
    { name: "omschrijving", type: "textarea", required: true, maxLength: 5000 },
    { name: "pagina", type: "text", maxLength: 500 },
    { name: "nodigOp", type: "date" },
    { name: "status", type: "select", required: true, defaultValue: "nieuw", index: true, options: [...ticketStatussen] },
    { name: "melder", type: "relationship", relationTo: "users", index: true },
    { name: "bijlagen", type: "upload", relationTo: "bijlagen", hasMany: true },
    {
      name: "berichten",
      type: "array",
      fields: [
        { name: "door", type: "relationship", relationTo: "users" },
        { name: "tekst", type: "textarea", required: true, maxLength: 5000 },
        { name: "op", type: "date", required: true },
        { name: "statusNaar", type: "select", options: [...ticketStatussen] },
      ],
    },
  ],
};
