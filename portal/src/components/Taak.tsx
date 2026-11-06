import { AlertCircle, Check, Clock3, RotateCcw, User } from "lucide-react";
import Link from "next/link";
import { verwijderTaak, zetTaakKlaar } from "@/app/(dashboard)/(beheer)/taken/actions";
import { momentTekst, nederlandseDatum } from "@/lib/datum";
import type { Taken } from "@/payload-types";
import { ActieKnop } from "./ActieKnop";
import { Verwijderen } from "./Formulier";

export type Termijn = "te-laat" | "vandaag" | "later";

export function termijnVan(vervalt: string, nu = new Date()): Termijn {
  const d = new Date(vervalt);
  if (d.getTime() <= nu.getTime()) return "te-laat";
  return nederlandseDatum(d) === nederlandseDatum(nu) ? "vandaag" : "later";
}

/** When, with colour + word + icon when late. */
export function Termijnlabel({ vervalt }: { vervalt: string }) {
  return termijnVan(vervalt) === "te-laat" ? (
    <span className="inline-flex items-center gap-1 font-semibold text-fout">
      <AlertCircle aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
      Te laat, sinds {momentTekst(vervalt)}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-ink-muted">
      <Clock3 aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
      {momentTekst(vervalt)}
    </span>
  );
}

/** One task: title, deadline, where it belongs, and ticking off. */
export function TaakRegel({ taak }: { taak: Taken }) {
  const aanvraag = typeof taak.aanvraag === "object" ? taak.aanvraag : null;
  const klus = typeof taak.klus === "object" ? taak.klus : null;
  const keuring = typeof taak.keuring === "object" ? taak.keuring : null;
  const voor = typeof taak.voor === "object" ? taak.voor : null;
  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-3">
      <div className="min-w-0 flex-1 basis-56">
        <p className={`font-semibold [overflow-wrap:anywhere] ${taak.klaar ? "font-normal text-ink-muted line-through" : ""}`}>{taak.titel}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm">
          {taak.klaar ? (
            <span className="inline-flex items-center gap-1 text-st-goed">
              <Check aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
              Klaar
            </span>
          ) : (
            <Termijnlabel vervalt={taak.vervalt} />
          )}
          {aanvraag && (
            <Link href={`/aanvragen/${aanvraag.id}`} className="inline-flex min-h-doel items-center underline">
              Aanvraag van {aanvraag.naam}
            </Link>
          )}
          {klus && (
            <Link href={`/klussen/${klus.id}`} className="inline-flex min-h-doel items-center underline">
              {klus.titel}
            </Link>
          )}
          {keuring && (
            <Link href={`/bus/keuringen/${keuring.id}`} className="inline-flex min-h-doel items-center underline">
              {keuring.naam}
            </Link>
          )}
          {voor && (
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <User aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
              Voor {voor.naam}
            </span>
          )}
        </p>
        {taak.omschrijving && !taak.klaar && <p className="mt-1 max-w-prose text-sm whitespace-pre-line text-ink-muted [overflow-wrap:anywhere]">{taak.omschrijving}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {taak.klaar ? (
          <ActieKnop actie={zetTaakKlaar} velden={{ id: taak.id, klaar: 0 }} voor={taak.titel}>
            <RotateCcw aria-hidden size={16} /> Terugzetten
          </ActieKnop>
        ) : (
          <ActieKnop actie={zetTaakKlaar} velden={{ id: taak.id, klaar: 1 }} voor={taak.titel}>
            <Check aria-hidden size={16} /> Klaar
          </ActieKnop>
        )}
        {taak.soort === "eigen" && <Verwijderen actie={verwijderTaak} id={taak.id} wat="Taak" naam={taak.titel} klein />}
      </div>
    </li>
  );
}
