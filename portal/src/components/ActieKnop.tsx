"use client";

import type React from "react";
import { useFormStatus } from "react-dom";

/** A direct, reversible action from a list, such as publishing or ticking off. */
export function ActieKnop({
  actie,
  velden,
  children,
  voor,
  klasse = "knop-klein",
}: {
  actie: (formData: FormData) => Promise<void>;
  velden: Record<string, string | number>;
  children: React.ReactNode;
  /** What the button is about, for screen readers only. */
  voor: string;
  klasse?: string;
}) {
  return (
    <form action={actie}>
      {Object.entries(velden).map(([naam, waarde]) => (
        <input key={naam} type="hidden" name={naam} value={waarde} />
      ))}
      <Knop voor={voor} klasse={klasse}>
        {children}
      </Knop>
    </form>
  );
}

function Knop({ voor, klasse, children }: { voor: string; klasse: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={klasse}>
      {pending ? "Bezig…" : children}
      <span className="sr-only">: {voor}</span>
    </button>
  );
}
