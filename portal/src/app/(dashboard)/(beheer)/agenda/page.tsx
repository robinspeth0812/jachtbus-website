import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConflictLabel, KlusLabel, LegeStaat, PaginaKop } from "@/components/ui";
import { conflictDagen } from "@/lib/agenda";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, datumLang, dagPlus, isoNaarDag, maandNaam, nederlandseDatum } from "@/lib/datum";

export const metadata: Metadata = { title: "Agenda" };

const WEEK = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const WEEK_VOL = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];

function maandVan(param: string | undefined, vandaag: string) {
  return param && /^\d{4}-(0[1-9]|1[0-2])$/.test(param) ? param : vandaag.slice(0, 7);
}
function schuif(maand: string, stap: number) {
  const [j, m] = maand.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1 + stap, 15));
  return d.toISOString().slice(0, 7);
}

export default async function Agenda({ searchParams }: { searchParams: Promise<{ maand?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const vandaag = nederlandseDatum();
  const maand = maandVan((await searchParams).maand, vandaag);
  const eerste = `${maand}-01`;
  const volgende = `${schuif(maand, 1)}-01`;

  const { docs } = await payload.find({
    collection: "klussen",
    where: { and: [{ datum: { greater_than_equal: dagNaarIso(eerste) } }, { datum: { less_than: dagNaarIso(volgende) } }] },
    sort: "datum",
    limit: 200,
    depth: 0,
    user,
    overrideAccess: false,
  });
  const dubbel = conflictDagen(docs);
  const perDag = new Map<string, typeof docs>();
  for (const k of docs) {
    const d = isoNaarDag(k.datum);
    perDag.set(d, [...(perDag.get(d) ?? []), k]);
  }

  // Grid from the Monday on or before the first until the Sunday after the last.
  const weekdagEerste = (new Date(`${eerste}T12:00:00Z`).getUTCDay() + 6) % 7;
  const start = dagPlus(eerste, -weekdagEerste);
  const dagen: string[] = [];
  for (let d = start; d < volgende || dagen.length % 7 !== 0; d = dagPlus(d, 1)) dagen.push(d);

  return (
    <>
      <PaginaKop
        titel="Agenda"
        info="Alle klussen op een rij. Er is maar één bus: staan er op één dag twee klussen als Optie of Bevestigd, dan zie je Dubbel geboekt. Afgeronde en geannuleerde klussen tellen niet mee."
        actie={
          <Link href="/klussen/nieuw" className="knop knop-primair">
            Klus toevoegen
          </Link>
        }
      />
      <nav aria-label="Maand kiezen" className="mb-4 flex flex-wrap items-center gap-2">
        <Link href={`/agenda?maand=${schuif(maand, -1)}`} className="knop knop-secundair px-3">
          <ChevronLeft aria-hidden size={18} /> <span className="sr-only">Vorige maand</span>
        </Link>
        <h2 className="min-w-[10rem] text-center text-lg font-semibold first-letter:uppercase" aria-live="polite">
          {maandNaam(eerste)}
        </h2>
        <Link href={`/agenda?maand=${schuif(maand, 1)}`} className="knop knop-secundair px-3">
          <ChevronRight aria-hidden size={18} /> <span className="sr-only">Volgende maand</span>
        </Link>
        {maand !== vandaag.slice(0, 7) && (
          <Link href="/agenda" className="lijn-link ml-2">
            Naar vandaag
          </Link>
        )}
      </nav>

      {dubbel.size > 0 && (
        <p className="mb-4 flex flex-wrap items-center gap-2">
          <ConflictLabel /> op {dubbel.size === 1 ? "één dag" : `${dubbel.size} dagen`} deze maand.
        </p>
      )}

      {/* Month grid from lg upwards: a phone gets the list below. */}
      <div className="paneel hidden lg:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Klussen in {maandNaam(eerste)}</caption>
          <thead>
            <tr>
              {WEEK.map((d, i) => (
                <th key={d} scope="col" abbr={WEEK_VOL[i]} className="border-b-[1.5px] border-donker px-2 py-1.5 text-left font-semibold first-letter:uppercase">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: dagen.length / 7 }, (_, w) => (
              <tr key={w}>
                {dagen.slice(w * 7, w * 7 + 7).map((d) => {
                  const klussen = perDag.get(d) ?? [];
                  const buiten = d.slice(0, 7) !== maand;
                  return (
                    <td key={d} className={`h-28 border border-rule p-1.5 align-top ${buiten ? "bg-canvas text-ink-muted" : ""}`}>
                      <span className={`inline-block min-w-6 px-1 text-center text-sm ${d === vandaag ? "bg-donker font-bold text-white" : ""}`}>
                        {Number(d.slice(8))}
                        {d === vandaag && <span className="sr-only"> (vandaag)</span>}
                      </span>
                      {dubbel.has(d) && (
                        <div className="mt-1">
                          <ConflictLabel />
                        </div>
                      )}
                      <ul className="mt-1 space-y-1">
                        {klussen.map((k) => (
                          <li key={k.id}>
                            <Link href={`/klussen/${k.id}`} className="block min-h-6 border-l-4 border-groen-donker bg-laag px-1.5 py-0.5 text-sm leading-snug no-underline hover:underline [overflow-wrap:anywhere]">
                              {k.titel}
                              {k.status !== "bevestigd" && <span className="block text-xs font-semibold">{k.status === "optie" ? "Optie" : k.status === "afgerond" ? "Afgerond" : "Geannuleerd"}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* List: also shown on large screens under the grid for reading out. */}
      <section aria-label="Lijst van klussen" className="mt-6">
        {docs.length === 0 ? (
          <LegeStaat titel="Niets deze maand">Een bevestigde aanvraag wordt met één knop een klus en staat dan hier. Blader met de pijlen naar een andere maand.</LegeStaat>
        ) : (
          <ul className="paneel divide-y divide-rule">
            {docs.map((k) => (
              <li key={k.id}>
                <Link href={`/klussen/${k.id}`} className="rij-link">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block text-sm text-ink-muted first-letter:uppercase">{datumLang(k.datum)}</span>
                    <span className="block font-semibold [overflow-wrap:anywhere]">{k.titel}</span>
                    {(k.aankomst || k.gasten) && (
                      <span className="block text-sm text-ink-muted">{[k.aankomst && `Aankomst ${k.aankomst}`, k.gasten && `${k.gasten} gasten`].filter(Boolean).join(", ")}</span>
                    )}
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    {dubbel.has(isoNaarDag(k.datum)) && <ConflictLabel />}
                    <KlusLabel status={k.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
