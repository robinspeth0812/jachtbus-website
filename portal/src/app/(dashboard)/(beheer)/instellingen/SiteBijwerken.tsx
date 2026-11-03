"use client";

import { RefreshCw } from "lucide-react";
import { useActionState } from "react";
import { Melding } from "@/components/ui";
import type { FormStatus } from "@/lib/formulier";
import { werkSiteBij } from "./actions";

export function SiteBijwerken({ gekoppeld }: { gekoppeld: boolean }) {
  const [status, actie, bezig] = useActionState<FormStatus, FormData>(werkSiteBij, {});
  return (
    <form action={actie} className="space-y-3">
      <button type="submit" className="knop knop-primair" disabled={bezig || !gekoppeld}>
        <RefreshCw aria-hidden size={18} /> {bezig ? "Bezig…" : "Site nu bijwerken"}
      </button>
      {status.goed && <Melding soort="goed">{status.goed}</Melding>}
      {status.fout && <Melding soort="fout">{status.fout}</Melding>}
    </form>
  );
}
