import { AlertCircle, Check, Clock3, Plug } from "lucide-react";
import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { Gegevens, Label, PaginaKop, Paneel } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { BEDRIJF } from "@/lib/bedrijf";
import { momentTekst } from "@/lib/datum";
import { bewaarInstellingen } from "./actions";
import { SiteBijwerken } from "./SiteBijwerken";
import { instellingenVelden } from "./velden";

export const metadata: Metadata = { title: "Instellingen" };

const ids = (lijst: unknown[] | null | undefined) => (lijst ?? []).map((x) => (typeof x === "object" && x ? (x as { id: number }).id : x));

export default async function Instellingen() {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const toegang = { user, overrideAccess: false, depth: 0 } as const;
  const [i, s, gebruikers] = await Promise.all([
    payload.findGlobal({ slug: "instellingen", ...toegang }),
    payload.findGlobal({ slug: "sitestatus", ...toegang }),
    payload.find({ collection: "users", sort: "naam", limit: 50, ...toegang }),
  ]);
  const doc = {
    telefoon: i.contact?.telefoon || BEDRIJF.telefoon,
    whatsapp: i.contact?.whatsapp ?? "",
    email: i.contact?.email ?? "",
    instagram: i.profielen?.instagram ?? "",
    facebook: i.profielen?.facebook ?? "",
    google: i.profielen?.google ?? "",
    aanvraagAan: ids(i.mail?.aanvraag?.aan),
    aanvraagExtra: i.mail?.aanvraag?.extra ?? "",
    herinneringAan: ids(i.mail?.herinnering?.aan),
    herinneringExtra: i.mail?.herinnering?.extra ?? "",
  };

  const gekoppeld = Boolean(process.env.SITE_BUILD_HOOK_URL);
  const wijziging = s.laatsteWijziging ? new Date(s.laatsteWijziging).getTime() : 0;
  const build = s.laatsteBuild ? new Date(s.laatsteBuild).getTime() : 0;
  const fout = s.laatsteFout ? new Date(s.laatsteFout).getTime() : 0;
  const stand = !gekoppeld ? (
    <Label toon="uit" icoon={Plug}>
      Nog niet gekoppeld
    </Label>
  ) : fout > build ? (
    <Label toon="fout" icoon={AlertCircle}>
      Bijwerken mislukt
    </Label>
  ) : wijziging > build ? (
    <Label toon="let" icoon={Clock3}>
      Wijzigingen wachten
    </Label>
  ) : (
    <Label toon="goed" icoon={Check}>
      Site is bij
    </Label>
  );

  return (
    <>
      <PaginaKop titel="Instellingen" info="Wat hier staat komt op de site, op offertes en bepaalt wie welke mail krijgt." />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ItemFormulier
          actie={bewaarInstellingen}
          defs={instellingenVelden}
          doc={doc}
          keuzes={{ gebruikers: gebruikers.docs.map((g) => ({ value: String(g.id), label: g.naam })) }}
        />
        <div className="space-y-6">
          <Paneel id="site-kop" titel="Site bijwerken">
            <div className="space-y-3 p-4">
              <p>{stand}</p>
              <p className="max-w-prose">
                {gekoppeld
                  ? "Wijzig je iets onder Website, dan wordt de site een minuut later vanzelf opnieuw gebouwd. Kan ook meteen met deze knop."
                  : "De site haalt de inhoud op als hij gebouwd wordt. De knop werkt zodra de koppeling aan staat (SITE_BUILD_HOOK_URL, zie docs/hosting.md)."}
              </p>
              <SiteBijwerken gekoppeld={gekoppeld} />
            </div>
            <div className="border-t border-rule">
              <Gegevens
                rijen={[
                  ["Laatste wijziging", s.laatsteWijziging ? momentTekst(s.laatsteWijziging) : "Nog niets gewijzigd"],
                  ["Laatste keer gebouwd", s.laatsteBuild ? momentTekst(s.laatsteBuild) : "Nog niet"],
                ]}
              />
            </div>
          </Paneel>
          <Paneel id="bedrijf-kop" titel="Bedrijfsgegevens">
            <Gegevens
              rijen={[
                ["Naam", BEDRIJF.naam],
                ["KVK", BEDRIJF.kvk],
                ["Adres", `${BEDRIJF.adres}, ${BEDRIJF.postcode} ${BEDRIJF.plaats}`],
              ]}
            />
            <p className="border-t border-rule px-4 py-3 text-sm text-ink-muted">Staan vast in het portaal. Klopt er iets niet? Maak een ticket.</p>
          </Paneel>
        </div>
      </div>
    </>
  );
}
