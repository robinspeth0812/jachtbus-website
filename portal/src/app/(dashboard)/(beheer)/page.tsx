import { ChevronRight, Clock3, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { heeftRol } from "@/access";
import { TaakRegel } from "@/components/Taak";
import { AanvraagLabel, ConflictLabel, KlusLabel, Paneel } from "@/components/ui";
import { conflictDagen } from "@/lib/agenda";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagenTussen, dagNaarIso, dagNaam, datum, datumLang, isoNaarDag, kortDatum, nederlandseDatum, nederlandseTijd } from "@/lib/datum";
import { keuringStand } from "@/lib/keuringStand";
import { bezetteStatussen, gelegenheden, labelVan } from "@/lib/opties";
import type { Klussen } from "@/payload-types";

export const metadata: Metadata = { title: "Home" };

/** "Zaterdag staat de bus in Roden, 80 gasten." */
function volgendeKlusZin(k: Klussen | undefined, vandaag: string) {
  if (!k) return "Er staat nog geen klus in de agenda.";
  const dag = isoNaarDag(k.datum);
  const verschil = dagenTussen(vandaag, dag);
  const wanneer = verschil === 0 ? "Vandaag" : verschil === 1 ? "Morgen" : verschil < 7 ? dagNaam(dag).replace(/^./, (c) => c.toUpperCase()) : `Op ${datum(dag)}`;
  const waar = k.plaats ? ` in ${k.plaats}` : "";
  const gasten = k.gasten ? `, ${k.gasten} gasten` : "";
  return `${wanneer} staat de bus${waar}${gasten}.`;
}

export default async function Home() {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const toegang = { user, overrideAccess: false } as const;
  const beheerder = heeftRol(user, "superadmin", "eigenaar");
  const vandaag = nederlandseDatum();

  const [taken, aanvragen, nieuw, offertes, komend, keuringen] = await Promise.all([
    payload.find({
      collection: "taken",
      where: { and: [{ klaar: { equals: false } }, { vervalt: { less_than: nederlandseTijd(vandaag, "23:59").toISOString() } }] },
      sort: "vervalt",
      limit: 6,
      depth: 1,
      ...toegang,
    }),
    payload.find({ collection: "aanvragen", sort: "-createdAt", limit: 5, depth: 0, ...toegang }),
    payload.count({ collection: "aanvragen", where: { fase: { equals: "nieuw" } }, ...toegang }),
    beheerder ? payload.count({ collection: "offertes", where: { status: { equals: "verstuurd" } }, ...toegang }) : Promise.resolve({ totalDocs: 0 }),
    payload.find({
      collection: "klussen",
      where: { and: [{ datum: { greater_than_equal: dagNaarIso(vandaag) } }, { status: { in: bezetteStatussen } }] },
      sort: "datum",
      limit: 100,
      depth: 0,
      ...toegang,
    }),
    payload.find({ collection: "keuringen", limit: 100, depth: 0, pagination: false, ...toegang }),
  ]);

  const openKeuringen = keuringen.docs.filter((k) => keuringStand(k.vervalt, k.herinnerDagen ?? 30).stand !== "in-orde").length;
  const dubbel = conflictDagen(komend.docs);
  const voornaam = user.naam.split(" ")[0];

  const tellers = [
    { href: "/aanvragen", waarde: nieuw.totalDocs, label: "Nieuwe aanvragen" },
    ...(beheerder ? [{ href: "/offertes", waarde: offertes.totalDocs, label: "Offertes uit" }] : []),
    { href: "/klussen", waarde: komend.totalDocs, label: "Komende klussen" },
    { href: "/bus/keuringen", waarde: openKeuringen, label: "Openstaande keuringen" },
  ];

  return (
    <>
      <header className="mb-6">
        <h1 className="kop-display text-5xl">Moi, {voornaam}</h1>
        <p className="mt-2 text-lg">
          <span className="text-ink-muted">{datumLang(vandaag).replace(/^./, (c) => c.toUpperCase())}.</span> {volgendeKlusZin(komend.docs[0], vandaag)}
        </p>
      </header>

      <Paneel id="vandaag-kop" titel="Vandaag te doen" link={{ href: "/taken", label: "Alle taken" }} className="mb-6">
        {taken.docs.length === 0 ? (
          <p className="max-w-prose px-4 py-5 text-ink-muted">Niets op de lijst voor vandaag. Taken komen hier vanzelf: na een aanvraag, een klus of als een keuring eraan komt.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {taken.docs.map((t) => (
              <TaakRegel key={t.id} taak={t} />
            ))}
          </ul>
        )}
      </Paneel>

      <ul className={`mb-6 grid grid-cols-2 gap-3 sm:gap-4 ${tellers.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {tellers.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="paneel flex h-full min-h-24 flex-col justify-between gap-1 p-4 no-underline transition-colors duration-150 hover:bg-laag">
              <span className="text-4xl leading-none font-bold">{t.waarde}</span>
              <span className="flex items-center gap-1 font-medium">
                {t.label} <ChevronRight aria-hidden size={16} className="shrink-0" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <Paneel id="aanvragen-kop" titel="Laatste aanvragen" link={{ href: "/aanvragen", label: "Naar het bord" }}>
          {aanvragen.docs.length === 0 ? (
            <p className="max-w-prose px-4 py-5 text-ink-muted">
              Nog geen aanvragen. Zodra iemand het formulier op de site invult, staat het hier en krijg je een mail. Belt er iemand?{" "}
              <Link href="/aanvragen/nieuw" className="underline">
                Zet het er zelf in
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-rule">
              {aanvragen.docs.map((a) => (
                <li key={a.id}>
                  <Link href={`/aanvragen/${a.id}`} className="rij-link">
                    <span className="min-w-0 flex-1 basis-48">
                      <span className="block font-semibold [overflow-wrap:anywhere]">{a.naam}</span>
                      <span className="block text-sm text-ink-muted">
                        {labelVan(gelegenheden, a.gelegenheid)}
                        {a.datum ? `, ${kortDatum(a.datum)}` : ""}
                        {a.gasten ? `, ${a.gasten} gasten` : ""}
                      </span>
                    </span>
                    <AanvraagLabel fase={a.fase} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Paneel>

        <Paneel id="klussen-kop" titel="Komende klussen" link={{ href: "/agenda", label: "Naar de agenda" }}>
          {komend.docs.length === 0 ? (
            <p className="max-w-prose px-4 py-5 text-ink-muted">Geen klussen gepland. Een bevestigde aanvraag maak je met één knop een klus, en die zie je dan hier.</p>
          ) : (
            <ul className="divide-y divide-rule">
              {komend.docs.slice(0, 5).map((k) => (
                <li key={k.id}>
                  <Link href={`/klussen/${k.id}`} className="rij-link">
                    <span className="min-w-0 flex-1 basis-48">
                      <span className="block font-semibold [overflow-wrap:anywhere]">{k.titel}</span>
                      <span className="flex items-start gap-2 text-sm text-ink-muted">
                        <Clock3 aria-hidden size={14} className="mt-1 shrink-0" />
                        <span>
                          {kortDatum(k.datum)}
                          {k.aankomst ? `, aankomst ${k.aankomst}` : ""}
                          {k.gasten ? `, ${k.gasten} gasten` : ""}
                        </span>
                      </span>
                    </span>
                    {dubbel.has(isoNaarDag(k.datum)) ? <ConflictLabel /> : <KlusLabel status={k.status} />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      </div>
      {komend.docs.length === 0 && (
        <p className="mt-4">
          <Link href="/klussen/nieuw" className="lijn-link">
            <Truck aria-hidden size={16} /> Zelf een klus toevoegen
          </Link>
        </p>
      )}
    </>
  );
}
