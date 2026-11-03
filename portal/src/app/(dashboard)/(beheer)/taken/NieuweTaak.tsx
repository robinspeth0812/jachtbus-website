"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import { Formulier, Veld } from "@/components/Formulier";
import type { Optie } from "@/lib/opties";
import { maakTaak } from "./actions";

export function NieuweTaak({ mensen, standaardDag }: { mensen: Optie[]; standaardDag: string }) {
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={details} className="paneel mb-6">
      <summary className="flex min-h-doel cursor-pointer list-none items-center gap-2 px-4 py-2 font-semibold hover:bg-canvas [&::-webkit-details-marker]:hidden">
        <Plus aria-hidden size={18} /> Eigen taak toevoegen
      </summary>
      <div className="border-t border-rule px-4 pt-4 pb-4">
        <Formulier actie={maakTaak} knop="Taak toevoegen" plakkend={false}>
          {(s) => (
            <div className="flex flex-wrap gap-4">
              <Veld naam="titel" label="Wat moet er gebeuren?" status={s} verplicht breedte="lang">
                {(p) => <input {...p} type="text" maxLength={200} />}
              </Veld>
              <Veld naam="vervalt" label="Wanneer?" status={s} verplicht breedte="datum">
                {(p) => <input {...p} type="date" defaultValue={standaardDag} />}
              </Veld>
              <Veld naam="voor" label="Voor wie?" status={s} breedte="kort" kaal>
                {(p) => (
                  <select {...p}>
                    <option value="">Iedereen</option>
                    {mensen.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                )}
              </Veld>
              <Veld naam="omschrijving" label="Toelichting" status={s} breedte="lang">
                {(p) => <textarea {...p} rows={2} maxLength={2000} />}
              </Veld>
            </div>
          )}
        </Formulier>
      </div>
    </details>
  );
}
