import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { heeftRol } from "@/access";
import { Bevestig } from "@/components/Bevestig";
import { Gegevens, Melding, PaginaKop, Paneel, TicketLabel } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { WEBBOUWER } from "@/lib/bedrijf";
import { datum, momentTekst } from "@/lib/datum";
import { labelVan, openTicketStatussen, ticketSoorten } from "@/lib/opties";
import { trekTicketIn } from "../actions";
import { Reactie } from "./Reactie";

export const metadata: Metadata = { title: "Ticket" };

export default async function TicketPagina({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ verstuurd?: string }> }) {
  const user = await vereisGebruiker();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { verstuurd } = await searchParams;
  const payload = await payloadClient();
  const ticket = await payload.findByID({ collection: "tickets", id, depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!ticket) notFound();

  // Colleagues may not read other accounts, but they do see who replied.
  const { docs: mensen } = await payload.find({ collection: "users", select: { naam: true, rol: true }, limit: 50, depth: 0, overrideAccess: true });
  const naamVan = (door: unknown) => {
    const did = typeof door === "object" && door ? (door as { id: number }).id : (door as number | null);
    const m = mensen.find((x) => x.id === did);
    return m ? `${m.naam}${m.rol === "superadmin" ? " (webbouwer)" : ""}` : "Onbekend";
  };

  const webbouwer = heeftRol(user, "superadmin");
  const melder = typeof ticket.melder === "object" ? ticket.melder : null;
  const open = openTicketStatussen.includes(ticket.status);
  const bijlagen = (ticket.bijlagen ?? []).flatMap((b) => (typeof b === "object" && b.url ? [b] : []));
  const paginaLink = ticket.pagina && /^https?:\/\//.test(ticket.pagina) ? ticket.pagina : null;

  return (
    <>
      <PaginaKop titel={`#${ticket.id} ${ticket.titel}`} status={<TicketLabel status={ticket.status} />} terug={{ href: "/tickets", label: "Tickets" }} />
      {verstuurd && (
        <div className="mb-6">
          <Melding soort="goed">Je ticket is verstuurd. {WEBBOUWER} krijgt er een mail van, en je ziet hier wat ermee gebeurt.</Melding>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 space-y-6">
          <Paneel id="vraag-kop" titel="De vraag">
            <p className="max-w-prose px-4 py-4 whitespace-pre-line [overflow-wrap:anywhere]">{ticket.omschrijving}</p>
            {bijlagen.length > 0 && (
              <ul aria-label="Bijlagen" className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 border-t border-rule px-4 py-4">
                {bijlagen.map((b) => (
                  <li key={b.id}>
                    <a href={b.url!} target="_blank" rel="noreferrer" className="block no-underline hover:opacity-90">
                      {b.mimeType?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element -- private file behind login
                        <img src={b.url!} alt="" className="aspect-[4/3] w-full border border-rule bg-canvas object-cover" />
                      ) : (
                        <span className="flex aspect-[4/3] w-full items-center justify-center border border-rule bg-canvas">
                          <FileText aria-hidden size={32} className="text-ink-muted" />
                        </span>
                      )}
                      <span className="mt-1 block truncate text-sm underline">{b.filename}</span>
                      <span className="sr-only"> (opent in een nieuw tabblad)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Paneel>

          <Paneel id="gesprek-kop" titel="Gesprek">
            {(ticket.berichten ?? []).length === 0 ? (
              <p className="px-4 py-4 text-ink-muted">Nog geen reacties.</p>
            ) : (
              <ol className="divide-y divide-rule">
                {(ticket.berichten ?? []).map((b) => (
                  <li key={b.id} className="px-4 py-4">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="font-semibold">{naamVan(b.door)}</span>
                      <span className="text-ink-muted">{momentTekst(b.op)}</span>
                      {b.statusNaar && <TicketLabel status={b.statusNaar} />}
                    </p>
                    <p className="mt-1 max-w-prose whitespace-pre-line [overflow-wrap:anywhere]">{b.tekst}</p>
                  </li>
                ))}
              </ol>
            )}
            <div className="border-t border-rule px-4 py-4">
              <h3 className="mb-3 font-semibold">Reageren</h3>
              <Reactie id={ticket.id} status={ticket.status} webbouwer={webbouwer} />
            </div>
          </Paneel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <Paneel id="gegevens-kop" titel="Gegevens">
            <Gegevens
              rijen={[
                ["Soort", labelVan(ticketSoorten, ticket.soort)],
                [
                  "Pagina",
                  ticket.pagina ? (
                    paginaLink ? (
                      <a key="p" href={paginaLink} target="_blank" rel="noreferrer" className="underline">
                        {ticket.pagina}
                      </a>
                    ) : (
                      ticket.pagina
                    )
                  ) : null,
                ],
                ...(ticket.nodigOp ? ([["Nodig vóór", datum(ticket.nodigOp)]] as [string, string][]) : []),
                ["Ingediend", `${datum(ticket.createdAt)}${melder ? ` door ${melder.naam}` : ""}`],
              ]}
            />
          </Paneel>
          {open && !webbouwer && (
            <Bevestig
              actie={trekTicketIn}
              velden={{ id: ticket.id }}
              knop="Niet meer nodig"
              knopKlasse="inline-flex min-h-doel items-center px-1 font-medium underline"
              titel="Ticket intrekken?"
              tekst={`${WEBBOUWER} stopt ermee. Je kunt later reageren om het weer te openen.`}
              ja="Ja, trek in"
            />
          )}
        </aside>
      </div>
    </>
  );
}
