"use server";

import { revalidatePath } from "next/cache";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId, tekst } from "@/lib/formulier";
import { binnenNorm, meetSoorten, schoonmaakPunten } from "@/lib/opties";

const klusVan = (formData: FormData) => {
  const n = Number(formData.get("klus"));
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

export async function bewaarMeting(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const soort = tekst(formData, "soort", 20);
  const ruw = tekst(formData, "temperatuur", 8).replace(",", ".").replace("−", "-");
  const actie = tekst(formData, "actie", 300);
  const velden: Record<string, string> = {};
  const def = meetSoorten.find((m) => m.value === soort);
  if (!def) velden.soort = "Kies wat je meet.";
  const temperatuur = Number(ruw);
  if (!ruw || !Number.isFinite(temperatuur) || temperatuur < -60 || temperatuur > 300) velden.temperatuur = "Vul de temperatuur in, zoals 4 of -18.";
  const goed = def && !velden.temperatuur ? binnenNorm(soort, temperatuur) : true;
  if (!goed && !actie) velden.actie = "Boven of onder de norm: schrijf op wat je hebt gedaan.";
  if (Object.keys(velden).length) return { velden };

  const payload = await payloadClient();
  await payload.create({
    collection: "metingen",
    data: { soort: def!.value, temperatuur, binnenNorm: goed, actie, op: new Date().toISOString(), klus: klusVan(formData), door: user.id },
    user,
    overrideAccess: false,
  });
  revalidatePath("/bus/voedselveiligheid");
  return { goed: `${def!.label} ${temperatuur.toLocaleString("nl-NL")} °C genoteerd${goed ? ", binnen de norm" : ", met actie"}.` };
}

export async function bewaarRonde(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const gekozen = formData.getAll("punten").map(String);
  if (gekozen.length === 0) return { fout: "Vink aan wat je hebt schoongemaakt." };
  const payload = await payloadClient();
  await payload.create({
    collection: "schoonmaakrondes",
    data: {
      op: new Date().toISOString(),
      klus: klusVan(formData),
      door: user.id,
      opmerking: tekst(formData, "opmerking", 300),
      punten: schoonmaakPunten.map((punt) => ({ punt, gedaan: gekozen.includes(punt) })),
    },
    user,
    overrideAccess: false,
  });
  revalidatePath("/bus/voedselveiligheid");
  return { goed: `Schoonmaakronde bewaard: ${gekozen.length} van ${schoonmaakPunten.length} punten gedaan.` };
}

export async function verwijderMeting(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "metingen", id, user, overrideAccess: false });
  revalidatePath("/bus/voedselveiligheid");
}
