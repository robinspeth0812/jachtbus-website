"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { type FormStatus, leesId } from "@/lib/formulier";
import { fotoVelden } from "@/lib/velddefs";
import { leesVelden } from "@/lib/velden";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadFoto(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const { data, velden } = leesVelden(formData, fotoVelden);
  const bestand = formData.get("foto");
  if (!(bestand instanceof File) || bestand.size === 0) velden.foto = "Kies een foto.";
  else if (!TYPES.includes(bestand.type)) velden.foto = "Kies een JPG, PNG, WebP of AVIF.";
  else if (bestand.size > 20 * 1024 * 1024) velden.foto = "De foto is groter dan 20 MB.";
  if (Object.keys(velden).length) return { velden };
  const f = bestand as File;
  const payload = await payloadClient();
  try {
    await payload.create({
      collection: "media",
      data: data as never,
      file: { data: Buffer.from(await f.arrayBuffer()), mimetype: f.type, name: f.name, size: f.size },
      user,
      overrideAccess: false,
    });
  } catch {
    return { fout: "Uploaden lukte niet. Probeer het opnieuw." };
  }
  revalidatePath("/website/galerij");
  return { goed: "Foto staat in de galerij." };
}

export async function bewaarFoto(id: number, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const { data, velden } = leesVelden(formData, fotoVelden);
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  await payload.update({ collection: "media", id, data: data as never, user, overrideAccess: false });
  revalidatePath("/website/galerij");
  return { goed: "Opgeslagen." };
}

export async function verwijderFoto(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "media", id, user, overrideAccess: false });
  revalidatePath("/website/galerij");
  redirect("/website/galerij");
}
