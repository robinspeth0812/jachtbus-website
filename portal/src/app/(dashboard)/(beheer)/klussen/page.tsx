import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConflictLabel, KlusLabel, LegeStaat, PaginaKop, TabLinks } from "@/components/ui";
import { conflictDagen } from "@/lib/agenda";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, datumLang, isoNaarDag, nederlandseDatum } from "@/lib/datum";
import { bezetteStatussen } from "@/lib/opties";

export const metadata: Metadata = { title: "Klussen" };

export default async function KlussenPagina({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const geweest = (await searchParams).tab === "geweest";
  const vandaag = dagNaarIso(nederlandseDatum());
  const { docs } = await payload.find({
    collection: "klussen",
    where: geweest
      ? { or: [{ datum: { less_than: vandaag } }, { status: { not_in: bezetteStatussen } }] }
      : { and: [{ datum: { greater_than_equal: vandaag } }, { status: { in: bezetteStatussen } }] },
    sort: geweest ? "-datum" : "datum",
    limit: 200,
    depth: 0,
    user,
    overrideAccess: false,
  });
  const dubbel = conflictDagen(docs);

  return (
    <>
      <PaginaKop
        titel="Klussen"
        info="Alles van één klus bij elkaar: tijden, locatie, draaiboek, boodschappen en wat er daarna nog moet. Rond je een klus af, dan komen de taken voor factuur en review vanzelf op je lijst."
        actie={
          <Link href="/klussen/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Klus toevoegen
          </Link>
        }
      />
      <TabLinks
        label="Welke klussen"
        tabs={[
          { href: "/klussen", label: "Komend", actief: !geweest },
          { href: "/klussen?tab=geweest", label: "Geweest en geannuleerd", actief: geweest },
        ]}
      />
      {docs.length === 0 ? (
        <LegeStaat titel={geweest ? "Nog niets geweest" : "Geen klussen gepland"}>
          {geweest ? "Afgeronde en geannuleerde klussen komen hier te staan." : "Open een aanvraag en kies Maak klus, dan staat alles er al in. Of voeg er zelf een toe."}
        </LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {docs.map((k) => (
            <li key={k.id}>
              <Link href={`/klussen/${k.id}`} className="rij-link">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block text-sm text-ink-muted first-letter:uppercase">{datumLang(k.datum)}</span>
                  <span className="block font-semibold [overflow-wrap:anywhere]">{k.titel}</span>
                  <span className="block text-sm text-ink-muted">{[k.plaats, k.gasten && `${k.gasten} gasten`, k.aankomst && `aankomst ${k.aankomst}`].filter(Boolean).join(", ")}</span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  {!geweest && dubbel.has(isoNaarDag(k.datum)) && <ConflictLabel />}
                  <KlusLabel status={k.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
