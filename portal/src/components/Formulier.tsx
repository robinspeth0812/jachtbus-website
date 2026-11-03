"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, startTransition, useActionState, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import type { FormStatus } from "@/lib/formulier";
import type { Breedte } from "@/lib/velden";
import { Bevestig } from "./Bevestig";
import { Melding } from "./ui";

type Actie = (vorige: FormStatus, formData: FormData) => Promise<FormStatus>;

/** For changes that give no input event, such as adding a row. */
const GewijzigdContext = createContext<() => void>(() => {});
export const useMarkeerGewijzigd = () => useContext(GewijzigdContext);

const WEGGAAN = "Je hebt wijzigingen die nog niet zijn opgeslagen. Toch weggaan?";

/**
 * Form with messages and a save button that stays in view on long forms.
 * Leaving with unsaved changes asks first. After creating, the server sends
 * `naar` and we go to that page. No action prop on purpose: React 19 would
 * clear the form, and you would lose your input on an error message.
 */
export function Formulier({
  actie,
  knop,
  bezigTekst = "Bezig met opslaan…",
  plakkend = true,
  children,
}: {
  actie: Actie;
  knop: string;
  bezigTekst?: string;
  /** Keep the save bar in view while scrolling. */
  plakkend?: boolean;
  children: (status: FormStatus) => React.ReactNode;
}) {
  const [status, uitvoeren, bezig] = useActionState<FormStatus, FormData>(actie, {});
  const [gewijzigd, setGewijzigd] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const markeer = useCallback(() => setGewijzigd(true), []);

  useEffect(() => {
    if (status.goed || status.naar) setGewijzigd(false);
    if (status.naar) router.push(status.naar);
  }, [status, router]);

  useWaarschuwBijWeggaan(gewijzigd);

  const fouten = Object.entries(status.velden ?? {});
  const naarVeld = (naam: string) => {
    const el = formRef.current?.elements.namedItem(naam);
    const veld = el instanceof RadioNodeList ? (el[0] as HTMLElement | undefined) : (el as HTMLElement | null);
    veld?.focus();
    veld?.scrollIntoView({ block: "center" });
  };

  return (
    <GewijzigdContext.Provider value={markeer}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => uitvoeren(data));
        }}
        onInput={() => setGewijzigd(true)}
        onChange={() => setGewijzigd(true)}
        className="space-y-5"
        noValidate
      >
        {children(status)}
        <div
          className={
            plakkend
              ? "sticky bottom-onderbalk z-10 -mx-4 space-y-3 border-t-[1.5px] border-donker bg-surface px-4 py-3 lg:bottom-0"
              : "space-y-3"
          }
        >
          {fouten.length > 0 && (
            <div role="alert" className="border border-fout bg-fout-bg px-3 py-2 text-fout">
              <p className="font-semibold">{fouten.length === 1 ? "Eén veld klopt nog niet:" : `${fouten.length} velden kloppen nog niet:`}</p>
              <ul className="mt-1 space-y-1">
                {fouten.slice(0, 5).map(([naam, tekst]) => (
                  <li key={naam}>
                    <button type="button" onClick={() => naarVeld(naam)} className="min-h-6 text-left underline">
                      {tekst}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {status.fout && <Melding soort="fout">{status.fout}</Melding>}
          {status.goed && !gewijzigd && <Melding soort="goed">{status.goed}</Melding>}
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
            {gewijzigd && !bezig && <p className="mr-auto text-sm font-semibold text-st-let">Nog niet opgeslagen</p>}
            <button type="submit" className="knop knop-primair" disabled={bezig}>
              {bezig ? bezigTekst : knop}
            </button>
          </div>
        </div>
      </form>
    </GewijzigdContext.Provider>
  );
}

/** Asks on reload, close, or a link inside the portal. */
function useWaarschuwBijWeggaan(actief: boolean) {
  const actiefRef = useRef(actief);
  actiefRef.current = actief;

  useEffect(() => {
    const voorUnload = (e: BeforeUnloadEvent) => {
      if (actiefRef.current) e.preventDefault();
    };
    const voorKlik = (e: MouseEvent) => {
      if (!actiefRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.href.startsWith("mailto:") || link.href.startsWith("tel:")) return;
      if (!window.confirm(WEGGAAN)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", voorUnload);
    document.addEventListener("click", voorKlik, true);
    return () => {
      window.removeEventListener("beforeunload", voorUnload);
      document.removeEventListener("click", voorKlik, true);
    };
  }, []);
}

export const breedteKlasse: Record<Breedte, string> = {
  tijd: "w-full max-w-[9rem]",
  datum: "w-full max-w-[12rem]",
  kort: "w-full max-w-[16rem]",
  middel: "w-full max-w-md",
  lang: "w-full max-w-2xl",
};

/** Label, field, help and error in one. */
export function Veld({
  naam,
  label,
  status,
  hulp,
  verplicht,
  breedte,
  kaal,
  children,
}: {
  /** Without "(mag leeg)", when the label does not suit it. */
  kaal?: boolean;
  naam: string;
  label: string;
  status: FormStatus;
  hulp?: string;
  verplicht?: boolean;
  breedte?: Breedte;
  children: (props: { id: string; name: string; "aria-invalid"?: boolean; "aria-describedby"?: string; required?: boolean; className: string }) => React.ReactNode;
}) {
  const id = useId();
  const fout = status.velden?.[naam];
  const beschrijving = [hulp && `${id}-hulp`, fout && `${id}-fout`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={breedte ? breedteKlasse[breedte] : "w-full"}>
      <label htmlFor={id} className="label">
        {label}
        {!verplicht && !kaal && <span className="font-normal text-ink-muted"> (mag leeg)</span>}
      </label>
      {/* Help between label and field: you read it before you type. */}
      {hulp && (
        <span id={`${id}-hulp`} className="hulptekst mt-0 mb-1.5">
          {hulp}
        </span>
      )}
      {children({ id, name: naam, "aria-invalid": fout ? true : undefined, "aria-describedby": beschrijving, required: verplicht, className: "veld" })}
      {fout && (
        <span id={`${id}-fout`} className="mt-1 block font-semibold text-fout">
          {fout}
        </span>
      )}
    </div>
  );
}

/** Delete with "are you sure?" in a dialog. */
export function Verwijderen({
  actie,
  id,
  wat,
  naam,
  klein,
  extra,
  velden,
}: {
  actie: (formData: FormData) => Promise<void>;
  id: number;
  /** Kind, capitalised: "Klus", "Foto". */
  wat: string;
  naam?: string;
  /** Icon only, for inside a list. */
  klein?: boolean;
  extra?: string;
  velden?: Record<string, string | number>;
}) {
  const omschrijving = naam ? `${wat.toLowerCase()} "${naam}"` : wat.toLowerCase();
  return (
    <Bevestig
      actie={actie}
      velden={{ id, ...velden }}
      gevaar
      knop={
        klein ? (
          <Trash2 aria-hidden size={18} />
        ) : (
          <>
            <Trash2 aria-hidden size={18} /> {wat} verwijderen
          </>
        )
      }
      knopLabel={klein ? `Verwijder ${omschrijving}` : undefined}
      knopKlasse={
        klein
          ? "inline-flex size-doel items-center justify-center text-ink-muted transition-colors duration-150 hover:bg-fout-bg hover:text-fout"
          : "inline-flex min-h-doel items-center gap-2 px-1 font-semibold text-fout underline-offset-4 hover:underline"
      }
      titel={`${naam ? `"${naam}"` : wat} verwijderen?`}
      tekst={`Dit kun je niet ongedaan maken.${extra ? ` ${extra}` : ""}`}
      ja="Ja, verwijder"
    />
  );
}
