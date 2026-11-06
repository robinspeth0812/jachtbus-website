"use client";

import { useEffect, useRef, useState } from "react";
import { Formulier } from "@/components/Formulier";
import type { FormStatus } from "@/lib/formulier";
import { binnenNorm, meetSoorten, schoonmaakPunten, type Optie } from "@/lib/opties";
import { bewaarMeting, bewaarRonde } from "./actions";

function KlusKeuze({ klussen }: { klussen: Optie[] }) {
  return (
    <div className="max-w-md">
      <label htmlFor="klus" className="label">
        Bij welke klus? <span className="font-normal text-ink-muted">(mag leeg)</span>
      </label>
      <select id="klus" name="klus" className="veld">
        <option value="">Geen klus, bijv. in de stalling</option>
        {klussen.map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Quick to do with one thumb: tap kind, type number, save. Negative via its own button, phone keypads often lack a minus. */
export function MeetFormulier({ klussen }: { klussen: Optie[] }) {
  return (
    <div className="paneel px-4 pt-4">
      <Formulier actie={bewaarMeting} knop="Meting bewaren">
        {(s) => <MeetVelden status={s} klussen={klussen} />}
      </Formulier>
    </div>
  );
}

function MeetVelden({ status, klussen }: { status: FormStatus; klussen: Optie[] }) {
  const [soort, setSoort] = useState<string>("koeling");
  const [waarde, setWaarde] = useState("");
  const [actie, setActie] = useState("");
  const invoer = useRef<HTMLInputElement>(null);
  const def = meetSoorten.find((m) => m.value === soort)!;
  const getal = Number(waarde.replace(",", ".").replace("−", "-"));
  const ingevuld = waarde !== "" && waarde !== "-" && Number.isFinite(getal);
  const goed = ingevuld ? binnenNorm(soort, getal) : true;

  useEffect(() => {
    if (status.goed) {
      setWaarde("");
      setActie("");
    }
  }, [status]);

  return (
    <>
      <fieldset>
        <legend className="label">Wat meet je?</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {meetSoorten.map((m) => (
            <label key={m.value} className={`flex min-h-doel cursor-pointer items-center justify-between gap-x-3 border-[1.5px] px-3 py-2 sm:min-h-16 sm:flex-col sm:items-start sm:justify-center ${soort === m.value ? "border-donker bg-laag font-semibold" : "border-control"}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="soort" value={m.value} checked={soort === m.value} onChange={() => setSoort(m.value)} className="size-5 shrink-0" />
                {m.label}
              </span>
              <span className="text-right text-sm font-normal text-ink-muted sm:pl-7 sm:text-left">{m.norm}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="temperatuur" className="label">
          Temperatuur in °C
        </label>
        <span className="hulptekst mt-0 mb-1.5">Norm: {def.norm}</span>
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            className="knop knop-secundair shrink-0 px-5 text-xl"
            aria-label="Plus of min wisselen"
            onClick={() => {
              setWaarde((w) => (w.startsWith("-") ? w.slice(1) : `-${w}`));
              invoer.current?.focus();
            }}
          >
            ±
          </button>
          <input
            ref={invoer}
            id="temperatuur"
            name="temperatuur"
            inputMode="decimal"
            autoComplete="off"
            value={waarde}
            onChange={(e) => setWaarde(e.target.value)}
            aria-invalid={status.velden?.temperatuur ? true : undefined}
            aria-describedby="uitslag"
            className="veld w-full max-w-[9rem] text-2xl font-semibold"
          />
        </div>
        {status.velden?.temperatuur && <span className="mt-1 block font-semibold text-fout">{status.velden.temperatuur}</span>}
        <p id="uitslag" aria-live="polite" className="mt-2 min-h-6">
          {ingevuld && (goed ? <span className="font-semibold text-st-goed">Binnen de norm</span> : <span className="font-semibold text-fout">Buiten de norm: wat heb je gedaan?</span>)}
        </p>
      </div>

      {!goed && (
        <div className="max-w-2xl">
          <label htmlFor="actie" className="label">
            Wat heb je gedaan?
          </label>
          <span className="hulptekst mt-0 mb-1.5">Bijv. koeling lager gezet, eten weggegooid, na een uur opnieuw gemeten.</span>
          <textarea id="actie" name="actie" rows={2} maxLength={300} className="veld" aria-invalid={status.velden?.actie ? true : undefined} value={actie} onChange={(e) => setActie(e.target.value)} />
          {status.velden?.actie && <span className="mt-1 block font-semibold text-fout">{status.velden.actie}</span>}
        </div>
      )}

      <KlusKeuze klussen={klussen} />
    </>
  );
}

export function RondeFormulier({ klussen }: { klussen: Optie[] }) {
  return (
    <div className="paneel px-4 pt-4">
      <Formulier actie={bewaarRonde} knop="Ronde bewaren">
        {(s) => <RondeVelden status={s} klussen={klussen} />}
      </Formulier>
    </div>
  );
}

function RondeVelden({ status, klussen }: { status: FormStatus; klussen: Optie[] }) {
  const ref = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (status.goed) ref.current?.closest("form")?.reset();
  }, [status]);
  return (
    <>
      <fieldset ref={ref}>
        <legend className="label">Wat is schoon?</legend>
        <ul className="divide-y divide-rule">
          {schoonmaakPunten.map((p) => (
            <li key={p}>
              <label className="flex min-h-14 items-center gap-3 py-2">
                <input type="checkbox" name="punten" value={p} className="size-6 shrink-0" />
                {p}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <KlusKeuze klussen={klussen} />
      <div className="max-w-2xl">
        <label htmlFor="opmerking" className="label">
          Opmerking <span className="font-normal text-ink-muted">(mag leeg)</span>
        </label>
        <input id="opmerking" name="opmerking" maxLength={300} className="veld" />
      </div>
    </>
  );
}
