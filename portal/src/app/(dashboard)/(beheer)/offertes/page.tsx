import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LegeStaat, OfferteLabel, PaginaKop } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { datum } from "@/lib/datum";
import { prijs, totalen } from "@/lib/offerte";
import { offerteStand } from "@/lib/offerteStand";

export const metadata: Metadata = { title: "Offertes" };

export default async function OffertesPagina() {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "offertes", sort: "-nummer", limit: 200, depth: 1, user, overrideAccess: false });
  return (
    <>
      <PaginaKop
        titel="Offertes"
        info="Maak een offerte vanuit een aanvraag, of los. Print hem als A4 of sla hem op als PDF. Zet hem op Verstuurd, dan staat de aanvraag vanzelf op Offerte uit en komt er een nabel-taak."
        actie={
          <Link href="/offertes/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Offerte maken
          </Link>
        }
      />
      {docs.length === 0 ? (
        <LegeStaat titel="Nog geen offertes">Open een aanvraag en kies Maak offerte: de klant en het aantal gasten staan er dan al in. Prijzen blijven hier in het portaal en komen nooit op de site.</LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {docs.map((o) => {
            const klant = typeof o.klant === "object" ? o.klant : null;
            return (
              <li key={o.id}>
                <Link href={`/offertes/${o.id}`} className="rij-link">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block font-semibold [overflow-wrap:anywhere]">
                      {o.nummer} {o.titel}
                    </span>
                    <span className="block text-sm text-ink-muted">
                      {klant?.naam ?? "Geen klant"}, geldig tot {datum(o.geldigTot)}
                    </span>
                  </span>
                  <span className="font-semibold">{prijs(totalen(o.regels).totaal)}</span>
                  <OfferteLabel status={offerteStand(o.status, o.geldigTot)} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
