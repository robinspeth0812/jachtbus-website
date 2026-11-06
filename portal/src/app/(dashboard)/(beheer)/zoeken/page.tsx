import type { Metadata } from "next";
import Link from "next/link";
import { heeftRol } from "@/access";
import { LegeStaat, PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { kortDatum } from "@/lib/datum";
import { gelegenheden, labelVan } from "@/lib/opties";
import { moduleAan } from "@/lib/pakket";

export const metadata: Metadata = { title: "Zoeken" };

type Treffer = { href: string; titel: string; onder?: string };

export default async function Zoeken({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const q = (await searchParams).q?.trim().slice(0, 80) ?? "";
  const beheerder = heeftRol(user, "superadmin", "eigenaar");
  const toegang = { user, overrideAccess: false, depth: 0, limit: 8 } as const;
  const groepen: { titel: string; treffers: Treffer[] }[] = [];
  const metKlanten = moduleAan("klanten");
  const metKlussen = moduleAan("klussen");
  const waarin = ["aanvragen", metKlanten && "klanten", metKlussen && "klussen"].filter(Boolean).join(", ");

  if (q) {
    const [aanvragen, klanten, klussen, arr, ref, rev, faq, plaatsen, events] = await Promise.all([
      payload.find({ collection: "aanvragen", where: { or: [{ naam: { contains: q } }, { email: { contains: q } }, { plaats: { contains: q } }, { opmerking: { contains: q } }] }, ...toegang }),
      metKlanten ? payload.find({ collection: "klanten", where: { or: [{ naam: { contains: q } }, { bedrijf: { contains: q } }, { email: { contains: q } }, { plaats: { contains: q } }] }, ...toegang }) : null,
      metKlussen ? payload.find({ collection: "klussen", where: { or: [{ titel: { contains: q } }, { plaats: { contains: q } }, { adres: { contains: q } }] }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "arrangementen", where: { or: [{ titel: { contains: q } }, { kort: { contains: q } }] }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "referenties", where: { or: [{ titel: { contains: q } }, { plaats: { contains: q } }] }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "reviews", where: { or: [{ naam: { contains: q } }, { tekst: { contains: q } }] }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "veelgesteld", where: { or: [{ vraag: { contains: q } }, { antwoord: { contains: q } }] }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "plaatsen", where: { naam: { contains: q } }, ...toegang }) : null,
      beheerder ? payload.find({ collection: "evenementen", where: { or: [{ titel: { contains: q } }, { plaats: { contains: q } }, { notitie: { contains: q } }] }, ...toegang }) : null,
    ]);
    groepen.push(
      { titel: "Aanvragen", treffers: aanvragen.docs.map((a) => ({ href: `/aanvragen/${a.id}`, titel: a.naam, onder: [labelVan(gelegenheden, a.gelegenheid), a.plaats, a.datum && kortDatum(a.datum)].filter(Boolean).join(", ") })) },
      { titel: "Klanten", treffers: (klanten?.docs ?? []).map((k) => ({ href: `/klanten/${k.id}`, titel: k.naam, onder: [k.bedrijf, k.plaats].filter(Boolean).join(", ") })) },
      { titel: "Klussen", treffers: (klussen?.docs ?? []).map((k) => ({ href: `/klussen/${k.id}`, titel: k.titel, onder: [k.plaats, kortDatum(k.datum)].filter(Boolean).join(", ") })) },
      { titel: "Arrangementen", treffers: (arr?.docs ?? []).map((d) => ({ href: `/website/arrangementen/${d.id}`, titel: d.titel, onder: d.kort })) },
      { titel: "Referenties", treffers: (ref?.docs ?? []).map((d) => ({ href: `/website/referenties/${d.id}`, titel: d.titel, onder: d.plaats })) },
      { titel: "Reviews", treffers: (rev?.docs ?? []).map((d) => ({ href: `/website/reviews/${d.id}`, titel: d.naam, onder: d.tekst.slice(0, 80) })) },
      { titel: "Veelgestelde vragen", treffers: (faq?.docs ?? []).map((d) => ({ href: `/website/faq/${d.id}`, titel: d.vraag })) },
      { titel: "Agenda", treffers: (events?.docs ?? []).map((d) => ({ href: `/website/agenda/${d.id}`, titel: d.titel || `Afspraak${d.notitie ? `: ${d.notitie}` : ""}`, onder: [d.plaats, kortDatum(d.datum)].filter(Boolean).join(", ") })) },
      { titel: "Werkgebied", treffers: (plaatsen?.docs ?? []).map((d) => ({ href: `/website/werkgebied/${d.id}`, titel: d.naam, onder: d.provincie })) },
    );
  }
  const gevuld = groepen.filter((g) => g.treffers.length > 0);

  return (
    <>
      <PaginaKop titel="Zoeken" />
      <form role="search" className="mb-6 flex max-w-xl gap-2">
        <label htmlFor="zoekterm" className="sr-only">
          Zoeken in {waarin} en website
        </label>
        <input id="zoekterm" name="q" type="search" defaultValue={q} placeholder="Naam, plaats, mail…" className="veld" />
        <button type="submit" className="knop knop-primair shrink-0">
          Zoek
        </button>
      </form>
      {!q ? (
        <p className="max-w-prose text-ink-muted">Zoek op naam, plaats of mailadres, in {waarin} en de teksten van de site.</p>
      ) : gevuld.length === 0 ? (
        <LegeStaat titel={`Niets gevonden voor "${q}"`}>Probeer een deel van de naam, of alleen de plaats.</LegeStaat>
      ) : (
        <div className="space-y-6">
          {gevuld.map((g) => (
            <section key={g.titel} className="paneel" aria-label={g.titel}>
              <h2 className="paneel-kop paneel-titel">{g.titel}</h2>
              <ul className="divide-y divide-rule">
                {g.treffers.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="rij-link">
                      <span className="min-w-0">
                        <span className="block font-semibold [overflow-wrap:anywhere]">{t.titel}</span>
                        {t.onder && <span className="block text-sm text-ink-muted [overflow-wrap:anywhere]">{t.onder}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
