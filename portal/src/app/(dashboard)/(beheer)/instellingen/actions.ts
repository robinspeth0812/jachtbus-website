"use server";

import { revalidatePath } from "next/cache";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import type { FormStatus } from "@/lib/formulier";
import { startSiteBuild } from "@/lib/siteBuild";
import { leesVelden } from "@/lib/velden";
import { instellingenVelden } from "./velden";

export async function bewaarInstellingen(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisBeheerder();
  const { data: d, velden } = leesVelden(formData, instellingenVelden);
  if (Object.keys(velden).length) return { velden };
  const payload = await payloadClient();
  await payload.updateGlobal({
    slug: "instellingen",
    data: {
      contact: { telefoon: d.telefoon as string, whatsapp: d.whatsapp as string, email: (d.email as string) || null },
      profielen: { instagram: d.instagram as string, facebook: d.facebook as string, google: d.google as string },
      mail: {
        aanvraag: { aan: d.aanvraagAan as number[], extra: (d.aanvraagExtra as string) || null },
        herinnering: { aan: d.herinneringAan as number[], extra: (d.herinneringExtra as string) || null },
      },
    },
    user,
    overrideAccess: false,
  });
  revalidatePath("/", "layout");
  return { goed: "Instellingen opgeslagen." };
}

export async function werkSiteBij(_v: FormStatus): Promise<FormStatus> {
  await vereisBeheerder();
  const payload = await payloadClient();
  if (!process.env.SITE_BUILD_HOOK_URL) return { fout: "De koppeling met de site staat nog niet aan. Vraag de webbouwer om SITE_BUILD_HOOK_URL in te stellen." };
  const gelukt = await startSiteBuild(payload, "handmatig");
  revalidatePath("/instellingen");
  return gelukt ? { goed: "De site wordt nu bijgewerkt. Dat duurt een paar minuten." } : { fout: "Dat lukte niet. Probeer het zo nog eens, of maak een ticket." };
}
