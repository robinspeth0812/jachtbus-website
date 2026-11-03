"use client";

import { Formulier, Veld } from "@/components/Formulier";
import { ticketSoorten } from "@/lib/opties";
import { maakTicket } from "../actions";

export function TicketFormulier() {
  return (
    <div className="paneel px-4 pt-4">
      <Formulier actie={maakTicket} knop="Ticket versturen" bezigTekst="Bezig met versturen…">
        {(s) => (
          <>
            <Veld naam="titel" label="Waar gaat het over?" status={s} verplicht breedte="lang" hulp="Kort, zodat je het in de lijst terugvindt.">
              {(p) => <input {...p} type="text" maxLength={140} />}
            </Veld>
            <Veld naam="soort" label="Soort" status={s} verplicht breedte="kort">
              {(p) => (
                <select {...p} defaultValue="website">
                  {ticketSoorten.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            </Veld>
            <Veld naam="omschrijving" label="Wat wil je, of wat klopt er niet?" status={s} verplicht breedte="lang">
              {(p) => <textarea {...p} rows={6} maxLength={5000} />}
            </Veld>
            <Veld naam="pagina" label="Om welke pagina gaat het?" status={s} breedte="lang" hulp="Plak de link, of schrijf de naam op.">
              {(p) => <input {...p} type="text" maxLength={500} />}
            </Veld>
            <Veld naam="nodigOp" label="Vóór wanneer heb je het nodig?" status={s} breedte="datum">
              {(p) => <input {...p} type="date" />}
            </Veld>
            <Veld naam="bijlagen" label="Schermafbeelding of bestand" status={s} breedte="lang" hulp="Foto of PDF, maximaal 10 MB per bestand.">
              {(p) => <input {...p} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" />}
            </Veld>
          </>
        )}
      </Formulier>
    </div>
  );
}
