"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId, tekst } from "@/lib/formulier";
import { aanvraagFasen, type AanvraagFase, gelegenheden, labelVan } from "@/lib/opties";
import { aanvraagHandmatigVelden } from "@/lib/velddefs";
import { leesVelden } from "@/lib/velden";

export async function zetFase(id: number, fase: AanvraagFase) {
  const user = await vereisGebruiker();
  if (!aanvraagFasen.some((f) => f.value === fase)) return;
  const payload = await payloadClient();
  await payload.update({ collection: "aanvragen", id, data: { fase }, user, overrideAccess: false });
  revalidatePath("/", "layout");
}

export async function maakAanvraag(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { data, velden } = leesVelden(formData, aanvraagHandmatigVelden);
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  const doc = await payload.create({
    collection: "aanvragen",
    data: { ...data, bron: "handmatig", fase: "nieuw" } as never,
    user,
    overrideAccess: false,
  });
  revalidatePath("/", "layout");
  return { naar: `/aanvragen/${doc.id}` };
}

export async function bewaarNotities(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return { fout: "Deze aanvraag bestaat niet meer." };
  const payload = await payloadClient();
  await payload.update({ collection: "aanvragen", id, data: { notities: tekst(formData, "notities", 4000) }, user, overrideAccess: false });
  revalidatePath(`/aanvragen/${id}`);
  return { goed: "Notitie bewaard." };
}

export async function verwijderAanvraag(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "aanvragen", id, user, overrideAccess: false });
  revalidatePath("/", "layout");
  redirect("/aanvragen");
}

/** Turns a request into a job, with everything already known filled in. */
export async function maakKlus(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  const a = await payload.findByID({ collection: "aanvragen", id, depth: 0, user, overrideAccess: false });
  if (a.klus) redirect(`/klussen/${typeof a.klus === "object" ? a.klus.id : a.klus}`);
  if (!a.datum) redirect(`/aanvragen/${id}?fout=datum`);
  const soort = a.gelegenheid === "overige" && a.gelegenheidOverig ? a.gelegenheidOverig : labelVan(gelegenheden, a.gelegenheid);
  const klus = await payload.create({
    collection: "klussen",
    data: {
      titel: `${soort} ${a.naam}${a.plaats ? ` in ${a.plaats}` : ""}`.slice(0, 140),
      status: "bevestigd",
      datum: a.datum,
      serveren: a.tijd || undefined,
      klant: typeof a.klant === "object" ? a.klant?.id : a.klant,
      aanvraag: a.id,
      plaats: a.plaats ?? undefined,
      adres: a.locatie ?? undefined,
      gasten: a.gasten ?? undefined,
      notities: a.opmerking ?? undefined,
    },
    user,
    overrideAccess: false,
  });
  await payload.update({ collection: "aanvragen", id, data: { klus: klus.id, fase: "bevestigd" }, user, overrideAccess: false });
  revalidatePath("/", "layout");
  redirect(`/klussen/${klus.id}`);
}
