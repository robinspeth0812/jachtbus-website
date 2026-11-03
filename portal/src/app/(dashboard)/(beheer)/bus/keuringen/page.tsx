import { Check, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ActieKnop } from "@/components/ActieKnop";
import { KeuringLabel, LegeStaat, PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { datum } from "@/lib/datum";
import { keuringStand } from "@/lib/keuringStand";
import { keuringSoorten, labelVan } from "@/lib/opties";
import { keuringGedaan } from "./actions";

export const metadata: Metadata = { title: "Keuringen en onderhoud" };

export default async function KeuringenPagina() {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "keuringen", sort: "vervalt", limit: 100, depth: 0, user, overrideAccess: false });
  return (
    <>
      <PaginaKop
        titel="Keuringen en onderhoud"
        info="Alles wat op tijd moet: APK, gas, blussers, elektra, verzekering. Komt een datum in zicht, dan staat er vanzelf een taak op je lijst. Klik op Gedaan en de volgende datum staat klaar."
        actie={
          <Link href="/bus/keuringen/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Keuring toevoegen
          </Link>
        }
      />
      {docs.length === 0 ? (
        <LegeStaat
          titel="Nog niets ingepland"
          actie={
            <Link href="/bus/keuringen/nieuw" className="knop knop-secundair">
              Keuring toevoegen
            </Link>
          }
        >
          Zet hier de APK, gaskeuring, brandblussers, elektra (NEN 3140), HACCP-documenten en verzekering, met de datum waarop ze klaar moeten zijn. Dan hoef je er zelf niet meer aan te denken.
        </LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {docs.map((k) => {
            const { stand, dagen } = keuringStand(k.vervalt, k.herinnerDagen ?? 30);
            return (
              <li key={k.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                <Link href={`/bus/keuringen/${k.id}`} className="min-w-0 flex-1 basis-56 no-underline hover:underline">
                  <span className="block font-semibold [overflow-wrap:anywhere]">{k.naam}</span>
                  <span className="block text-sm text-ink-muted">
                    {labelVan(keuringSoorten, k.soort)}, klaar op {datum(k.vervalt)}
                    {k.uitvoerder ? `, ${k.uitvoerder}` : ""}
                  </span>
                </Link>
                <KeuringLabel stand={stand} dagen={dagen} />
                <ActieKnop actie={keuringGedaan} velden={{ id: k.id }} voor={k.naam}>
                  <Check aria-hidden size={16} /> Gedaan
                </ActieKnop>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
