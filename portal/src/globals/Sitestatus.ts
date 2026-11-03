import type { GlobalConfig } from "payload";
import { ingelogd } from "../access";

/** When the website content last changed and when a build last started. Written by lib/siteBuild.ts only. */
export const Sitestatus: GlobalConfig = {
  slug: "sitestatus",
  label: "Sitestatus",
  access: { read: ingelogd, update: ingelogd },
  fields: [
    { name: "laatsteWijziging", type: "date" },
    { name: "laatsteBuild", type: "date" },
    { name: "laatsteFout", type: "date" },
  ],
};
