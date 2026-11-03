import { Check, FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActieKnop } from "@/components/ActieKnop";
import { Verwijderen } from "@/components/Formulier";
import { ItemFormulier } from "@/components/ItemFormulier";
import { KeuringLabel, Melding, PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { keuringStand } from "@/lib/keuringStand";
import { keuringVelden } from "@/lib/velddefs";
import { bewaarKeuring, keuringGedaan, verwijderKeuring } from "../actions";

export const metadata: Metadata = { title: "Keuring" };

export default async function KeuringDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ gedaan?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const { gedaan } = await searchParams;
  const k = await payload.findByID({ collection: "keuringen", id, depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!k) notFound();
  const { stand, dagen } = keuringStand(k.vervalt, k.herinnerDagen ?? 30);
  const document = typeof k.document === "object" ? k.document : null;

  return (
    <>
      <PaginaKop
        titel={k.naam}
        status={<KeuringLabel stand={stand} dagen={dagen} />}
        terug={{ href: "/bus/keuringen", label: "Keuringen en onderhoud" }}
        actie={
          <ActieKnop actie={keuringGedaan} velden={{ id: k.id }} voor={k.naam} klasse="knop knop-primair">
            <Check aria-hidden size={18} /> Gedaan
          </ActieKnop>
        }
      />
      {gedaan === "geen-interval" && (
        <div className="mb-4">
          <Melding soort="goed">Genoteerd als gedaan. Er staat geen interval bij, dus kies zelf de volgende datum bij Moet klaar zijn op.</Melding>
        </div>
      )}
      <ItemFormulier
        actie={bewaarKeuring.bind(null, k.id)}
        defs={keuringVelden}
        doc={k as unknown as Record<string, unknown>}
        extra={
          <div className="border-t border-rule pt-5">
            <label htmlFor="bestand" className="label">
              Keuringsrapport of polis <span className="font-normal text-ink-muted">(mag leeg)</span>
            </label>
            <span className="hulptekst mt-0 mb-1.5">PDF of foto, maximaal 10 MB. Blijft in het portaal.</span>
            <input id="bestand" name="bestand" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="veld" />
            {document?.url && (
              <a href={document.url} target="_blank" rel="noreferrer" className="lijn-link mt-1">
                <FileText aria-hidden size={16} /> {document.filename}
              </a>
            )}
          </div>
        }
      />
      <div className="mt-6">
        <Verwijderen actie={verwijderKeuring} id={k.id} wat="Keuring" naam={k.naam} />
      </div>
    </>
  );
}
