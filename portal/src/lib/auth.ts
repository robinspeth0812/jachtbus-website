import "server-only";
import config from "@payload-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { cache } from "react";
import { heeftRol } from "@/access";
import type { User } from "@/payload-types";

export const payloadClient = () => getPayload({ config });

/** Once per request, even when layout and page both ask. */
export const huidigeGebruiker = cache(async (): Promise<User | null> => {
  // headers() first: Next then knows this is per request and prerenders nothing.
  const h = await headers();
  const payload = await payloadClient();
  // Opening a page from an outside link (mail, bookmark) counts as cross-site and
  // Payload would ignore the cookie. A GET navigation changes nothing, so it is
  // treated as same-origin. Forms (POST) always have Origin and stay protected.
  const navigatie = h.get("sec-fetch-mode") === "navigate" && !h.get("origin");
  const authHeaders = navigatie ? new Headers(h) : h;
  if (navigatie) authHeaders.set("sec-fetch-site", "same-origin");
  const { user } = await payload.auth({ headers: authHeaders });
  return (user as User | null) ?? null;
});

/** For pages and server actions: without a session back to login. */
export async function vereisGebruiker(): Promise<User> {
  const user = await huidigeGebruiker();
  if (!user) redirect("/inloggen");
  return user;
}

/** Owner or web builder only: prices, website content and settings. */
export async function vereisBeheerder(): Promise<User> {
  const user = await vereisGebruiker();
  if (!heeftRol(user, "superadmin", "eigenaar")) redirect("/");
  return user;
}
