"use client";

import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";

/**
 * A button that first asks "are you sure?" in a native dialog: focus stays in,
 * Escape closes, Cancel has focus so Enter never throws anything away. Portalled
 * to the body so the button may sit inside another form.
 */
export function Bevestig({
  actie,
  velden,
  knop,
  knopKlasse = "knop knop-secundair",
  knopLabel,
  titel,
  tekst,
  ja,
  gevaar = false,
}: {
  actie: (formData: FormData) => Promise<void>;
  velden: Record<string, string | number>;
  knop: React.ReactNode;
  knopKlasse?: string;
  /** Accessible name when the button is only an icon. */
  knopLabel?: string;
  titel: string;
  tekst?: React.ReactNode;
  ja: string;
  gevaar?: boolean;
}) {
  const venster = useRef<HTMLDialogElement>(null);
  const titelId = useId();
  const tekstId = useId();
  const [klaar, setKlaar] = useState(false);
  useEffect(() => setKlaar(true), []);

  const dialoog = (
    <dialog
      ref={venster}
      data-licht
      aria-labelledby={titelId}
      aria-describedby={tekst ? tekstId : undefined}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] border-[1.5px] border-donker bg-surface p-0 text-ink shadow-[0_8px_32px_rgb(27_24_23/0.25)] backdrop:bg-donker/60"
      onClick={(e) => e.target === e.currentTarget && venster.current?.close()}
    >
      {/* React bubbles events through a portal; keep them from the form around it. */}
      <form action={actie} className="p-6" onSubmit={(e) => e.stopPropagation()} onInput={(e) => e.stopPropagation()} onChange={(e) => e.stopPropagation()}>
        {Object.entries(velden).map(([naam, waarde]) => (
          <input key={naam} type="hidden" name={naam} value={waarde} />
        ))}
        <h2 id={titelId} className="text-lg font-semibold text-balance">
          {titel}
        </h2>
        {tekst && (
          <p id={tekstId} className="mt-2 text-ink-muted">
            {tekst}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="knop knop-secundair" onClick={() => venster.current?.close()} autoFocus>
            Annuleren
          </button>
          <JaKnop gevaar={gevaar}>{ja}</JaKnop>
        </div>
      </form>
    </dialog>
  );

  return (
    <>
      <button type="button" className={knopKlasse} aria-label={knopLabel} onClick={() => venster.current?.showModal()}>
        {knop}
      </button>
      {klaar && createPortal(dialoog, document.body)}
    </>
  );
}

function JaKnop({ gevaar, children }: { gevaar: boolean; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`knop ${gevaar ? "knop-gevaar" : "knop-primair"}`} disabled={pending}>
      {pending ? "Bezig…" : children}
    </button>
  );
}
