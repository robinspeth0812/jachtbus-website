"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AutoVelden } from "@/components/AutoVelden";
import { Formulier, useMarkeerGewijzigd } from "@/components/Formulier";
import type { FormStatus } from "@/lib/formulier";
import { prijs, regelBedrag, totalen, type OfferteRegel } from "@/lib/offerte";
import { btwTarieven } from "@/lib/opties";
import { offerteKopVelden } from "@/lib/velddefs";
import type { Keuzes } from "@/lib/velden";

type Rij = { sleutel: number; omschrijving: string; aantal: string; prijs: string; btw: string };
type Actie = (v: FormStatus, fd: FormData) => Promise<FormStatus>;

const getal = (s: string) => Number(s.replace(",", ".")) || 0;

/** Head fields plus rows with a live total. Prices stay in the portal: no public API reads them. */
export function OfferteFormulier({
  actie,
  doc,
  regels,
  keuzes,
  aanvraag,
}: {
  actie: Actie;
  doc?: Record<string, unknown> | null;
  regels?: readonly OfferteRegel[] | null;
  keuzes: Keuzes;
  aanvraag?: number;
}) {
  return (
    <div className="paneel px-4 pt-4">
      <Formulier actie={actie} knop="Offerte opslaan">
        {(s) => (
          <>
            {aanvraag && <input type="hidden" name="aanvraag" value={aanvraag} />}
            <AutoVelden defs={offerteKopVelden} status={s} doc={doc} keuzes={keuzes} />
            <Regels begin={regels} status={s} />
          </>
        )}
      </Formulier>
    </div>
  );
}

function Regels({ begin, status }: { begin?: readonly OfferteRegel[] | null; status: FormStatus }) {
  const teller = useRef(0);
  const markeer = useMarkeerGewijzigd();
  const leeg = (): Rij => ({ sleutel: teller.current++, omschrijving: "", aantal: "", prijs: "", btw: "9" });
  const [rijen, setRijen] = useState<Rij[]>(() =>
    begin?.length
      ? begin.map((r) => ({ sleutel: teller.current++, omschrijving: r.omschrijving ?? "", aantal: r.aantal?.toString() ?? "", prijs: r.prijs?.toString() ?? "", btw: r.btw ?? "9" }))
      : [leeg()],
  );
  const zet = (i: number, veld: keyof Rij, waarde: string) => setRijen((r) => r.map((x, j) => (j === i ? { ...x, [veld]: waarde } : x)));
  const wissel = (i: number, naar: number) => {
    markeer();
    setRijen((r) => {
      const k = [...r];
      [k[i], k[naar]] = [k[naar], k[i]];
      return k;
    });
  };
  const als = useMemo(() => rijen.map((r) => ({ aantal: getal(r.aantal), prijs: getal(r.prijs), btw: r.btw })), [rijen]);
  const t = totalen(als);

  return (
    <div className="border-t border-rule pt-5">
      <h2 className="text-lg font-semibold">Regels</h2>
      <p className="hulptekst mt-0.5">Prijzen zijn exclusief btw. Eten is meestal 9%, drank met alcohol 21%. Twijfel je, vraag het je boekhouder.</p>
      <ol className="mt-3 space-y-3">
        {rijen.map((r, i) => {
          const fout = (k: string) => status.velden?.[`regels.${i}.${k}`];
          return (
            <li key={r.sleutel} className="grid gap-3 border-b border-rule pb-3 sm:grid-cols-[minmax(0,1fr)_6rem_7rem_6rem] lg:grid-cols-[minmax(0,1fr)_6rem_7rem_6rem_7rem_auto]">
              <div>
                <label htmlFor={`o-${r.sleutel}`} className="mb-1 block text-sm font-semibold">
                  Omschrijving
                </label>
                <input id={`o-${r.sleutel}`} name={`regels.${i}.omschrijving`} className="veld" maxLength={240} value={r.omschrijving} onChange={(e) => zet(i, "omschrijving", e.target.value)} />
              </div>
              <div>
                <label htmlFor={`a-${r.sleutel}`} className="mb-1 block text-sm font-semibold">
                  Aantal
                </label>
                <input id={`a-${r.sleutel}`} name={`regels.${i}.aantal`} inputMode="decimal" className="veld" aria-invalid={fout("aantal") ? true : undefined} value={r.aantal} onChange={(e) => zet(i, "aantal", e.target.value)} />
                {fout("aantal") && <span className="mt-1 block text-sm font-semibold text-fout">{fout("aantal")}</span>}
              </div>
              <div>
                <label htmlFor={`p-${r.sleutel}`} className="mb-1 block text-sm font-semibold">
                  Prijs
                </label>
                <input id={`p-${r.sleutel}`} name={`regels.${i}.prijs`} inputMode="decimal" className="veld" aria-invalid={fout("prijs") ? true : undefined} value={r.prijs} onChange={(e) => zet(i, "prijs", e.target.value)} />
                {fout("prijs") && <span className="mt-1 block text-sm font-semibold text-fout">{fout("prijs")}</span>}
              </div>
              <div>
                <label htmlFor={`b-${r.sleutel}`} className="mb-1 block text-sm font-semibold">
                  Btw
                </label>
                <select id={`b-${r.sleutel}`} name={`regels.${i}.btw`} className="veld" value={r.btw} onChange={(e) => zet(i, "btw", e.target.value)}>
                  {btwTarieven.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="flex min-h-doel items-end justify-between gap-2 lg:block lg:text-right">
                <span className="mb-1 block text-sm font-semibold">Bedrag</span>
                <span className="block lg:leading-[2.75rem]">{prijs(regelBedrag(als[i]))}</span>
              </p>
              <div className="flex items-end gap-1">
                <button type="button" disabled={i === 0} onClick={() => wissel(i, i - 1)} aria-label={`Regel ${i + 1} hoger`} className="inline-flex size-doel items-center justify-center hover:bg-laag disabled:opacity-40">
                  <ArrowUp aria-hidden size={18} />
                </button>
                <button type="button" disabled={i === rijen.length - 1} onClick={() => wissel(i, i + 1)} aria-label={`Regel ${i + 1} lager`} className="inline-flex size-doel items-center justify-center hover:bg-laag disabled:opacity-40">
                  <ArrowDown aria-hidden size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    markeer();
                    setRijen((x) => x.filter((_, j) => j !== i));
                  }}
                  aria-label={`Regel ${i + 1} weghalen`}
                  className="inline-flex size-doel items-center justify-center text-ink-muted hover:bg-fout-bg hover:text-fout"
                >
                  <Trash2 aria-hidden size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        className="knop knop-secundair mt-3"
        onClick={() => {
          markeer();
          setRijen((r) => [...r, leeg()]);
        }}
      >
        <Plus aria-hidden size={18} /> Regel toevoegen
      </button>
      <dl className="mt-5 ml-auto max-w-xs space-y-1">
        <div className="flex justify-between gap-4">
          <dt>Totaal exclusief btw</dt>
          <dd>{prijs(t.excl)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Btw 9%</dt>
          <dd>{prijs(t.btw9)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Btw 21%</dt>
          <dd>{prijs(t.btw21)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t-[1.5px] border-donker pt-1 font-bold">
          <dt>Totaal</dt>
          <dd>{prijs(t.totaal)}</dd>
        </div>
      </dl>
    </div>
  );
}
