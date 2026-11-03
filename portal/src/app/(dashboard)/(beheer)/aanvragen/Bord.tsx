"use client";

import { DndContext, type DragEndEvent, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CalendarDays, GripVertical, MoveRight, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useOptimistic, useState, useTransition } from "react";
import { AanvraagLabel } from "@/components/ui";
import { kortDatum } from "@/lib/datum";
import { aanvraagFasen, type AanvraagFase } from "@/lib/opties";
import { BEDRIJF } from "@/lib/bedrijf";
import { zetFase } from "./actions";

export type BordKaart = {
  id: number;
  naam: string;
  gelegenheid: string;
  datum: string | null;
  plaats: string | null;
  gasten: number | null;
  fase: AanvraagFase;
};

/**
 * Board with draggable cards. Dragging is a shortcut only: every card also has
 * "Verplaats naar", which works by keyboard, screen reader and thumb (WCAG 2.5.7).
 */
export function Bord({ kaarten }: { kaarten: BordKaart[] }) {
  const [optimistisch, zetOptimistisch] = useOptimistic(kaarten, (huidig, { id, fase }: { id: number; fase: AanvraagFase }) =>
    huidig.map((k) => (k.id === id ? { ...k, fase } : k)),
  );
  const [, start] = useTransition();
  const [melding, setMelding] = useState("");
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }));

  const verplaats = (id: number, fase: AanvraagFase) => {
    const kaart = optimistisch.find((k) => k.id === id);
    if (!kaart || kaart.fase === fase) return;
    const label = aanvraagFasen.find((f) => f.value === fase)?.label;
    setMelding(`${kaart.naam} staat nu op ${label}.`);
    start(async () => {
      zetOptimistisch({ id, fase });
      await zetFase(id, fase);
    });
  };

  const opEinde = (e: DragEndEvent) => {
    if (e.over) verplaats(Number(e.active.id), e.over.id as AanvraagFase);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={opEinde} accessibility={{ screenReaderInstructions: { draggable: "Slepen kan met de muis. Gebruik anders de knop Verplaats naar op de kaart." } }}>
      <p role="status" aria-live="polite" className="sr-only">
        {melding}
      </p>
      <div className="grid items-start gap-4 lg:grid-cols-5" data-breed>
        {aanvraagFasen.map((f) => (
          <Kolom key={f.value} fase={f.value} label={f.label} kaarten={optimistisch.filter((k) => k.fase === f.value)} verplaats={verplaats} />
        ))}
      </div>
    </DndContext>
  );
}

function Kolom({ fase, label, kaarten, verplaats }: { fase: AanvraagFase; label: string; kaarten: BordKaart[]; verplaats: (id: number, fase: AanvraagFase) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: fase });
  const kopId = useId();
  return (
    <section ref={setNodeRef} aria-labelledby={kopId} className={`min-w-0 border-[1.5px] border-donker bg-laag ${isOver ? "outline-3 -outline-offset-3 outline-groen-donker" : ""}`}>
      <h2 id={kopId} className="flex min-h-11 items-center justify-between gap-2 border-b-[1.5px] border-donker bg-surface px-3 font-semibold">
        {label}
        <span>
          {kaarten.length}
          <span className="sr-only"> aanvragen</span>
        </span>
      </h2>
      {kaarten.length === 0 ? (
        <p className="px-3 py-4 text-sm text-ink-muted">{isOver ? "Laat hier los." : "Geen aanvragen."}</p>
      ) : (
        <ul className="space-y-2 p-2">
          {kaarten.map((k) => (
            <Kaart key={k.id} kaart={k} verplaats={verplaats} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Kaart({ kaart, verplaats }: { kaart: BordKaart; verplaats: (id: number, fase: AanvraagFase) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: kaart.id });
  const [klaar, setKlaar] = useState(false);
  useEffect(() => setKlaar(true), []);
  const stijl = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const teKlein = kaart.gasten !== null && kaart.gasten < BEDRIJF.minimumGasten;

  return (
    <li ref={setNodeRef} style={stijl} className={`border border-donker bg-surface ${isDragging ? "relative z-20 shadow-[0_8px_24px_rgb(27_24_23/0.3)]" : ""}`}>
      <div className="flex items-start">
        <Link href={`/aanvragen/${kaart.id}`} className="min-w-0 flex-1 p-3 no-underline hover:underline">
          <span className="block font-semibold [overflow-wrap:anywhere]">{kaart.naam}</span>
          <span className="mt-0.5 block text-sm text-ink-muted [overflow-wrap:anywhere]">
            {kaart.gelegenheid}
            {kaart.plaats ? `, ${kaart.plaats}` : ""}
          </span>
        </Link>
        {/* Mouse and long-press only; the keyboard route is the menu below. */}
        {klaar && (
          <button
            type="button"
            {...listeners}
            {...attributes}
            tabIndex={-1}
            aria-hidden
            title="Slepen"
            className="hidden size-doel shrink-0 touch-none items-center justify-center text-ink-muted hover:text-ink lg:inline-flex"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <GripVertical size={18} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 px-3 pb-2 text-sm">
        {kaart.datum && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden size={14} /> {kortDatum(kaart.datum)}
          </span>
        )}
        {kaart.gasten !== null && (
          <span className={`inline-flex items-center gap-1 ${teKlein ? "font-semibold text-st-let" : ""}`}>
            <Users aria-hidden size={14} /> {kaart.gasten} gasten
            {teKlein && ", te weinig"}
          </span>
        )}
      </div>
      {/* In-flow menu: an absolute one would be clipped by the column on a phone. */}
      <details className="border-t border-rule">
        <summary className="flex min-h-doel cursor-pointer list-none items-center gap-1.5 px-3 text-sm font-medium hover:bg-canvas [&::-webkit-details-marker]:hidden">
          <MoveRight aria-hidden size={16} /> Verplaats naar
          <span className="sr-only">: {kaart.naam}</span>
        </summary>
        <ul className="border-t border-rule">
          {aanvraagFasen
            .filter((f) => f.value !== kaart.fase)
            .map((f) => (
              <li key={f.value}>
                <button type="button" onClick={() => verplaats(kaart.id, f.value)} className="flex min-h-doel w-full items-center px-3 text-left text-sm hover:bg-canvas">
                  <AanvraagLabel fase={f.value} />
                </button>
              </li>
            ))}
        </ul>
      </details>
    </li>
  );
}
