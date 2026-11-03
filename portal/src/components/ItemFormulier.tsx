"use client";

import type React from "react";
import type { FormStatus } from "@/lib/formulier";
import type { HerhaalDef, Keuzes, VeldDef } from "@/lib/velden";
import { AutoVelden } from "./AutoVelden";
import { Formulier } from "./Formulier";
import { Herhaal } from "./Herhaal";

/** The standard form: fields from definitions, optional repeating rows, one save button. */
export function ItemFormulier({
  actie,
  defs,
  herhalingen,
  doc,
  keuzes,
  knop = "Opslaan",
  verborgen,
  extra,
}: {
  actie: (vorige: FormStatus, formData: FormData) => Promise<FormStatus>;
  defs: readonly VeldDef[];
  herhalingen?: readonly HerhaalDef[];
  doc?: Record<string, unknown> | null;
  keuzes?: Keuzes;
  knop?: string;
  verborgen?: Record<string, string | number>;
  extra?: React.ReactNode;
}) {
  return (
    <div className="paneel px-4 pt-4">
      <Formulier actie={actie} knop={knop}>
        {(s) => (
          <>
            {Object.entries(verborgen ?? {}).map(([naam, waarde]) => (
              <input key={naam} type="hidden" name={naam} value={waarde} />
            ))}
            {defs.length > 0 && <AutoVelden defs={defs} status={s} doc={doc} keuzes={keuzes} />}
            {herhalingen?.map((h) => (
              <div key={h.naam} className={defs.length > 0 ? "border-t border-rule pt-5" : ""}>
                <Herhaal def={h} begin={doc?.[h.naam] as Record<string, unknown>[] | undefined} status={s} />
              </div>
            ))}
            {extra}
          </>
        )}
      </Formulier>
    </div>
  );
}
