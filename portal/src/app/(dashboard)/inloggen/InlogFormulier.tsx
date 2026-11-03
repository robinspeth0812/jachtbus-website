"use client";

import { useActionState } from "react";
import { type InlogStatus, inloggen } from "./actions";

export function InlogFormulier() {
  const [status, actie, bezig] = useActionState<InlogStatus, FormData>(inloggen, {});

  return (
    <form action={actie} className="space-y-5" noValidate>
      {status.fout && (
        <p role="alert" id="inlog-fout" className="border border-fout bg-fout-bg px-3 py-2 text-fout">
          {status.fout}
        </p>
      )}
      <div>
        <label htmlFor="email" className="label">
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={status.email}
          aria-invalid={status.fout ? true : undefined}
          aria-describedby={status.fout ? "inlog-fout" : undefined}
          className="veld"
        />
      </div>
      <div>
        <label htmlFor="wachtwoord" className="label">
          Wachtwoord
        </label>
        <input
          id="wachtwoord"
          name="wachtwoord"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={status.fout ? true : undefined}
          aria-describedby={status.fout ? "inlog-fout" : undefined}
          className="veld"
        />
      </div>
      <button type="submit" className="knop knop-primair w-full" disabled={bezig}>
        {bezig ? "Bezig met inloggen…" : "Inloggen"}
      </button>
    </form>
  );
}
