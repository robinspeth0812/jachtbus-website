"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

/** Top bar of a print page. Never printed itself. */
export function Afdrukbalk({ terug, label, uitleg }: { terug: string; label: string; uitleg: string }) {
  return (
    <div data-licht className="niet-afdrukken sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-donker bg-surface px-4 py-2">
      <Link href={terug} className="lijn-link">
        <ArrowLeft aria-hidden size={16} /> {label}
      </Link>
      <p className="hidden text-sm text-ink-muted md:block">{uitleg}</p>
      <button type="button" className="knop knop-primair" onClick={() => window.print()}>
        <Printer aria-hidden size={18} /> Afdrukken of PDF
      </button>
    </div>
  );
}
