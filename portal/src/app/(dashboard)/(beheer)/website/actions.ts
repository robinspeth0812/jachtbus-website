"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { type FormStatus, leesId, maakSlug } from "@/lib/formulier";
import { websiteModules } from "@/lib/modules";
import { leesRegels, leesVelden } from "@/lib/velden";

/** A public event needs a name and a place; a booking needs neither. */
function verplichtPerSoort(moduleKey: string, d: Record<string, unknown>): Record<string, string> {
  if (moduleKey !== "agenda" || d.soort !== "event") return {};
  return {
    ...(d.titel ? {} : { titel: "Een event heeft een naam nodig. Is het een besloten feest? Kies dan Afspraak." }),
    ...(d.plaats ? {} : { plaats: "Waar staat de bus? Vul de plaats in." }),
  };
}

/** Honesty rules for going public: the same rule for the form and the list button. */
function magOpSite(moduleKey: string, d: Record<string, unknown>): Record<string, string> {
  if (d.status !== "gepubliceerd") return {};
  if (moduleKey === "referenties" && !d.toestemming) return { toestemming: "Zonder toestemming van de klant gaat een referentie niet op de site." };
  if (moduleKey === "reviews") {
    const online = d.bron === "Google" || d.bron === "Facebook";
    if (online && !d.bronUrl) return { bronUrl: "Zet de link naar de review erbij, dan is hij op de site te controleren." };
    if (!online && !d.bewijs) return { bewijs: "Schrijf op van wanneer het bericht is en dat het op de site mag." };
  }
  return {};
}

export async function bewaarItem(moduleKey: string, id: number | null, _v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const m = websiteModules[moduleKey];
  if (!m) return { fout: "Dit onderdeel bestaat niet." };
  const { data, velden } = leesVelden(formData, m.velden);
  const fouten = { ...velden, ...verplichtPerSoort(moduleKey, data), ...magOpSite(moduleKey, data) };
  for (const h of m.herhalingen ?? []) {
    const r = leesRegels(formData, h);
    data[h.naam] = r.rijen;
    Object.assign(fouten, r.velden);
  }
  if (Object.keys(fouten).length) return { velden: fouten };

  const payload = await payloadClient();
  try {
    if (id) {
      await payload.update({ collection: m.slug, id, data: data as never, user, overrideAccess: false });
      revalidatePath(`/website/${moduleKey}`);
      return { goed: data.status === "gepubliceerd" ? "Opgeslagen. De site wordt straks bijgewerkt." : "Opgeslagen." };
    }
    if (m.metSlug) {
      // Unique per module; a second "Bruiloft" gets a number.
      const basis = maakSlug(String(data[m.titelVeld]));
      const { totalDocs } = await payload.count({ collection: m.slug, where: { slug: { like: basis } }, overrideAccess: true });
      data.slug = totalDocs ? `${basis}-${totalDocs + 1}` : basis;
    }
    const doc = await payload.create({ collection: m.slug, data: data as never, user, overrideAccess: false });
    revalidatePath(`/website/${moduleKey}`);
    return { naar: `/website/${moduleKey}/${doc.id}` };
  } catch {
    return { fout: "Opslaan lukte niet. Probeer het opnieuw, en krijg je dit vaker: maak een ticket." };
  }
}

export async function zetGepubliceerd(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  const moduleKey = String(formData.get("module"));
  const status = formData.get("status") === "gepubliceerd" ? "gepubliceerd" : "concept";
  const m = websiteModules[moduleKey];
  if (!id || !m) return;
  const payload = await payloadClient();
  const huidig = (await payload.findByID({ collection: m.slug, id, depth: 0, user, overrideAccess: false })) as unknown as Record<string, unknown>;
  // Not allowed yet: open the form, where the field says what is missing.
  if (Object.keys(magOpSite(moduleKey, { ...huidig, status })).length) redirect(`/website/${moduleKey}/${id}?mist=1`);
  await payload.update({ collection: m.slug, id, data: { status } as never, user, overrideAccess: false });
  revalidatePath(`/website/${moduleKey}`);
}

export async function verwijderItem(formData: FormData) {
  const user = await vereisBeheerder();
  const id = leesId(formData);
  const moduleKey = String(formData.get("module"));
  const m = websiteModules[moduleKey];
  if (!id || !m) return;
  const payload = await payloadClient();
  await payload.delete({ collection: m.slug, id, user, overrideAccess: false });
  revalidatePath(`/website/${moduleKey}`);
  redirect(`/website/${moduleKey}`);
}
