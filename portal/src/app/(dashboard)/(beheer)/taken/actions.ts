"use server";

import { revalidatePath } from "next/cache";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, isoNaarDag } from "@/lib/datum";
import { type FormStatus, leesId, tekst } from "@/lib/formulier";

export async function maakTaak(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const titel = tekst(formData, "titel", 200);
  const dag = tekst(formData, "vervalt", 10);
  const velden: Record<string, string> = {};
  if (!titel) velden.titel = "Vul in wat er moet gebeuren.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dag)) velden.vervalt = "Kies een datum.";
  if (Object.keys(velden).length) return { velden };
  const voorId = Number(formData.get("voor"));
  const payload = await payloadClient();
  await payload.create({
    collection: "taken",
    data: {
      titel,
      omschrijving: tekst(formData, "omschrijving", 2000),
      vervalt: dagNaarIso(isoNaarDag(dag)),
      voor: Number.isInteger(voorId) && voorId > 0 ? voorId : undefined,
      soort: "eigen",
    },
    user,
    overrideAccess: false,
  });
  revalidatePath("/taken");
  return { goed: "Taak staat op de lijst." };
}

export async function zetTaakKlaar(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const klaar = formData.get("klaar") === "1";
  const payload = await payloadClient();
  await payload.update({
    collection: "taken",
    id,
    data: { klaar, klaarOp: klaar ? new Date().toISOString() : null, door: klaar ? user.id : null },
    user,
    overrideAccess: false,
  });
  revalidatePath("/", "layout");
}

export async function verwijderTaak(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "taken", id, user, overrideAccess: false });
  revalidatePath("/", "layout");
}
