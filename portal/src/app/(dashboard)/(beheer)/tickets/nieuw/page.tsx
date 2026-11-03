import type { Metadata } from "next";
import { PaginaKop } from "@/components/ui";
import { vereisGebruiker } from "@/lib/auth";
import { TicketFormulier } from "./TicketFormulier";

export const metadata: Metadata = { title: "Ticket maken" };

export default async function NieuwTicket() {
  await vereisGebruiker();
  return (
    <>
      <PaginaKop titel="Ticket maken" terug={{ href: "/tickets", label: "Tickets" }} />
      <TicketFormulier />
    </>
  );
}
