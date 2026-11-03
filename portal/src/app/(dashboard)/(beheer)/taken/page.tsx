import type { Metadata } from "next";
import { TaakRegel, termijnVan } from "@/components/Taak";
import { Groep, LegeStaat, PaginaKop, TabLinks } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagPlus, nederlandseDatum } from "@/lib/datum";
import { NieuweTaak } from "./NieuweTaak";

export const metadata: Metadata = { title: "Taken" };

export default async function TakenPagina({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const { tab } = await searchParams;
  const klaar = tab === "klaar";
  const toegang = { user, overrideAccess: false } as const;

  const [lijst, aantalOpen, mensen] = await Promise.all([
    payload.find({
      collection: "taken",
      where: { klaar: { equals: klaar } },
      sort: klaar ? "-klaarOp" : "vervalt",
      limit: klaar ? 50 : 200,
      depth: 1,
      ...toegang,
    }),
    payload.count({ collection: "taken", where: { klaar: { equals: false } }, ...toegang }),
    payload.find({ collection: "users", sort: "naam", limit: 50, depth: 0, ...toegang }),
  ]);

  const groepen = [
    { sleutel: "te-laat", kop: "Te laat", docs: lijst.docs.filter((t) => termijnVan(t.vervalt) === "te-laat") },
    { sleutel: "vandaag", kop: "Vandaag", docs: lijst.docs.filter((t) => termijnVan(t.vervalt) === "vandaag") },
    { sleutel: "later", kop: "Later", docs: lijst.docs.filter((t) => termijnVan(t.vervalt) === "later") },
  ].filter((g) => g.docs.length > 0);

  return (
    <>
      <PaginaKop
        titel="Taken"
        info="Taken komen vanzelf: reageren op een aanvraag, nabellen over een offerte, een keuring die eraan komt. Een taak die te laat is krijg je één keer per mail. Zelf iets toevoegen kan ook."
      />
      <TabLinks
        label="Soort taken"
        tabs={[
          { href: "/taken", label: "Open", actief: !klaar, aantal: aantalOpen.totalDocs },
          { href: "/taken?tab=klaar", label: "Klaar", actief: klaar },
        ]}
      />
      {!klaar && (
        <NieuweTaak mensen={mensen.docs.map((m) => ({ value: String(m.id), label: m.naam }))} standaardDag={dagPlus(nederlandseDatum(), 1)} />
      )}
      {klaar ? (
        lijst.docs.length === 0 ? (
          <LegeStaat titel="Nog niets afgevinkt">Wat je afvinkt komt hier te staan. Zo kun je terugkijken, of iets terugzetten als het toch nog niet klaar was.</LegeStaat>
        ) : (
          <ul className="paneel divide-y divide-rule">
            {lijst.docs.map((t) => (
              <TaakRegel key={t.id} taak={t} />
            ))}
          </ul>
        )
      ) : groepen.length === 0 ? (
        <LegeStaat titel="Lijst is leeg">Mooi zo. Komt er een aanvraag binnen of nadert een keuring, dan zie je de taak hier.</LegeStaat>
      ) : (
        <div className="space-y-4">
          {groepen.map((g) => (
            <Groep key={g.sleutel} open kop={<span className="flex-1 font-semibold">{g.kop}</span>} aantal={g.docs.length} wat="taken">
              <ul className="divide-y divide-rule">
                {g.docs.map((t) => (
                  <TaakRegel key={t.id} taak={t} />
                ))}
              </ul>
            </Groep>
          ))}
        </div>
      )}
    </>
  );
}
