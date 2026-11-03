import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Verwijderen } from "@/components/Formulier";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { nietBeschikbaarDef, teamVelden } from "@/lib/velddefs";
import { bewaarTeamlid, verwijderTeamlid } from "../actions";

export const metadata: Metadata = { title: "Teamlid" };

export default async function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const t = await payload.findByID({ collection: "team", id: Number((await params).id), depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!t) notFound();
  return (
    <>
      <PaginaKop titel={t.naam} terug={{ href: "/bus/team", label: "Team" }} />
      <ItemFormulier actie={bewaarTeamlid.bind(null, t.id)} defs={teamVelden} herhalingen={[nietBeschikbaarDef]} doc={t as unknown as Record<string, unknown>} />
      <div className="mt-6">
        <Verwijderen actie={verwijderTeamlid} id={t.id} wat="Teamlid" naam={t.naam} />
      </div>
    </>
  );
}
