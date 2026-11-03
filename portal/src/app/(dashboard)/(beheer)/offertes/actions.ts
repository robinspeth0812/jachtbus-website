"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { dagNaarIso, nederlandseDatum } from "@/lib/datum";
import { type FormStatus, leesId } from "@/lib/formulier";
import { btwTarieven, offerteStatussen, type OfferteStatus } from "@/lib/opties";
import { offerteKopVelden } from "@/lib/velddefs";
import { type HerhaalDef, leesRegels, leesVelden } from "@/lib/velden";

const regelDef: HerhaalDef = {
  naam: "regels",
  label: "Regels",
  knop: "Regel toevoegen",
  kolommen: [
    { naam: "omschrijving", label: "Omschrijving", soort: "tekst", max: 240 },
    { naam: "aantal", label: "Aantal", soort: "getal", min: 0 },
    { naam: "prijs", label: "Prijs", soort: "getal", min: 0 },
    { naam: "btw", label: "Btw", soort: "keuze", opties: btwTarieven },
  ],
};

/** YYYY-NNN, counting per year. */
async function volgendNummer(payload: Awaited<ReturnType<typeof payloadClient>>) {
  const jaar = nederlandseDatum().slice(0, 4);
  const { docs } = await payload.find({ collection: "offertes", where: { nummer: { like: `${jaar}-` } }, sort: "-nummer", limit: 1, depth: 0, overrideAccess: true });
  const laatste = Number(docs[0]?.nummer?.split("-")[1] ?? 0);
  return `${jaar}-${String(laatste + 1).padStart(3, "0")}`;
}

export async function bewaarOfferte(id: number | null, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const { data, velden } = leesVelden(formData, offerteKopVelden);
  const { rijen, velden: regelFouten } = leesRegels(formData, regelDef);
  const fouten = { ...velden, ...regelFouten };
  if (Object.keys(fouten).length) return { velden: fouten };
  if (rijen.length === 0) return { fout: "Zet minstens één regel op de offerte." };
  const payload = await payloadClient();
  const aanvraag = Number(formData.get("aanvraag"));
  if (id) {
    await payload.update({ collection: "offertes", id, data: { ...data, regels: rijen } as never, user, overrideAccess: false });
    revalidatePath(`/offertes/${id}`);
    return { goed: "Offerte opgeslagen." };
  }
  const doc = await payload.create({
    collection: "offertes",
    data: { ...data, regels: rijen, nummer: await volgendNummer(payload), status: "concept", aanvraag: aanvraag > 0 ? aanvraag : undefined } as never,
    user,
    overrideAccess: false,
  });
  revalidatePath("/offertes");
  return { naar: `/offertes/${doc.id}` };
}

/** Sent moves the request to "Offerte uit"; accepted moves it to "Bevestigd". */
export async function zetOfferteStatus(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  const status = String(formData.get("status")) as OfferteStatus;
  if (!id || !offerteStatussen.some((s) => s.value === status)) return;
  const payload = await payloadClient();
  const o = await payload.update({
    collection: "offertes",
    id,
    data: { status, ...(status === "verstuurd" ? { verstuurdOp: dagNaarIso(nederlandseDatum()) } : {}) },
    depth: 0,
    user,
    overrideAccess: false,
  });
  const aanvraag = typeof o.aanvraag === "object" ? o.aanvraag?.id : o.aanvraag;
  const fase = status === "verstuurd" ? "offerte" : status === "geaccepteerd" ? "bevestigd" : null;
  if (aanvraag && fase) await payload.update({ collection: "aanvragen", id: aanvraag, data: { fase }, user, overrideAccess: false });
  revalidatePath("/", "layout");
}

export async function verwijderOfferte(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "offertes", id, user, overrideAccess: false });
  revalidatePath("/offertes");
  redirect("/offertes");
}
