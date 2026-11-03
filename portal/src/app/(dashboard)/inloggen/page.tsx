import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BusPattern } from "@/components/BusPattern";
import { WEBBOUWER } from "@/lib/bedrijf";
import { huidigeGebruiker } from "@/lib/auth";
import { InlogFormulier } from "./InlogFormulier";

export const metadata: Metadata = { title: "Inloggen" };

export default async function InlogPagina() {
  if (await huidigeGebruiker()) redirect("/");

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-groen-donker text-white">
      <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-1.5 bg-signaal" />
      <div aria-hidden className="absolute inset-0 text-white/15">
        <BusPattern kolommen={16} rijen={10} />
      </div>
      <main data-licht className="relative z-10 w-full max-w-md px-4 py-10 sm:px-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
        <img src="/jachtbus-script-wit.svg" alt="Jachtbus" width={900} height={259} className="mx-auto mb-8 h-20 w-auto" />
        <div className="border-[1.5px] border-donker bg-surface p-6 text-ink sm:p-8">
          <h1 className="kop-display mb-1 text-4xl">Inloggen</h1>
          <p className="mb-6 text-ink-muted">Je aanvragen, klussen en de bus op één plek.</p>
          <InlogFormulier />
        </div>
        <p className="mt-6 text-white">Wachtwoord vergeten? Vraag {WEBBOUWER} of Peer om een nieuw wachtwoord.</p>
      </main>
    </div>
  );
}
