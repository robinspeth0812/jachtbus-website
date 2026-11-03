import { huidigeGebruiker, payloadClient } from "@/lib/auth";
import { momentTekst, nederlandseDatum } from "@/lib/datum";
import { labelVan, meetSoorten } from "@/lib/opties";

/** Text cells that start with a formula character are defused, so Excel never runs them. */
const cel = (w: unknown) => {
  const s = String(w ?? "");
  const veilig = /^[=+@\t\r]/.test(s) ? `'${s}` : s;
  return `"${veilig.replace(/"/g, '""')}"`;
};
const regel = (cellen: unknown[]) => cellen.map(cel).join(";");

/** CSV for Dutch Excel: semicolons, decimal comma and a BOM for the accents. */
export async function GET() {
  const user = await huidigeGebruiker();
  if (!user) return new Response("Niet ingelogd", { status: 401 });
  const payload = await payloadClient();
  const toegang = { user, overrideAccess: false, depth: 1, sort: "-op", limit: 5000 } as const;
  const [metingen, rondes] = await Promise.all([payload.find({ collection: "metingen", ...toegang }), payload.find({ collection: "schoonmaakrondes", ...toegang })]);

  const naam = (d: unknown) => (typeof d === "object" && d ? (d as { naam?: string }).naam : "");
  const titel = (d: unknown) => (typeof d === "object" && d ? (d as { titel?: string }).titel : "");
  const rijen = [
    regel(["Soort", "Wanneer", "Wat", "Temperatuur (C)", "Binnen norm", "Actie of opmerking", "Door", "Klus"]),
    ...metingen.docs.map((m) =>
      regel(["Meting", momentTekst(m.op), labelVan(meetSoorten, m.soort), m.temperatuur.toLocaleString("nl-NL"), m.binnenNorm ? "ja" : "nee", m.actie, naam(m.door), titel(m.klus)]),
    ),
    ...rondes.docs.map((r) =>
      regel([
        "Schoonmaak",
        momentTekst(r.op),
        (r.punten ?? []).filter((p) => p.gedaan).map((p) => p.punt).join(", "),
        "",
        "",
        r.opmerking,
        naam(r.door),
        titel(r.klus),
      ]),
    ),
  ];
  return new Response(`﻿${rijen.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="voedselveiligheid-${nederlandseDatum()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
