"use client";

import { Formulier, Veld } from "@/components/Formulier";
import type { Optie } from "@/lib/opties";
import { maakGebruiker, zetWachtwoord } from "./actions";

export function NieuweInlog({ rollen }: { rollen: Optie[] }) {
  return (
    <Formulier actie={maakGebruiker} knop="Inlog maken" plakkend={false}>
      {(s) => (
        <div className="flex flex-wrap gap-4">
          <Veld naam="naam" label="Naam" status={s} verplicht breedte="kort">
            {(p) => <input {...p} type="text" maxLength={80} />}
          </Veld>
          <Veld naam="email" label="E-mail" status={s} verplicht breedte="middel">
            {(p) => <input {...p} type="email" autoComplete="off" />}
          </Veld>
          <Veld naam="rol" label="Wat mag die persoon?" status={s} verplicht breedte="kort" hulp="Een medewerker ziet geen offertes, website en instellingen.">
            {(p) => (
              <select {...p} defaultValue="medewerker">
                {rollen.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            )}
          </Veld>
          <Veld naam="wachtwoord" label="Tijdelijk wachtwoord" status={s} verplicht breedte="kort" hulp="Minstens 10 tekens.">
            {(p) => <input {...p} type="text" autoComplete="new-password" />}
          </Veld>
        </div>
      )}
    </Formulier>
  );
}

export function NieuwWachtwoord({ id, naam }: { id: number; naam: string }) {
  return (
    <details>
      <summary className="inline-flex min-h-doel cursor-pointer items-center text-sm font-medium underline">Nieuw wachtwoord voor {naam}</summary>
      <div className="mt-2 max-w-md border border-rule p-3">
        <Formulier actie={zetWachtwoord} knop="Wachtwoord zetten" plakkend={false}>
          {(s) => (
            <>
              <input type="hidden" name="id" value={id} />
              <Veld naam="wachtwoord" label="Nieuw wachtwoord" status={s} verplicht hulp="Minstens 10 tekens.">
                {(p) => <input {...p} type="text" autoComplete="new-password" />}
              </Veld>
            </>
          )}
        </Formulier>
      </div>
    </details>
  );
}
