import { Check, Printer, Send, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActieKnop } from "@/components/ActieKnop";
import { Verwijderen } from "@/components/Formulier";
import { OfferteLabel, PaginaKop, Waarschuwing } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { datum } from "@/lib/datum";
import { laadKeuzes } from "@/lib/keuzes";
import { offerteStand } from "@/lib/offerteStand";
import { bewaarOfferte, verwijderOfferte, zetOfferteStatus } from "../actions";
import { OfferteFormulier } from "../OfferteFormulier";

export const metadata: Metadata = { title: "Offerte" };

export default async function OfferteDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const o = await payload.findByID({ collection: "offertes", id, depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!o) notFound();
  const keuzes = await laadKeuzes(payload, user, ["klanten"]);
  const stand = offerteStand(o.status, o.geldigTot);

  return (
    <>
      <PaginaKop
        titel={`Offerte ${o.nummer}`}
        status={<OfferteLabel status={stand} />}
        terug={{ href: "/offertes", label: "Offertes" }}
        actie={
          <Link href={`/afdruk/offerte/${o.id}`} className="knop knop-secundair">
            <Printer aria-hidden size={18} /> Afdruk en PDF
          </Link>
        }
      />
      {stand === "verlopen" && (
        <div className="mb-4">
          <Waarschuwing titel={`Geldig tot ${datum(o.geldigTot)} is voorbij`}>Nog interesse? Pas de datum aan en stuur hem opnieuw.</Waarschuwing>
        </div>
      )}
      <div className="mb-6 flex flex-wrap gap-3">
        {o.status === "concept" && (
          <ActieKnop actie={zetOfferteStatus} velden={{ id: o.id, status: "verstuurd" }} voor={`offerte ${o.nummer}`} klasse="knop knop-primair">
            <Send aria-hidden size={18} /> Zet op Verstuurd
          </ActieKnop>
        )}
        {o.status === "verstuurd" && (
          <>
            <ActieKnop actie={zetOfferteStatus} velden={{ id: o.id, status: "geaccepteerd" }} voor={`offerte ${o.nummer}`} klasse="knop knop-primair">
              <Check aria-hidden size={18} /> Geaccepteerd
            </ActieKnop>
            <ActieKnop actie={zetOfferteStatus} velden={{ id: o.id, status: "afgewezen" }} voor={`offerte ${o.nummer}`} klasse="knop knop-secundair">
              <X aria-hidden size={18} /> Afgewezen
            </ActieKnop>
          </>
        )}
        {(o.status === "afgewezen" || o.status === "geaccepteerd" || o.status === "verlopen") && (
          <ActieKnop actie={zetOfferteStatus} velden={{ id: o.id, status: "concept" }} voor={`offerte ${o.nummer}`} klasse="knop knop-secundair">
            Terug naar concept
          </ActieKnop>
        )}
      </div>
      <OfferteFormulier actie={bewaarOfferte.bind(null, o.id)} doc={o as unknown as Record<string, unknown>} regels={o.regels} keuzes={keuzes} />
      <div className="mt-6">
        <Verwijderen actie={verwijderOfferte} id={o.id} wat="Offerte" naam={o.nummer ?? undefined} />
      </div>
    </>
  );
}
