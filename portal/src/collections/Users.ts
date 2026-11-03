import type { CollectionConfig } from "payload";
import { beheerder, beheerderVeld, heeftRol } from "../access";
import { gebruikerRollen } from "../lib/opties";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Gebruiker", plural: "Gebruikers" },
  auth: {
    tokenExpiration: 60 * 60 * 12,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: "Lax", secure: process.env.NODE_ENV === "production" },
  },
  admin: { useAsTitle: "naam", defaultColumns: ["naam", "email", "rol"] },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      if (heeftRol(req.user, "superadmin", "eigenaar")) return true;
      return { id: { equals: req.user.id } };
    },
    create: beheerder,
    update: ({ req }) => {
      if (!req.user) return false;
      if (heeftRol(req.user, "superadmin", "eigenaar")) return true;
      return { id: { equals: req.user.id } };
    },
    delete: beheerder,
    admin: ({ req }) => heeftRol(req.user, "superadmin"),
  },
  fields: [
    { name: "naam", type: "text", required: true, maxLength: 80 },
    {
      name: "rol",
      type: "select",
      required: true,
      defaultValue: "medewerker",
      saveToJWT: true,
      access: { update: beheerderVeld },
      options: [...gebruikerRollen],
    },
  ],
};
