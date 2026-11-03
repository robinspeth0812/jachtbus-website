"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormStatus } from "@/lib/formulier";
import { beginwaarde, type HerhaalDef, type HerhaalKolom } from "@/lib/velden";
import { breedteKlasse, useMarkeerGewijzigd } from "./Formulier";

type Rij = { sleutel: number; waarden: Record<string, unknown> };

/**
 * Repeating rows with Up, Down and Remove buttons. Moving is by button on
 * purpose, so it works the same by keyboard and on a phone (WCAG 2.5.7).
 */
export function Herhaal({ def, begin, status }: { def: HerhaalDef; begin?: readonly Record<string, unknown>[] | null; status: FormStatus }) {
  const teller = useRef(0);
  const nieuweRij = (waarden: Record<string, unknown> = {}): Rij => ({ sleutel: teller.current++, waarden });
  const [rijen, setRijen] = useState<Rij[]>(() => (begin ?? []).map((w) => nieuweRij(w)));
  const markeer = useMarkeerGewijzigd();
  const ref = useRef<HTMLDivElement>(null);
  const vorige = useRef(rijen);
  const focusOp = useRef<number | null>(null);

  // Row changes give no input event of their own; totals listen to this one.
  useEffect(() => {
    // Compare instead of a first-run flag: StrictMode runs effects twice on mount.
    if (vorige.current === rijen) return;
    vorige.current = rijen;
    ref.current?.dispatchEvent(new Event("input", { bubbles: true }));
    if (focusOp.current !== null) {
      ref.current?.querySelector<HTMLElement>(`[data-rij="${focusOp.current}"] input, [data-rij="${focusOp.current}"] select`)?.focus();
      focusOp.current = null;
    }
  }, [rijen]);

  const wissel = (i: number, naar: number) => {
    markeer();
    setRijen((r) => {
      const kopie = [...r];
      [kopie[i], kopie[naar]] = [kopie[naar], kopie[i]];
      return kopie;
    });
  };

  return (
    <div ref={ref} className="w-full">
      <h2 className="text-lg font-semibold">{def.label}</h2>
      {def.hulp && <p className="hulptekst mt-0.5 max-w-prose">{def.hulp}</p>}
      <ol className="mt-3 space-y-3">
        {rijen.map((rij, i) => (
          <li key={rij.sleutel} data-rij={rij.sleutel} className="flex flex-wrap items-start gap-3 border-b border-rule pb-3">
            {def.kolommen.map((k) => (
              <Cel key={k.naam} def={def} k={k} index={i} rij={rij} status={status} />
            ))}
            <div className="flex items-center gap-1 self-end">
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
                  setRijen((r) => r.filter((x) => x.sleutel !== rij.sleutel));
                }}
                aria-label={`Regel ${i + 1} weghalen`}
                className="inline-flex size-doel items-center justify-center text-ink-muted hover:bg-fout-bg hover:text-fout"
              >
                <Trash2 aria-hidden size={18} />
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="knop knop-secundair mt-3"
        onClick={() => {
          markeer();
          const rij = nieuweRij();
          focusOp.current = rij.sleutel;
          setRijen((r) => [...r, rij]);
        }}
      >
        <Plus aria-hidden size={18} /> {def.knop}
      </button>
    </div>
  );
}

function Cel({ def, k, index, rij, status }: { def: HerhaalDef; k: HerhaalKolom; index: number; rij: Rij; status: FormStatus }) {
  const naam = `${def.naam}.${index}.${k.naam}`;
  const id = `${def.naam}-${rij.sleutel}-${k.naam}`;
  const fout = status.velden?.[naam];
  const waarde = beginwaarde(rij.waarden, k) as string;
  const p = { id, name: naam, className: "veld", "aria-invalid": fout ? true : undefined } as const;
  return (
    <div className={k.breedte ? breedteKlasse[k.breedte] : "w-full max-w-md"}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {k.label}
      </label>
      {k.soort === "keuze" ? (
        <select {...p} defaultValue={waarde || k.opties?.[0]?.value}>
          {k.opties?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : k.soort === "tijd" ? (
        <input {...p} type="time" defaultValue={waarde} />
      ) : k.soort === "datum" ? (
        <input {...p} type="date" defaultValue={waarde} />
      ) : k.soort === "getal" ? (
        <input {...p} type="text" inputMode="decimal" defaultValue={waarde} placeholder={k.voorbeeld} />
      ) : (
        <input {...p} type="text" maxLength={k.max} defaultValue={waarde} placeholder={k.voorbeeld} />
      )}
      {fout && <span className="mt-1 block text-sm font-semibold text-fout">{fout}</span>}
    </div>
  );
}
