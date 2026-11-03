"use client";

import { Info as InfoIcoon } from "lucide-react";
import type React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/**
 * Info toggletip: how something works, only when you ask. Opens with click or
 * Enter, closes with Escape or a click elsewhere.
 */
export function Info({ over, children }: { over: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const paneel = useRef<HTMLSpanElement>(null);
  const [schuif, setSchuif] = useState(0);

  // Does not fit to the right of the button: slide left until inside the screen.
  useLayoutEffect(() => {
    if (!open || !paneel.current) return setSchuif(0);
    const r = paneel.current.getBoundingClientRect();
    const teVer = r.right - schuif - (document.documentElement.clientWidth - 16);
    setSchuif(teVer > 0 ? teVer : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const buiten = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const toets = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", buiten);
    document.addEventListener("keydown", toets);
    return () => {
      document.removeEventListener("pointerdown", buiten);
      document.removeEventListener("keydown", toets);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex size-doel shrink-0 items-center justify-center text-ink-muted hover:text-ink ${open ? "text-ink" : ""}`}
      >
        <InfoIcoon aria-hidden size={18} />
        <span className="sr-only">Uitleg over {over}</span>
      </button>
      <span
        ref={paneel}
        id={id}
        role="status"
        style={schuif ? { left: -schuif } : undefined}
        className={`${open ? "block" : "hidden"} absolute top-full left-0 z-30 w-72 max-w-[calc(100vw-2rem)] border-[1.5px] border-donker bg-surface p-3 text-left font-sans text-base font-normal tracking-normal text-ink shadow-[0_6px_20px_rgb(27_24_23/0.2)]`}
        data-kop-reset
      >
        {open && children}
      </span>
    </span>
  );
}
