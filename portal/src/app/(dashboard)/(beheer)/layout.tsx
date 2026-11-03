import type React from "react";
import { heeftRol } from "@/access";
import { Zijbalk } from "@/components/Zijbalk";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { dagNaarIso, nederlandseDatum } from "@/lib/datum";

// Always fresh: badges and lists show the state of now.
export const dynamic = "force-dynamic";

export default async function BeheerLayout({ children }: { children: React.ReactNode }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const toegang = { user, overrideAccess: false } as const;

  // Tickets waiting on this person: new ones for the web builder, replies for the team.
  const ticketsWaar = heeftRol(user, "superadmin") ? { status: { equals: "nieuw" } } : { status: { equals: "wacht-op-melder" } };

  const [nieuw, teDoen, teLaat, tickets, instellingen] = await Promise.all([
    payload.count({ collection: "aanvragen", where: { fase: { equals: "nieuw" } }, ...toegang }),
    payload.count({
      collection: "taken",
      where: { and: [{ klaar: { equals: false } }, { vervalt: { less_than_equal: new Date().toISOString() } }] },
      ...toegang,
    }),
    payload.count({ collection: "keuringen", where: { vervalt: { less_than: dagNaarIso(nederlandseDatum()) } }, ...toegang }),
    payload.count({ collection: "tickets", where: ticketsWaar, ...toegang }),
    payload.findGlobal({ slug: "instellingen", depth: 0, ...toegang }),
  ]);

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <Zijbalk
        gebruikersnaam={user.naam}
        nieuweAanvragen={nieuw.totalDocs}
        takenTeDoen={teDoen.totalDocs}
        keuringenTeLaat={teLaat.totalDocs}
        ticketsAanZet={tickets.totalDocs}
        beheerder={heeftRol(user, "superadmin", "eigenaar")}
        googleProfiel={instellingen.profielen?.google || null}
        instagram={instellingen.profielen?.instagram || null}
      />
      <main id="inhoud" tabIndex={-1} className="min-w-0 px-4 pt-6 pb-[calc(var(--spacing-onderbalk)+1.5rem)] focus:outline-none sm:px-6 lg:px-10 lg:py-8">
        <div className="werkruimte mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
