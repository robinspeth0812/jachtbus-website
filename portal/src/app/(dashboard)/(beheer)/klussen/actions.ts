"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId } from "@/lib/formulier";
import { boodschapDef, draaiboekDef, klusLocatieVelden, klusNaAfloopVelden, klusPlanningVelden } from "@/lib/velddefs";
import { leesRegels, leesVelden, type VeldDef } from "@/lib/velden";

const tabVelden: Record<string, VeldDef[]> = { planning: klusPlanningVelden, locatie: klusLocatieVelden, naafloop: klusNaAfloopVelden };

export async function bewaarKlus(id: number | null, tab: string, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const defs = tabVelden[tab];
  if (!defs) return { fout: "Dit deel van de klus bestaat niet." };
  const { data, velden } = leesVelden(formData, defs);
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  if (!id) {
    const doc = await payload.create({ collection: "klussen", data: data as never, user, overrideAccess: false });
    revalidatePath("/", "layout");
    return { naar: `/klussen/${doc.id}` };
  }
  await payload.update({ collection: "klussen", id, data: data as never, user, overrideAccess: false });
  revalidatePath("/", "layout");
  return { goed: "Opgeslagen." };
}

export async function bewaarDraaiboek(id: number, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { rijen, velden } = leesRegels(formData, draaiboekDef);
  if (Object.keys(velden).length) return { velden };
  // Rows without a time keep their spot at the end.
  const opTijd = [...rijen].sort((a, b) => String(a.tijd || "99").localeCompare(String(b.tijd || "99")));
  const payload = await payloadClient();
  await payload.update({ collection: "klussen", id, data: { draaiboek: opTijd } as never, user, overrideAccess: false });
  revalidatePath(`/klussen/${id}`);
  return { goed: "Draaiboek opgeslagen." };
}

/** Ingredients per guest times guests. Keeps ticked rows and rows you added yourself. */
export async function maakBoodschappen(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  const k = await payload.findByID({ collection: "klussen", id, depth: 1, user, overrideAccess: false });
  const arr = typeof k.arrangement === "object" ? k.arrangement : null;
  if (!arr || !k.gasten) redirect(`/klussen/${id}?tab=boodschappen&fout=basis`);
  const houden = (k.boodschappen ?? []).filter((b) => !b.uitArrangement || b.gedaan);
  const nieuw = (arr.ingredienten ?? [])
    .filter((i) => !houden.some((b) => b.naam === i.naam))
    .map((i) => ({
      naam: i.naam,
      hoeveelheid: Math.ceil((i.perGast ?? 0) * k.gasten! * 100) / 100,
      eenheid: i.eenheid ?? "",
      gedaan: false,
      uitArrangement: true,
    }));
  await payload.update({
    collection: "klussen",
    id,
    data: { boodschappen: [...houden, ...nieuw] },
    user,
    overrideAccess: false,
  });
  revalidatePath(`/klussen/${id}`);
}

/** One tick on the phone. Returns nothing: the list updates optimistically. */
export async function zetBoodschap(klusId: number, regelId: string, gedaan: boolean) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const k = await payload.findByID({ collection: "klussen", id: klusId, depth: 0, user, overrideAccess: false });
  await payload.update({
    collection: "klussen",
    id: klusId,
    data: { boodschappen: (k.boodschappen ?? []).map((b) => (b.id === regelId ? { ...b, gedaan } : b)) },
    user,
    overrideAccess: false,
  });
  revalidatePath(`/klussen/${klusId}`);
}

export async function voegBoodschappenToe(id: number, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { rijen, velden } = leesRegels(formData, boodschapDef);
  if (Object.keys(velden).length) return { velden };
  if (rijen.length === 0) return { fout: "Vul minstens één regel in." };
  const payload = await payloadClient();
  const k = await payload.findByID({ collection: "klussen", id, depth: 0, user, overrideAccess: false });
  await payload.update({
    collection: "klussen",
    id,
    data: { boodschappen: [...(k.boodschappen ?? []), ...rijen.map((r) => ({ ...r, gedaan: false, uitArrangement: false }))] } as never,
    user,
    overrideAccess: false,
  });
  revalidatePath(`/klussen/${id}`);
  return { goed: "Toegevoegd aan de lijst." };
}

export async function haalBoodschapWeg(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  const regel = String(formData.get("regel") ?? "");
  if (!id) return;
  const payload = await payloadClient();
  const k = await payload.findByID({ collection: "klussen", id, depth: 0, user, overrideAccess: false });
  await payload.update({ collection: "klussen", id, data: { boodschappen: (k.boodschappen ?? []).filter((b) => b.id !== regel) }, user, overrideAccess: false });
  revalidatePath(`/klussen/${id}`);
}

export async function verwijderKlus(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "klussen", id, user, overrideAccess: false });
  revalidatePath("/", "layout");
  redirect("/klussen");
}
