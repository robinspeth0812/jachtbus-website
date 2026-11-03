import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { vereisGebruiker } from "@/lib/auth";
import { aanvraagHandmatigVelden } from "@/lib/velddefs";
import { maakAanvraag } from "../actions";

export const metadata: Metadata = { title: "Aanvraag toevoegen" };

export default async function NieuweAanvraag() {
  await vereisGebruiker();
  return (
    <>
      <PaginaKop titel="Aanvraag toevoegen" terug={{ href: "/aanvragen", label: "Aanvragen" }} />
      <ItemFormulier actie={maakAanvraag} defs={aanvraagHandmatigVelden} knop="Aanvraag opslaan" />
    </>
  );
}
