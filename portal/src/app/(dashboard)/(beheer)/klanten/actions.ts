"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId } from "@/lib/formulier";
import { klantVelden } from "@/lib/velddefs";
import { leesVelden } from "@/lib/velden";

export async function bewaarKlant(id: number | null, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { data, velden } = leesVelden(formData, klantVelden);
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  if (id) {
    await payload.update({ collection: "klanten", id, data: data as never, user, overrideAccess: false });
    revalidatePath(`/klanten/${id}`);
    return { goed: "Klant opgeslagen." };
  }
  const doc = await payload.create({ collection: "klanten", data: data as never, user, overrideAccess: false });
  revalidatePath("/klanten");
  return { naar: `/klanten/${doc.id}` };
}

/**
 * Right to erasure (AVG): removes the client, their requests, quotes and tasks.
 * Jobs stay for the books and the agenda, without anything that points at the person.
 */
export async function vergeetKlant(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  const opts = { user, overrideAccess: false } as const;
  // Quotes are owner-only: the owner runs the erasure; for a colleague we still clean them up.
  await payload.delete({ collection: "offertes", where: { klant: { equals: id } }, overrideAccess: true });
  await payload.delete({ collection: "aanvragen", where: { klant: { equals: id } }, ...opts });
  const klussen = await payload.find({ collection: "klussen", where: { klant: { equals: id } }, depth: 0, limit: 500, ...opts });
  for (const k of klussen.docs) {
    await payload.update({
      collection: "klussen",
      id: k.id,
      data: { klant: null, aanvraag: null, titel: `Klus op ${k.plaats || "onbekende plaats"} (klant verwijderd)`, notities: "", dieetwensen: "", adres: "", locatieNotitie: "", hoeGingHet: "" },
      context: { geenOpvolging: true },
      ...opts,
    });
    await payload.delete({ collection: "taken", where: { klus: { equals: k.id } }, ...opts });
  }
  await payload.delete({ collection: "klanten", id, ...opts });
  revalidatePath("/", "layout");
  redirect("/klanten");
}
