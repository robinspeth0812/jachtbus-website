import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AanvraagLabel, LegeStaat, PaginaKop, TabLinks } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { datum, kortDatum } from "@/lib/datum";
import { gelegenheden, labelVan } from "@/lib/opties";
import { Bord } from "./Bord";

export const metadata: Metadata = { title: "Aanvragen" };

export default async function AanvragenPagina({ searchParams }: { searchParams: Promise<{ weergave?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const { weergave } = await searchParams;
  const lijst = weergave === "lijst";
  const { docs } = await payload.find({ collection: "aanvragen", sort: "-createdAt", limit: 300, depth: 0, user, overrideAccess: false });

  return (
    <>
      <PaginaKop
        titel="Aanvragen"
        info="Alles wat via het formulier op de site binnenkomt, of wat je zelf toevoegt na een telefoontje. Verplaats een aanvraag naar de volgende fase: de bijbehorende taak (reageren, offerte sturen, nabellen) komt vanzelf op je lijst."
        actie={
          <Link href="/aanvragen/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Aanvraag toevoegen
          </Link>
        }
      />
      <TabLinks
        label="Weergave"
        tabs={[
          { href: "/aanvragen", label: "Bord", actief: !lijst },
          { href: "/aanvragen?weergave=lijst", label: "Lijst", actief: lijst },
        ]}
      />
      {docs.length === 0 ? (
        <LegeStaat
          titel="Nog geen aanvragen"
          actie={
            <Link href="/aanvragen/nieuw" className="knop knop-secundair">
              Aanvraag toevoegen
            </Link>
          }
        >
          Vult iemand het formulier op de site in, dan komt het hier in de kolom Nieuw en krijg je een mail. Belde er iemand? Zet het er zelf in, dan raakt het niet zoek.
        </LegeStaat>
      ) : lijst ? (
        <ul className="paneel divide-y divide-rule">
          {docs.map((a) => (
            <li key={a.id}>
              <Link href={`/aanvragen/${a.id}`} className="rij-link">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block font-semibold [overflow-wrap:anywhere]">{a.naam}</span>
                  <span className="block text-sm text-ink-muted">
                    {labelVan(gelegenheden, a.gelegenheid)}
                    {a.plaats ? `, ${a.plaats}` : ""}
                    {a.datum ? `, ${datum(a.datum)}` : ""}
                    {a.gasten ? `, ${a.gasten} gasten` : ""}
                  </span>
                </span>
                <span className="text-sm text-ink-muted">Binnen op {kortDatum(a.createdAt)}</span>
                <AanvraagLabel fase={a.fase} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Bord
          kaarten={docs.map((a) => ({
            id: a.id,
            naam: a.naam,
            gelegenheid: a.gelegenheid === "overige" && a.gelegenheidOverig ? a.gelegenheidOverig : labelVan(gelegenheden, a.gelegenheid),
            datum: a.datum ?? null,
            plaats: a.plaats ?? null,
            gasten: a.gasten ?? null,
            fase: a.fase,
          }))}
        />
      )}
    </>
  );
}
