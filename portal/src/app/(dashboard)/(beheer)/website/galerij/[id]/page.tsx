import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Verwijderen } from "@/components/Formulier";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { fotoVelden } from "@/lib/velddefs";
import { bewaarFoto, verwijderFoto } from "../actions";

export const metadata: Metadata = { title: "Foto" };

export default async function FotoDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const f = await payload.findByID({ collection: "media", id: Number((await params).id), depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!f) notFound();
  return (
    <>
      <PaginaKop titel="Foto" terug={{ href: "/website/galerij", label: "Galerij" }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- own uploads */}
      <img src={f.sizes?.groot?.url ?? f.url ?? ""} alt={f.alt} className="mb-6 max-h-96 w-auto border-[1.5px] border-donker" />
      <ItemFormulier actie={bewaarFoto.bind(null, f.id)} defs={fotoVelden} doc={f as unknown as Record<string, unknown>} />
      <div className="mt-6">
        <Verwijderen actie={verwijderFoto} id={f.id} wat="Foto" extra="Staat hij bij een referentie of klus, dan verdwijnt hij daar ook." />
      </div>
    </>
  );
}
