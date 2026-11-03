import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { vereisGebruiker } from "@/lib/auth";
import { klantVelden } from "@/lib/velddefs";
import { bewaarKlant } from "../actions";

export const metadata: Metadata = { title: "Klant toevoegen" };

export default async function NieuweKlant() {
  await vereisGebruiker();
  return (
    <>
      <PaginaKop titel="Klant toevoegen" terug={{ href: "/klanten", label: "Klanten" }} />
      <ItemFormulier actie={bewaarKlant.bind(null, null)} defs={klantVelden} knop="Klant opslaan" />
    </>
  );
}
