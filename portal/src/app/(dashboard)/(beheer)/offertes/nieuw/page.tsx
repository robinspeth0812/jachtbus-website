import type { Metadata } from "next";
import { PaginaKop } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { dagPlus, nederlandseDatum } from "@/lib/datum";
import { laadKeuzes } from "@/lib/keuzes";
import { gelegenheden, labelVan } from "@/lib/opties";
import { bewaarOfferte } from "../actions";
import { OfferteFormulier } from "../OfferteFormulier";

export const metadata: Metadata = { title: "Offerte maken" };

export default async function NieuweOfferte({ searchParams }: { searchParams: Promise<{ aanvraag?: string }> }) {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const aanvraagId = Number((await searchParams).aanvraag);
  const a = aanvraagId > 0 ? await payload.findByID({ collection: "aanvragen", id: aanvraagId, depth: 0, user, overrideAccess: false }).catch(() => null) : null;
  const keuzes = await laadKeuzes(payload, user, ["klanten"]);

  const doc = {
    titel: a ? `${labelVan(gelegenheden, a.gelegenheid)}${a.gasten ? ` voor ${a.gasten} gasten` : ""}` : "",
    klant: a?.klant ?? null,
    geldigTot: `${dagPlus(nederlandseDatum(), 30)}T12:00:00.000Z`,
    intro: a ? `Beste ${a.naam},\n\nLeuk dat je aan ons denkt. Dit is wat we voor je kunnen doen.` : "",
    slot: "Vragen, of wil je iets anders? Bel of mail ons gerust.",
  };

  return (
    <>
      <PaginaKop titel="Offerte maken" terug={{ href: a ? `/aanvragen/${a.id}` : "/offertes", label: a ? `Aanvraag van ${a.naam}` : "Offertes" }} />
      <OfferteFormulier
        actie={bewaarOfferte.bind(null, null)}
        doc={doc}
        keuzes={keuzes}
        aanvraag={a?.id}
        regels={a?.gasten ? [{ omschrijving: labelVan(gelegenheden, a.gelegenheid), aantal: a.gasten, prijs: null, btw: "9" }] : undefined}
      />
    </>
  );
}
