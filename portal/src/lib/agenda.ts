import type { Where } from "payload";
import { dagNaarIso, isoNaarDag } from "./datum";
import { bezetteStatussen, type KlusStatus } from "./opties";

type KlusDag = { datum: string; status: KlusStatus };

/** Days with two or more jobs claiming the bus. */
export function conflictDagen(klussen: readonly KlusDag[]): Set<string> {
  const teller = new Map<string, number>();
  for (const k of klussen) {
    if (!bezetteStatussen.includes(k.status)) continue;
    const dag = isoNaarDag(k.datum);
    teller.set(dag, (teller.get(dag) ?? 0) + 1);
  }
  return new Set([...teller].filter(([, n]) => n > 1).map(([d]) => d));
}

/** Where-clause for jobs claiming the bus on one day. */
export const bezetOpDag = (dag: string): Where => ({
  and: [{ datum: { equals: dagNaarIso(dag) } }, { status: { in: bezetteStatussen } }],
});
