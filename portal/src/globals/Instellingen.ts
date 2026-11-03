import type { Field, GlobalConfig } from "payload";
import { beheerder, ingelogd } from "../access";
import { herbouwSiteGlobal } from "../lib/siteBuild";

/** Set once: contact details, social profiles, who gets which mail. Public data leaves via /api/site-inhoud only. */
export const Instellingen: GlobalConfig = {
  slug: "instellingen",
  label: "Instellingen",
  access: { read: ingelogd, update: beheerder },
  hooks: { afterChange: [herbouwSiteGlobal] },
  fields: [
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "telefoon", type: "text", maxLength: 20 },
        { name: "whatsapp", type: "text", maxLength: 20 },
        { name: "email", type: "email" },
      ],
    },
    {
      name: "profielen",
      type: "group",
      fields: [
        { name: "instagram", type: "text", maxLength: 500 },
        { name: "facebook", type: "text", maxLength: 500 },
        { name: "google", type: "text", maxLength: 500 },
      ],
    },
    {
      name: "mail",
      type: "group",
      fields: (["aanvraag", "herinnering"] as const).map(
        (naam): Field => ({
          name: naam,
          type: "group",
          fields: [
            { name: "aan", type: "relationship", relationTo: "users", hasMany: true },
            { name: "extra", type: "email" },
          ],
        }),
      ),
    },
  ],
};
