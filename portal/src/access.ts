import type { Access, FieldAccess, Where } from "payload";

export type Rol = "superadmin" | "eigenaar" | "medewerker";

type MetRol = { rol?: Rol | null } | null | undefined;

export const heeftRol = (user: MetRol, ...rollen: Rol[]): boolean => Boolean(user?.rol && rollen.includes(user.rol));

export const ingelogd: Access = ({ req }) => Boolean(req.user);

export const beheerder: Access = ({ req }) => heeftRol(req.user as MetRol, "superadmin", "eigenaar");

export const ingelogdVeld: FieldAccess = ({ req }) => Boolean(req.user);

export const beheerderVeld: FieldAccess = ({ req }) => heeftRol(req.user as MetRol, "superadmin", "eigenaar");

/**
 * Public may only fetch photos without recognisable people or with their
 * consent. Payload applies this to the file itself too.
 */
export const fotoLeesbaar: Access = ({ req }) => {
  if (req.user) return true;
  const openbaar: Where = { personen: { in: ["geen", "toestemming"] } };
  return openbaar;
};
