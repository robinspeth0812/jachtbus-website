"use client";

import { useTransition } from "react";
import { Formulier, Veld } from "@/components/Formulier";
import type { AanvraagFase } from "@/lib/opties";
import { bewaarNotities, zetFase } from "../actions";

/** Plain select: works the same by keyboard, screen reader and thumb. */
export function FaseKeuze({ id, fase, fasen }: { id: number; fase: AanvraagFase; fasen: { value: AanvraagFase; label: string }[] }) {
  const [bezig, start] = useTransition();
  return (
    <div>
      <label htmlFor="fase" className="label">
        Verplaats naar
      </label>
      <select id="fase" className="veld" value={fase} disabled={bezig} onChange={(e) => start(() => zetFase(id, e.target.value as AanvraagFase))}>
        {fasen.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <span className="hulptekst">De taak die hierbij hoort komt vanzelf op je lijst.</span>
    </div>
  );
}

export function NotitieVeld({ id, waarde }: { id: number; waarde: string }) {
  return (
    <Formulier actie={bewaarNotities} knop="Notitie bewaren" plakkend={false}>
      {(s) => (
        <>
          <input type="hidden" name="id" value={id} />
          <Veld naam="notities" label="Alleen voor jullie" status={s} kaal>
            {(p) => <textarea {...p} rows={5} maxLength={4000} defaultValue={waarde} />}
          </Veld>
        </>
      )}
    </Formulier>
  );
}
