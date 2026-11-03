"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, isoNaarDag, nederlandseDatum } from "@/lib/datum";
import { type FormStatus, leesId } from "@/lib/formulier";
import { keuringVelden } from "@/lib/velddefs";
import { leesVelden } from "@/lib/velden";

const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export async function bewaarKeuring(id: number | null, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { data, velden } = leesVelden(formData, keuringVelden);
  const bestand = formData.get("bestand");
  const heeftBestand = bestand instanceof File && bestand.size > 0;
  if (heeftBestand && !DOC_TYPES.includes(bestand.type)) velden.bestand = "Kies een PDF of foto.";
  if (heeftBestand && bestand.size > 10 * 1024 * 1024) velden.bestand = "Het bestand is groter dan 10 MB.";
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  if (heeftBestand) {
    const doc = await payload.create({
      collection: "bijlagen",
      data: {},
      file: { data: Buffer.from(await bestand.arrayBuffer()), mimetype: bestand.type, name: bestand.name, size: bestand.size },
      user,
      overrideAccess: false,
    });
    data.document = doc.id;
  }
  if (id) {
    await payload.update({ collection: "keuringen", id, data: data as never, user, overrideAccess: false });
    revalidatePath("/", "layout");
    return { goed: "Opgeslagen." };
  }
  const doc = await payload.create({ collection: "keuringen", data: data as never, user, overrideAccess: false });
  revalidatePath("/", "layout");
  return { naar: `/bus/keuringen/${doc.id}` };
}

/** "Done": remembers today and moves the deadline on by the interval, counted from today. */
export async function keuringGedaan(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  const k = await payload.findByID({ collection: "keuringen", id, depth: 0, user, overrideAccess: false });
  const vandaag = nederlandseDatum();
  if (!k.intervalMaanden) {
    await payload.update({ collection: "keuringen", id, data: { laatsteKeer: dagNaarIso(vandaag) }, user, overrideAccess: false });
    revalidatePath("/", "layout");
    redirect(`/bus/keuringen/${id}?gedaan=geen-interval`);
  }
  const d = new Date(`${vandaag}T12:00:00Z`);
  const dag = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + k.intervalMaanden);
  // 31 Jan + 1 month rolls into March: stay on the last day of the target month.
  if (d.getUTCDate() !== dag) d.setUTCDate(0);
  const volgende = isoNaarDag(d.toISOString());
  await payload.update({ collection: "keuringen", id, data: { laatsteKeer: dagNaarIso(vandaag), vervalt: dagNaarIso(volgende) }, user, overrideAccess: false });
  revalidatePath("/", "layout");
}

export async function verwijderKeuring(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "keuringen", id, user, overrideAccess: false });
  revalidatePath("/", "layout");
  redirect("/bus/keuringen");
}
