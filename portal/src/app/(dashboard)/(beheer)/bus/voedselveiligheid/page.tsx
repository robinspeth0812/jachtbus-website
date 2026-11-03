import { AlertTriangle, Check, Download } from "lucide-react";
import type { Metadata } from "next";
import { Verwijderen } from "@/components/Formulier";
import { Label, LegeStaat, PaginaKop, Paneel, TabLinks } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagPlus, dagNaarIso, kortDatum, momentTekst, nederlandseDatum } from "@/lib/datum";
import { bezetteStatussen, labelVan, meetSoorten } from "@/lib/opties";
import { verwijderMeting } from "./actions";
import { MeetFormulier, RondeFormulier } from "./Meten";

export const metadata: Metadata = { title: "Voedselveiligheid" };

export default async function Voedselveiligheid({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const gevraagd = (await searchParams).tab;
  const tab = gevraagd === "schoonmaak" || gevraagd === "overzicht" ? gevraagd : "meten";
  const toegang = { user, overrideAccess: false } as const;
  const vandaag = nederlandseDatum();

  const [metingen, rondes, klussen] = await Promise.all([
    payload.find({ collection: "metingen", sort: "-op", limit: tab === "overzicht" ? 100 : 5, depth: 1, ...toegang }),
    payload.find({ collection: "schoonmaakrondes", sort: "-op", limit: tab === "overzicht" ? 50 : 3, depth: 1, ...toegang }),
    payload.find({
      collection: "klussen",
      where: { and: [{ datum: { greater_than_equal: dagNaarIso(dagPlus(vandaag, -1)) } }, { datum: { less_than: dagNaarIso(dagPlus(vandaag, 14)) } }, { status: { in: bezetteStatussen } }] },
      sort: "datum",
      limit: 10,
      depth: 0,
      ...toegang,
    }),
  ]);
  const klusOpties = klussen.docs.map((k) => ({ value: String(k.id), label: `${kortDatum(k.datum)}: ${k.titel}` }));

  const metingLijst = (
    <ul className="divide-y divide-rule">
      {metingen.docs.map((m) => {
        const klus = typeof m.klus === "object" ? m.klus : null;
        const door = typeof m.door === "object" ? m.door : null;
        return (
          <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
            <span className="min-w-0 flex-1 basis-56">
              <span className="font-semibold">
                {labelVan(meetSoorten, m.soort)} {m.temperatuur.toLocaleString("nl-NL")} °C
              </span>
              <span className="block text-sm text-ink-muted">{[momentTekst(m.op), door?.naam, klus?.titel].filter(Boolean).join(", ")}</span>
              {m.actie && <span className="block text-sm">Actie: {m.actie}</span>}
            </span>
            {m.binnenNorm ? (
              <Label toon="goed" icoon={Check}>
                Binnen norm
              </Label>
            ) : (
              <Label toon="fout" icoon={AlertTriangle}>
                Buiten norm
              </Label>
            )}
            <Verwijderen actie={verwijderMeting} id={m.id} wat="Meting" klein />
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PaginaKop
        titel="Voedselveiligheid"
        info="Jullie HACCP-logboek: temperaturen en schoonmaakrondes, met tijd en naam erbij. De normen in dit scherm zijn richtwaarden. Controleer ze tegen de hygiënecode die jullie gebruiken. Exporteer het overzicht als de NVWA erom vraagt."
      />
      <TabLinks
        label="Onderdelen voedselveiligheid"
        tabs={[
          { href: "/bus/voedselveiligheid", label: "Meten", actief: tab === "meten" },
          { href: "/bus/voedselveiligheid?tab=schoonmaak", label: "Schoonmaak", actief: tab === "schoonmaak" },
          { href: "/bus/voedselveiligheid?tab=overzicht", label: "Overzicht", actief: tab === "overzicht" },
        ]}
      />

      {tab === "meten" && (
        <div className="space-y-6">
          <MeetFormulier klussen={klusOpties} />
          {metingen.docs.length > 0 && (
            <Paneel id="laatste-kop" titel="Laatste metingen">
              {metingLijst}
            </Paneel>
          )}
        </div>
      )}

      {tab === "schoonmaak" && <RondeFormulier klussen={klusOpties} />}

      {tab === "overzicht" && (
        <div className="space-y-6">
          <a href="/bus/voedselveiligheid/export" className="knop knop-secundair">
            <Download aria-hidden size={18} /> Exporteer als CSV (Excel)
          </a>
          {metingen.docs.length === 0 && rondes.docs.length === 0 ? (
            <LegeStaat titel="Logboek is nog leeg">Meet de koeling voor je vertrekt en na afloop. Elke meting staat hier met tijd en naam, klaar voor een controle.</LegeStaat>
          ) : (
            <>
              <Paneel id="metingen-kop" titel="Metingen">
                {metingen.docs.length ? metingLijst : <p className="px-4 py-4 text-ink-muted">Nog geen metingen.</p>}
              </Paneel>
              <Paneel id="rondes-kop" titel="Schoonmaakrondes">
                {rondes.docs.length === 0 ? (
                  <p className="px-4 py-4 text-ink-muted">Nog geen rondes.</p>
                ) : (
                  <ul className="divide-y divide-rule">
                    {rondes.docs.map((r) => {
                      const gedaan = (r.punten ?? []).filter((p) => p.gedaan).length;
                      const open = (r.punten ?? []).filter((p) => !p.gedaan);
                      const door = typeof r.door === "object" ? r.door : null;
                      return (
                        <li key={r.id} className="px-4 py-2">
                          <span className="font-semibold">
                            {gedaan} van {r.punten?.length ?? 0} punten gedaan
                          </span>
                          <span className="block text-sm text-ink-muted">{[momentTekst(r.op), door?.naam].filter(Boolean).join(", ")}</span>
                          {open.length > 0 && <span className="block text-sm">Niet gedaan: {open.map((p) => p.punt).join(", ")}</span>}
                          {r.opmerking && <span className="block text-sm">{r.opmerking}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Paneel>
            </>
          )}
        </div>
      )}
    </>
  );
}
