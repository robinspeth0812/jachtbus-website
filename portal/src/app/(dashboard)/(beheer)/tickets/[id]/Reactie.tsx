"use client";

import { useEffect, useRef } from "react";
import { Formulier, Veld } from "@/components/Formulier";
import { WEBBOUWER } from "@/lib/bedrijf";
import type { FormStatus } from "@/lib/formulier";
import { labelVan, type TicketStatus, ticketStatussen } from "@/lib/opties";
import { reageerOpTicket } from "../actions";

export function Reactie({ id, status, webbouwer }: { id: number; status: TicketStatus; webbouwer: boolean }) {
  return (
    <Formulier actie={reageerOpTicket} knop="Reactie versturen" plakkend={false}>
      {(s) => (
        <>
          <LeegNaVersturen status={s} />
          <input type="hidden" name="id" value={id} />
          <Veld naam="bericht" label="Bericht" status={s} kaal breedte="lang" hulp={webbouwer ? undefined : `${WEBBOUWER} krijgt een mail van je reactie.`}>
            {(p) => <textarea {...p} rows={4} maxLength={5000} />}
          </Veld>
          {webbouwer && (
            <Veld naam="status" label="Status" status={s} kaal breedte="kort">
              {(p) => (
                // Default "no change": after sending, reset() returns here, so the next reply cannot change status by accident.
                <select {...p} defaultValue="">
                  <option value="">Niet wijzigen ({labelVan(ticketStatussen, status)})</option>
                  {ticketStatussen
                    .filter((o) => o.value !== status)
                    .map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                </select>
              )}
            </Veld>
          )}
          <Veld naam="bijlagen" label="Bijlage" status={s} breedte="lang">
            {(p) => <input {...p} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" />}
          </Veld>
        </>
      )}
    </Formulier>
  );
}

function LeegNaVersturen({ status }: { status: FormStatus }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status.goed) ref.current?.form?.reset();
  }, [status]);
  return <input ref={ref} type="hidden" />;
}
