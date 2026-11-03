import type { Metadata } from "next";
import { ItemFormulier } from "@/components/ItemFormulier";
import { PaginaKop } from "@/components/ui";
import { vereisGebruiker } from "@/lib/auth";
import { nietBeschikbaarDef, teamVelden } from "@/lib/velddefs";
import { bewaarTeamlid } from "../actions";

export const metadata: Metadata = { title: "Teamlid toevoegen" };

export default async function NieuwTeamlid() {
  await vereisGebruiker();
  return (
    <>
      <PaginaKop titel="Teamlid toevoegen" terug={{ href: "/bus/team", label: "Team" }} />
      <ItemFormulier actie={bewaarTeamlid.bind(null, null)} defs={teamVelden} herhalingen={[nietBeschikbaarDef]} doc={{ actief: true, rol: "hulp" }} knop="Teamlid opslaan" />
    </>
  );
}
