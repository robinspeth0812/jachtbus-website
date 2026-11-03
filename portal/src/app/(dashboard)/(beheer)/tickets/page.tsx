import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LegeStaat, PaginaKop, TabLinks, TicketLabel } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { WEBBOUWER } from "@/lib/bedrijf";
import { kortDatum } from "@/lib/datum";
import { labelVan, openTicketStatussen, ticketSoorten } from "@/lib/opties";

export const metadata: Metadata = { title: "Tickets" };

export default async function TicketsPagina({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const gesloten = (await searchParams).tab === "klaar";
  const { docs } = await payload.find({
    collection: "tickets",
    where: { status: gesloten ? { not_in: openTicketStatussen } : { in: openTicketStatussen } },
    sort: "-updatedAt",
    limit: 100,
    depth: 0,
    user,
    overrideAccess: false,
  });
  return (
    <>
      <PaginaKop
        titel="Tickets"
        info={`Vraag of wens voor de site, je Google-profiel of dit portaal? Maak een ticket: ${WEBBOUWER} krijgt een mail en je ziet hier wat ermee gebeurt.`}
        actie={
          <Link href="/tickets/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Ticket maken
          </Link>
        }
      />
      <TabLinks
        label="Welke tickets"
        tabs={[
          { href: "/tickets", label: "Open", actief: !gesloten },
          { href: "/tickets?tab=klaar", label: "Afgehandeld", actief: gesloten },
        ]}
      />
      {docs.length === 0 ? (
        <LegeStaat titel={gesloten ? "Nog niets afgehandeld" : "Geen open tickets"}>
          {gesloten ? "Afgeronde tickets blijven hier staan om terug te lezen." : `Staat er iets niet goed op de site, of wil je iets nieuws? Maak een ticket, dan weet ${WEBBOUWER} het en raakt het niet kwijt in de mail.`}
        </LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {docs.map((t) => (
            <li key={t.id}>
              <Link href={`/tickets/${t.id}`} className="rij-link">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block font-semibold [overflow-wrap:anywhere]">
                    #{t.id} {t.titel}
                  </span>
                  <span className="block text-sm text-ink-muted">
                    {labelVan(ticketSoorten, t.soort)}, bijgewerkt {kortDatum(t.updatedAt)}
                  </span>
                </span>
                <TicketLabel status={t.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
