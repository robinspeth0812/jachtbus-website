import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { vereisGebruiker } from "@/lib/auth";
import { keuringVelden } from "@/lib/velddefs";
import { bewaarKeuring } from "../actions";

export const metadata: Metadata = { title: "Keuring toevoegen" };

export default async function NieuweKeuring() {
  await vereisGebruiker();
  return (
    <>
      <PaginaKop titel="Keuring toevoegen" terug={{ href: "/bus/keuringen", label: "Keuringen en onderhoud" }} />
      <ItemFormulier actie={bewaarKeuring.bind(null, null)} defs={keuringVelden} doc={{ herinnerDagen: 30 }} knop="Keuring opslaan" />
    </>
  );
}
