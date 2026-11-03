import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { heeftRol } from "@/access";
import { Verwijderen } from "@/components/Formulier";
import { Label, LegeStaat, PaginaKop, Paneel } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, kortDatum, nederlandseDatum } from "@/lib/datum";
import { gebruikerRollen, labelVan, teamRollen } from "@/lib/opties";
import { Ban, Check } from "lucide-react";
import { verwijderGebruiker } from "./actions";
import { NieuwWachtwoord, NieuweInlog } from "./Inloggen";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPagina() {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const toegang = { user, overrideAccess: false } as const;
  const beheerder = heeftRol(user, "superadmin", "eigenaar");
  const vandaag = dagNaarIso(nederlandseDatum());
  const [team, gebruikers, klussen] = await Promise.all([
    payload.find({ collection: "team", sort: "naam", limit: 100, depth: 0, ...toegang }),
    beheerder ? payload.find({ collection: "users", sort: "naam", limit: 50, depth: 0, ...toegang }) : Promise.resolve({ docs: [] }),
    payload.find({ collection: "klussen", where: { datum: { greater_than_equal: vandaag } }, sort: "datum", limit: 50, depth: 0, ...toegang }),
  ]);
  const rollen = gebruikerRollen.filter((r) => r.value !== "superadmin" || heeftRol(user, "superadmin")).map((r) => ({ value: r.value, label: r.label }));

  const volgendeKlus = (id: number) => klussen.docs.find((k) => (k.crew ?? []).some((c) => (typeof c === "object" ? c.id : c) === id));

  return (
    <>
      <PaginaKop
        titel="Team"
        info="Wie er meegaat op de bus. Teamleden zet je bij een klus onder Planning. Een teamlid heeft niet per se een inlog: die maak je apart hieronder."
        actie={
          <Link href="/bus/team/nieuw" className="knop knop-primair">
            <Plus aria-hidden size={18} /> Teamlid toevoegen
          </Link>
        }
      />
      {team.docs.length === 0 ? (
        <LegeStaat titel="Nog geen team">Zet hier de mensen die meegaan: kok, bediening, chauffeur. Daarna kun je ze per klus inplannen.</LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {team.docs.map((t) => {
            const volgende = volgendeKlus(t.id);
            return (
              <li key={t.id}>
                <Link href={`/bus/team/${t.id}`} className="rij-link">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block font-semibold">{t.naam}</span>
                    <span className="block text-sm text-ink-muted">
                      {labelVan(teamRollen, t.rol)}
                      {t.telefoon ? `, ${t.telefoon}` : ""}
                    </span>
                    {volgende && <span className="block text-sm">Volgende klus: {kortDatum(volgende.datum)}, {volgende.titel}</span>}
                  </span>
                  {t.actief ? (
                    <Label toon="goed" icoon={Check}>
                      Actief
                    </Label>
                  ) : (
                    <Label toon="uit" icoon={Ban}>
                      Niet actief
                    </Label>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {beheerder && (
        <Paneel id="inloggen-kop" titel="Wie kan inloggen" className="mt-6">
          <ul className="divide-y divide-rule">
            {gebruikers.docs.map((g) => (
              <li key={g.id} className="flex flex-wrap items-start gap-x-4 gap-y-1 px-4 py-3">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="font-semibold">
                    {g.naam}
                    {g.id === user.id && <span className="font-normal text-ink-muted"> (jij)</span>}
                  </p>
                  <p className="text-sm text-ink-muted [overflow-wrap:anywhere]">
                    {g.email}, {labelVan(gebruikerRollen, g.rol)}
                  </p>
                  <NieuwWachtwoord id={g.id} naam={g.naam} />
                </div>
                {g.id !== user.id && <Verwijderen actie={verwijderGebruiker} id={g.id} wat="Inlog" naam={g.naam} klein />}
              </li>
            ))}
          </ul>
          <details className="border-t-[1.5px] border-donker">
            <summary className="flex min-h-doel cursor-pointer list-none items-center gap-2 px-4 py-2 font-semibold hover:bg-canvas [&::-webkit-details-marker]:hidden">
              <Plus aria-hidden size={18} /> Inlog toevoegen
            </summary>
            <div className="border-t border-rule p-4">
              <NieuweInlog rollen={rollen} />
            </div>
          </details>
        </Paneel>
      )}
    </>
  );
}
