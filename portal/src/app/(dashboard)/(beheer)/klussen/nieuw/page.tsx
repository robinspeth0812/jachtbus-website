import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { laadKeuzes } from "@/lib/keuzes";
import { klusPlanningVelden } from "@/lib/velddefs";
import { bewaarKlus } from "../actions";

export const metadata: Metadata = { title: "Klus toevoegen" };

export default async function NieuweKlus() {
  const user = await vereisGebruiker();
  const keuzes = await laadKeuzes(await payloadClient(), user, ["klanten", "arrangementen", "team"]);
  return (
    <>
      <PaginaKop titel="Klus toevoegen" terug={{ href: "/klussen", label: "Klussen" }} />
      <ItemFormulier actie={bewaarKlus.bind(null, null, "planning")} defs={klusPlanningVelden} doc={{ status: "bevestigd" }} keuzes={keuzes} knop="Klus opslaan" />
    </>
  );
}
