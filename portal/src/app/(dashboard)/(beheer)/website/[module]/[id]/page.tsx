import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Verwijderen } from "@/components/Formulier";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop, PublicatieLabel, Waarschuwing } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { laadKeuzes } from "@/lib/keuzes";
import { websiteModules } from "@/lib/modules";
import { bewaarItem, verwijderItem } from "../../actions";

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  return { title: websiteModules[(await params).module]?.enkel ?? "Website" };
}

export default async function ModuleItem({ params, searchParams }: { params: Promise<{ module: string; id: string }>; searchParams: Promise<{ mist?: string }> }) {
  const user = await vereisBeheerder();
  const { module: key, id } = await params;
  const { mist } = await searchParams;
  const m = websiteModules[key];
  if (!m) notFound();
  const payload = await payloadClient();
  const nieuw = id === "nieuw";
  const doc = nieuw ? null : await payload.findByID({ collection: m.slug, id: Number(id), depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!nieuw && !doc) notFound();
  const d = doc as unknown as (Record<string, unknown> & { id: number; status?: string }) | null;
  const keuzes = m.velden.some((v) => v.bron === "media") ? await laadKeuzes(payload, user, ["media"]) : undefined;
  const titel = d ? String(d[m.titelVeld] ?? m.enkel) : `${m.enkel} toevoegen`;

  return (
    <>
      <PaginaKop titel={titel.length > 70 ? `${titel.slice(0, 70)}…` : titel} status={d ? <PublicatieLabel status={d.status} /> : undefined} terug={{ href: `/website/${key}`, label: m.titel }} />
      {mist && (
        <div className="mb-4">
          <Waarschuwing titel="Dit kan nog niet op de site">
            {key === "referenties" ? "Eerst moet de klant het goedvinden. Zet daarna de vink hieronder." : "Eerst moet de bron erbij: een link naar de review, of bij een mail of WhatsApp waar het bewijs staat."}
          </Waarschuwing>
        </div>
      )}
      <ItemFormulier
        actie={bewaarItem.bind(null, key, d?.id ?? null)}
        defs={m.velden}
        herhalingen={m.herhalingen}
        doc={d ?? { status: "concept" }}
        keuzes={keuzes}
        knop={nieuw ? `${m.enkel} opslaan` : "Opslaan"}
      />
      {d && (
        <div className="mt-6">
          <Verwijderen actie={verwijderItem} id={d.id} wat={m.enkel} naam={titel.slice(0, 50)} velden={{ module: key }} />
        </div>
      )}
    </>
  );
}
