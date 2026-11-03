"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { heeftRol } from "@/access";
import { payloadClient, vereisBeheerder, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId, tekst } from "@/lib/formulier";
import { emailPatroon, gebruikerRollen } from "@/lib/opties";
import { nietBeschikbaarDef, teamVelden } from "@/lib/velddefs";
import { leesRegels, leesVelden } from "@/lib/velden";
import type { User } from "@/payload-types";

export async function bewaarTeamlid(id: number | null, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const { data, velden } = leesVelden(formData, teamVelden);
  const { rijen, velden: rijFouten } = leesRegels(formData, nietBeschikbaarDef);
  const fouten = { ...velden, ...rijFouten };
  if (Object.keys(fouten).length) return { velden: fouten };
  // Rows have a date as first column, leesRegels only drops on empty text.
  const doc = { ...data, nietBeschikbaar: rijen.filter((r) => r.dag) };
  const payload = await payloadClient();
  if (id) {
    await payload.update({ collection: "team", id, data: doc as never, user, overrideAccess: false });
    revalidatePath("/bus/team");
    return { goed: "Opgeslagen." };
  }
  const nieuw = await payload.create({ collection: "team", data: doc as never, user, overrideAccess: false });
  revalidatePath("/bus/team");
  return { naar: `/bus/team/${nieuw.id}` };
}

export async function verwijderTeamlid(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  await payload.delete({ collection: "team", id, user, overrideAccess: false });
  revalidatePath("/bus/team");
  redirect("/bus/team");
}

/** Only the web builder hands out the web builder role. */
const magRol = (user: User, rol: string) => gebruikerRollen.some((r) => r.value === rol) && (rol !== "superadmin" || heeftRol(user, "superadmin"));

export async function maakGebruiker(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const naam = tekst(formData, "naam", 80);
  const email = tekst(formData, "email", 200).toLowerCase();
  const rol = tekst(formData, "rol", 20);
  const wachtwoord = String(formData.get("wachtwoord") ?? "");
  const velden: Record<string, string> = {};
  if (!naam) velden.naam = "Vul een naam in.";
  if (!emailPatroon.test(email)) velden.email = "Vul een e-mailadres in, zoals naam@voorbeeld.nl.";
  if (!magRol(user, rol)) velden.rol = "Kies een rol.";
  if (wachtwoord.length < 10) velden.wachtwoord = "Kies een tijdelijk wachtwoord van minstens 10 tekens.";
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  try {
    await payload.create({ collection: "users", data: { naam, email, rol: rol as User["rol"], password: wachtwoord }, user, overrideAccess: false });
  } catch {
    return { velden: { email: "Dit e-mailadres heeft al een inlog." } };
  }
  revalidatePath("/bus/team");
  return { goed: `${naam} kan nu inloggen. Geef het tijdelijke wachtwoord persoonlijk door.` };
}

export async function zetWachtwoord(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  const wachtwoord = String(formData.get("wachtwoord") ?? "");
  if (!id) return { fout: "Deze inlog bestaat niet meer." };
  if (wachtwoord.length < 10) return { velden: { wachtwoord: "Kies een wachtwoord van minstens 10 tekens." } };
  const payload = await payloadClient();
  await payload.update({ collection: "users", id, data: { password: wachtwoord }, user, overrideAccess: false });
  return { goed: "Nieuw wachtwoord staat erin." };
}

export async function verwijderGebruiker(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  if (!id || id === user.id) return;
  const payload = await payloadClient();
  const doel = await payload.findByID({ collection: "users", id, depth: 0, user, overrideAccess: false });
  if (doel.rol === "superadmin" && !heeftRol(user, "superadmin")) return;
  await payload.delete({ collection: "users", id, user, overrideAccess: false });
  revalidatePath("/bus/team");
}
