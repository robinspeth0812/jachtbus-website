import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload, PayloadRequest } from "payload";
import { dagPlus, isoNaarDag, nederlandseDatum, nederlandseTijd } from "./datum";
import { keuringStand } from "./keuringStand";

type KeuringDoc = { id: number; naam: string; vervalt: string; herinnerDagen?: number | null };

/** Exactly one open task per item inside its reminder window; none outside it. */
export async function zorgVoorTaak(payload: Payload, k: KeuringDoc, req?: PayloadRequest) {
  const { stand } = keuringStand(k.vervalt, k.herinnerDagen ?? 30);
  const open = await payload.find({
    collection: "taken",
    where: { and: [{ keuring: { equals: k.id } }, { klaar: { equals: false } }] },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    req,
  });
  if (stand === "in-orde") {
    for (const t of open.docs) {
      await payload.update({ collection: "taken", id: t.id, data: { klaar: true, klaarOp: new Date().toISOString() }, overrideAccess: true, req });
    }
    return;
  }
  if (open.docs.length) return;
  // Due 09:00 a week before the deadline, or today when that has already passed.
  const vandaag = nederlandseDatum();
  const weekEerder = dagPlus(isoNaarDag(k.vervalt), -7);
  const dag = weekEerder > vandaag ? weekEerder : vandaag;
  await payload.create({
    collection: "taken",
    data: { titel: `Regel op tijd: ${k.naam}`, vervalt: nederlandseTijd(dag, "09:00").toISOString(), keuring: k.id, soort: "keuring" },
    overrideAccess: true,
    req,
  });
}

export const keuringTaakHook: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context.geenOpvolging) return doc;
  await zorgVoorTaak(req.payload, doc, req);
  return doc;
};

export const ruimKeuringTakenOp: CollectionAfterDeleteHook = async ({ id, req }) => {
  await req.payload.delete({ collection: "taken", where: { keuring: { equals: id } }, req });
};
