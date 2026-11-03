import "server-only";
import type { Payload } from "payload";
import type { Keuze } from "./velden";
import type { User } from "@/payload-types";

/** Select options for relation and photo fields. Only load what a form needs. */
export async function laadKeuzes(payload: Payload, user: User, welke: ("klanten" | "arrangementen" | "team" | "media")[]) {
  const toegang = { user, overrideAccess: false, depth: 0, pagination: false } as const;
  const uit: Record<string, Keuze[]> = {};
  await Promise.all(
    welke.map(async (w) => {
      if (w === "klanten") {
        const { docs } = await payload.find({ collection: "klanten", sort: "naam", limit: 500, ...toegang });
        uit.klanten = docs.map((k) => ({ value: String(k.id), label: k.bedrijf ? `${k.naam} (${k.bedrijf})` : k.naam }));
      } else if (w === "arrangementen") {
        const { docs } = await payload.find({ collection: "arrangementen", sort: "volgorde", limit: 100, ...toegang });
        uit.arrangementen = docs.map((a) => ({ value: String(a.id), label: a.titel }));
      } else if (w === "team") {
        const { docs } = await payload.find({ collection: "team", where: { actief: { equals: true } }, sort: "naam", limit: 100, ...toegang });
        uit.team = docs.map((t) => ({ value: String(t.id), label: t.naam }));
      } else {
        const { docs } = await payload.find({ collection: "media", sort: "-createdAt", limit: 200, ...toegang });
        uit.media = docs.map((m) => ({ value: String(m.id), label: m.alt, url: m.sizes?.klein?.url ?? m.url }));
      }
    }),
  );
  return uit;
}
