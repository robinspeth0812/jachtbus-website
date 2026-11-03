import { Check, MapPinned, Printer, ShoppingBasket, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActieKnop } from "@/components/ActieKnop";
import { Verwijderen } from "@/components/Formulier";
import { ItemFormulier } from "@/components/ItemFormulier";
import { ConflictLabel, Gegevens, KlusLabel, Melding, PaginaKop, Paneel, TabLinks, Waarschuwing } from "@/components/ui";
import { bezetOpDag } from "@/lib/agenda";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { BEDRIJF } from "@/lib/bedrijf";
import { datumLang, isoNaarDag } from "@/lib/datum";
import { laadKeuzes } from "@/lib/keuzes";
import { boodschapDef, draaiboekDef, klusLocatieVelden, klusNaAfloopVelden, klusPlanningVelden } from "@/lib/velddefs";
import { bewaarDraaiboek, bewaarKlus, maakBoodschappen, verwijderKlus, voegBoodschappenToe } from "../actions";
import { Boodschappenlijst } from "../Boodschappenlijst";

export const metadata: Metadata = { title: "Klus" };

const TABS = [
  { sleutel: "planning", label: "Planning" },
  { sleutel: "locatie", label: "Locatie" },
  { sleutel: "draaiboek", label: "Draaiboek" },
  { sleutel: "boodschappen", label: "Boodschappen" },
  { sleutel: "naafloop", label: "Na afloop" },
];

export default async function KlusDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; fout?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const { tab: gevraagd, fout } = await searchParams;
  const tab = TABS.some((t) => t.sleutel === gevraagd) ? gevraagd! : "planning";
  const k = await payload.findByID({ collection: "klussen", id, depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!k) notFound();
  const doc = k as unknown as Record<string, unknown>;

  const bezet = await payload.find({ collection: "klussen", where: bezetOpDag(isoNaarDag(k.datum)), depth: 0, limit: 5, user, overrideAccess: false });
  const anderen = bezet.docs.filter((x) => x.id !== k.id);
  const conflict = anderen.length > 0 && (k.status === "optie" || k.status === "bevestigd");
  const klant = typeof k.klant === "object" ? k.klant : null;
  const arrangement = typeof k.arrangement === "object" ? k.arrangement : null;
  const crew = (k.crew ?? []).flatMap((c) => (typeof c === "object" ? [c] : []));

  const check = [k.chkRuimte, k.chkOndergrond, k.chkToegang, k.chkStroom, k.chkWeerplan];
  const checkOpen = check.filter((c) => !c).length;
  const route = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${BEDRIJF.adres}, ${BEDRIJF.plaats}`)}&destination=${encodeURIComponent([k.adres, k.plaats].filter(Boolean).join(", "))}`;
  const keuzes = tab === "planning" ? await laadKeuzes(payload, user, ["klanten", "arrangementen", "team"]) : tab === "naafloop" ? await laadKeuzes(payload, user, ["media"]) : {};

  return (
    <>
      <PaginaKop
        titel={k.titel}
        status={
          <span className="flex flex-wrap gap-2">
            <KlusLabel status={k.status} />
            {conflict && <ConflictLabel />}
          </span>
        }
        terug={{ href: "/klussen", label: "Klussen" }}
      />

      {conflict && (
        <div className="mb-4">
          <Waarschuwing soort="fout" titel="De bus staat die dag ook hier">
            <ul>
              {anderen.map((a) => (
                <li key={a.id}>
                  <Link href={`/klussen/${a.id}`} className="underline">
                    {a.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </Waarschuwing>
        </div>
      )}

      <Paneel id="samenvatting-kop" titel="In het kort" className="mb-6">
        <Gegevens
          rijen={[
            ["Wanneer", <span key="w" className="first-letter:uppercase">{datumLang(k.datum)}{k.aankomst ? `, aankomst ${k.aankomst}` : ""}{k.serveren ? `, serveren ${k.serveren}` : ""}</span>],
            ["Klant", klant ? <Link key="k" href={`/klanten/${klant.id}`} className="underline">{klant.naam}{klant.telefoon ? `, ${klant.telefoon}` : ""}</Link> : null],
            ["Gasten en eten", [k.gasten && `${k.gasten} gasten`, arrangement?.titel].filter(Boolean).join(", ")],
            ["Team", crew.map((c) => c.naam).join(", ")],
            ["Locatiecheck", checkOpen === 0 ? <span key="c" className="inline-flex items-center gap-1 font-semibold text-st-goed"><Check aria-hidden size={16} /> Alles nagelopen</span> : <span key="c" className="inline-flex items-center gap-1 font-semibold text-st-let"><X aria-hidden size={16} /> Nog {checkOpen} van 5 open</span>],
          ]}
        />
      </Paneel>

      <TabLinks label="Onderdelen van de klus" tabs={TABS.map((t) => ({ href: `/klussen/${id}?tab=${t.sleutel}`, label: t.label, actief: t.sleutel === tab }))} />

      {tab === "planning" && <ItemFormulier key="planning" actie={bewaarKlus.bind(null, id, "planning")} defs={klusPlanningVelden} doc={doc} keuzes={keuzes} />}

      {tab === "locatie" && (
        <div className="space-y-4">
          {(k.adres || k.plaats) && (
            <a href={route} target="_blank" rel="noreferrer" className="knop knop-secundair">
              <MapPinned aria-hidden size={18} /> Route vanaf {BEDRIJF.vertrekpunt}
            </a>
          )}
          <ItemFormulier key="locatie" actie={bewaarKlus.bind(null, id, "locatie")} defs={klusLocatieVelden} doc={doc} />
        </div>
      )}

      {tab === "draaiboek" && <ItemFormulier key="draaiboek" actie={bewaarDraaiboek.bind(null, id)} defs={[]} herhalingen={[draaiboekDef]} doc={doc} knop="Draaiboek opslaan" />}

      {tab === "boodschappen" && (
        <div className="space-y-6">
          {fout === "basis" && <Melding soort="fout">Kies eerst bij Planning een arrangement en vul het aantal gasten in.</Melding>}
          <div className="flex flex-wrap gap-3">
            <ActieKnop actie={maakBoodschappen} velden={{ id }} voor={k.titel} klasse="knop knop-primair">
              <ShoppingBasket aria-hidden size={18} /> Maak lijst uit arrangement
            </ActieKnop>
            {(k.boodschappen?.length ?? 0) > 0 && (
              <Link href={`/afdruk/boodschappen/${id}`} className="knop knop-secundair">
                <Printer aria-hidden size={18} /> Afdrukken
              </Link>
            )}
          </div>
          {arrangement && k.gasten ? (
            <p className="max-w-prose text-ink-muted">Rekent de ingrediënten van {arrangement.titel} om naar {k.gasten} gasten. Wat je al afvinkte of zelf toevoegde blijft staan.</p>
          ) : null}
          {(k.boodschappen?.length ?? 0) === 0 ? (
            <p className="paneel max-w-prose p-4 text-ink-muted">Nog geen boodschappen. Maak de lijst uit het arrangement, of zet er hieronder zelf iets op.</p>
          ) : (
            <Boodschappenlijst
              klusId={id}
              regels={(k.boodschappen ?? []).map((b) => ({ id: b.id ?? "", naam: b.naam, hoeveelheid: b.hoeveelheid ?? null, eenheid: b.eenheid ?? null, gedaan: Boolean(b.gedaan) }))}
            />
          )}
          <ItemFormulier actie={voegBoodschappenToe.bind(null, id)} defs={[]} herhalingen={[boodschapDef]} knop="Op de lijst zetten" />
        </div>
      )}

      {tab === "naafloop" && <ItemFormulier key="naafloop" actie={bewaarKlus.bind(null, id, "naafloop")} defs={klusNaAfloopVelden} doc={doc} keuzes={keuzes} />}

      <div className="mt-6">
        <Verwijderen actie={verwijderKlus} id={k.id} wat="Klus" naam={k.titel} extra="De taken die erbij horen gaan ook weg." />
      </div>
    </>
  );
}
