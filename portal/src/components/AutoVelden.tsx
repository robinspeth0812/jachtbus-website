"use client";

import Link from "next/link";
import { Veld } from "./Formulier";
import type { FormStatus } from "@/lib/formulier";
import { beginwaarde, type Keuzes, type VeldDef } from "@/lib/velden";

/** Renders form fields from their definitions. Fields sit side by side when they fit. */
export function AutoVelden({
  defs,
  status,
  doc,
  keuzes = {},
}: {
  defs: readonly VeldDef[];
  status: FormStatus;
  doc?: Record<string, unknown> | null;
  keuzes?: Keuzes;
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-5">
      {defs.map((v) => (
        <FragmentVeld key={v.naam} v={v} status={status} doc={doc} keuzes={keuzes} />
      ))}
    </div>
  );
}

function FragmentVeld({ v, status, doc, keuzes }: { v: VeldDef; status: FormStatus; doc?: Record<string, unknown> | null; keuzes: Keuzes }) {
  return (
    <>
      {v.groep && <h2 className="mt-3 w-full border-t border-rule pt-5 text-lg font-semibold">{v.groep}</h2>}
      <EenVeld v={v} status={status} doc={doc} keuzes={keuzes} />
    </>
  );
}

function FoutTekst({ status, naam }: { status: FormStatus; naam: string }) {
  const fout = status.velden?.[naam];
  return fout ? <span className="mt-1 block font-semibold text-fout">{fout}</span> : null;
}

function EenVeld({ v, status, doc, keuzes }: { v: VeldDef; status: FormStatus; doc?: Record<string, unknown> | null; keuzes: Keuzes }) {
  const waarde = beginwaarde(doc, v);
  const opties = v.opties ?? (v.bron ? keuzes[v.bron] : undefined) ?? [];

  switch (v.soort) {
    case "vink":
      return (
        <div className="w-full">
          <label className="flex min-h-doel items-center gap-3">
            <input type="checkbox" name={v.naam} value="1" defaultChecked={waarde as boolean} className="size-5 shrink-0" />
            <span className="font-medium">{v.label}</span>
          </label>
          {v.hulp && <span className="hulptekst mt-0 ml-8">{v.hulp}</span>}
          <FoutTekst status={status} naam={v.naam} />
        </div>
      );
    case "meerkeuze":
    case "relaties":
      return (
        <fieldset className="w-full">
          <legend className="label">{v.label}</legend>
          {v.hulp && <span className="hulptekst mt-0 mb-1.5">{v.hulp}</span>}
          {opties.length === 0 ? (
            <p className="text-ink-muted">Hier staat nog niets om uit te kiezen.</p>
          ) : (
            <div className="grid gap-x-4 sm:grid-cols-2">
              {opties.map((o) => (
                <label key={o.value} className="flex min-h-doel items-center gap-3">
                  <input type="checkbox" name={v.naam} value={o.value} defaultChecked={(waarde as string[]).includes(o.value)} className="size-5 shrink-0" />
                  <span className="min-w-0">{o.label}</span>
                </label>
              ))}
            </div>
          )}
          <FoutTekst status={status} naam={v.naam} />
        </fieldset>
      );
    case "foto":
    case "fotos": {
      const meer = v.soort === "fotos";
      return (
        <fieldset className="w-full">
          <legend className="label">{v.label}</legend>
          {v.hulp && <span className="hulptekst mt-0 mb-1.5">{v.hulp}</span>}
          {opties.length === 0 ? (
            <p className="text-ink-muted">
              Nog geen foto&apos;s.{" "}
              <Link href="/website/galerij" className="underline">
                Zet er eerst een in de galerij
              </Link>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
              {!meer && (
                <li>
                  <label className="flex h-full min-h-doel items-center gap-2 border border-control p-2">
                    <input type="radio" name={v.naam} value="" defaultChecked={!waarde} className="size-5 shrink-0" />
                    {v.leeg ?? "Geen"}
                  </label>
                </li>
              )}
              {(opties as { value: string; label: string; url?: string | null }[]).map((o) => (
                <li key={o.value}>
                  <label className="block border border-control p-2 has-[:checked]:border-2 has-[:checked]:border-groen-donker">
                    {o.url && (
                      // eslint-disable-next-line @next/next/no-img-element -- own uploads, thumbnail size
                      <img src={o.url} alt="" className="mb-2 aspect-[4/3] w-full bg-laag object-cover" />
                    )}
                    <span className="flex items-start gap-2 text-sm">
                      <input
                        type={meer ? "checkbox" : "radio"}
                        name={v.naam}
                        value={o.value}
                        defaultChecked={meer ? (waarde as string[]).includes(o.value) : waarde === o.value}
                        className="mt-0.5 size-5 shrink-0"
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{o.label}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <FoutTekst status={status} naam={v.naam} />
        </fieldset>
      );
    }
    default:
      return (
        <Veld naam={v.naam} label={v.label} status={status} hulp={v.hulp} verplicht={v.verplicht} breedte={v.breedte} kaal={(v.soort === "keuze" && !v.leeg) || v.breedte === "tijd"}>
          {(p) => <Besturing v={v} p={p} waarde={waarde as string} opties={opties} />}
        </Veld>
      );
  }
}

type VeldProps = { id: string; name: string; "aria-invalid"?: boolean; "aria-describedby"?: string; required?: boolean; className: string };

function Besturing({ v, p, waarde, opties }: { v: VeldDef; p: VeldProps; waarde: string; opties: readonly { value: string; label: string }[] }) {
  switch (v.soort) {
    case "lang":
      return <textarea {...p} rows={v.rijen ?? 4} maxLength={v.max} defaultValue={waarde} />;
    case "keuze":
    case "relatie":
      return (
        <select {...p} defaultValue={waarde}>
          {(v.leeg || !v.verplicht || v.soort === "relatie") && <option value="">{v.leeg ?? "Niet gekozen"}</option>}
          {opties.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "getal":
      return <input {...p} type="text" inputMode={v.stap && v.stap < 1 ? "decimal" : "numeric"} defaultValue={waarde} placeholder={v.voorbeeld} />;
    case "datum":
      return <input {...p} type="date" defaultValue={waarde} />;
    case "tijd":
      return <input {...p} type="time" defaultValue={waarde} />;
    case "email":
      return <input {...p} type="email" autoComplete="off" defaultValue={waarde} />;
    case "telefoon":
      return <input {...p} type="tel" autoComplete="off" defaultValue={waarde} />;
    case "url":
      return <input {...p} type="url" defaultValue={waarde} placeholder="https://" />;
    default:
      return <input {...p} type="text" maxLength={v.max} defaultValue={waarde} placeholder={v.voorbeeld} />;
  }
}
