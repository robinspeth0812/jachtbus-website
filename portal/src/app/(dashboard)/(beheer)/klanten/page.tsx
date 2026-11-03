import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { Where } from "payload";
import { LegeStaat, PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";

export const metadata: Metadata = { title: "Klanten" };

export default async function KlantenPagina({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const q = (await searchParams).q?.trim().slice(0, 80) ?? "";
  const where: Where | undefined = q
    ? { or: [{ naam: { contains: q } }, { bedrijf: { contains: q } }, { email: { contains: q } }, { plaats: { contains: q } }] }
    : undefined;
  const { docs } = await payload.find({ collection: "klanten", where, sort: "naam", limit: 300, depth: 0, user, overrideAccess: false });

  return (
    <>
      <PaginaKop
        titel="Klanten"
        info="Komt vanzelf uit aanvragen: hetzelfde mailadres is dezelfde klant. Bewaar alleen wat je voor het werk nodig hebt. Vraagt iemand om verwijdering, dan kan dat op de pagina van de klant."
        actie={
          <Link href="/klanten/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Klant toevoegen
          </Link>
        }
      />
      <form role="search" className="mb-4 flex max-w-md gap-2">
        <label htmlFor="zoek-klant" className="sr-only">
          Zoek een klant
        </label>
        <input id="zoek-klant" name="q" type="search" defaultValue={q} placeholder="Naam, bedrijf, mail of plaats" className="veld" />
        <button type="submit" className="knop knop-secundair shrink-0">
          <Search aria-hidden size={18} /> Zoek
        </button>
      </form>
      {docs.length === 0 ? (
        <LegeStaat titel={q ? `Niets gevonden voor "${q}"` : "Nog geen klanten"}>
          {q ? "Probeer een deel van de naam of de plaats." : "Klanten komen hier vanzelf bij een aanvraag. Je kunt ook zelf iemand toevoegen die belde."}
        </LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {docs.map((k) => (
            <li key={k.id}>
              <Link href={`/klanten/${k.id}`} className="rij-link">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block font-semibold [overflow-wrap:anywhere]">{k.naam}</span>
                  <span className="block text-sm text-ink-muted [overflow-wrap:anywhere]">{[k.bedrijf, k.plaats, k.email].filter(Boolean).join(", ")}</span>
                </span>
                {k.telefoon && <span className="text-sm">{k.telefoon}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
