"use client";

import { Trash2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { ActieKnop } from "@/components/ActieKnop";
import { haalBoodschapWeg, zetBoodschap } from "./actions";

export type Boodschap = { id: string; naam: string; hoeveelheid: number | null; eenheid: string | null; gedaan: boolean };

/** Big tick targets for use in the wholesale aisle, one hand on the trolley. */
export function Boodschappenlijst({ klusId, regels }: { klusId: number; regels: Boodschap[] }) {
  const [lijst, zet] = useOptimistic(regels, (huidig, { id, gedaan }: { id: string; gedaan: boolean }) => huidig.map((r) => (r.id === id ? { ...r, gedaan } : r)));
  const [, start] = useTransition();
  const open = lijst.filter((r) => !r.gedaan).length;

  return (
    <div className="paneel">
      <p className="paneel-kop" role="status">
        <span className="paneel-titel">{open === 0 ? "Alles gehaald" : `Nog ${open} van ${lijst.length} te halen`}</span>
      </p>
      <ul className="divide-y divide-rule">
        {lijst.map((r) => (
          <li key={r.id} className="flex items-center gap-2 pr-2">
            <label className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4 py-2">
              <input
                type="checkbox"
                className="size-6 shrink-0"
                checked={r.gedaan}
                onChange={(e) => {
                  const gedaan = e.target.checked;
                  start(async () => {
                    zet({ id: r.id, gedaan });
                    await zetBoodschap(klusId, r.id, gedaan);
                  });
                }}
              />
              <span className={`min-w-0 flex-1 [overflow-wrap:anywhere] ${r.gedaan ? "text-ink-muted line-through" : "font-medium"}`}>{r.naam}</span>
              {r.hoeveelheid !== null && (
                <span className={`shrink-0 ${r.gedaan ? "text-ink-muted" : ""}`}>
                  {r.hoeveelheid.toLocaleString("nl-NL")} {r.eenheid}
                </span>
              )}
            </label>
            <ActieKnop
              actie={haalBoodschapWeg}
              velden={{ id: klusId, regel: r.id }}
              voor={`${r.naam} van de lijst halen`}
              klasse="inline-flex size-doel items-center justify-center text-ink-muted hover:bg-fout-bg hover:text-fout"
            >
              <Trash2 aria-hidden size={18} />
            </ActieKnop>
          </li>
        ))}
      </ul>
    </div>
  );
}
