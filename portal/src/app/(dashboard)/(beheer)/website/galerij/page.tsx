import { AlertTriangle, Check, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Label, LegeStaat, PaginaKop } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { Upload } from "./Upload";

export const metadata: Metadata = { title: "Galerij" };

export default async function Galerij() {
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "media", sort: "-createdAt", limit: 200, depth: 0, user, overrideAccess: false });
  return (
    <>
      <PaginaKop titel="Galerij" info="Foto's met de maker, de licentie en of er mensen herkenbaar op staan. Een foto met herkenbare mensen zonder toestemming kan niet op de site: de website krijgt hem niet te zien." />
      <details className="paneel mb-6" open={docs.length === 0}>
        <summary className="flex min-h-doel cursor-pointer list-none items-center gap-2 px-4 py-2 font-semibold hover:bg-canvas [&::-webkit-details-marker]:hidden">
          <Plus aria-hidden size={18} /> Foto toevoegen
        </summary>
        <div className="border-t border-rule p-4">
          <Upload />
        </div>
      </details>
      {docs.length === 0 ? (
        <LegeStaat titel="Nog geen foto's">Upload je eerste foto hierboven. Daarna kun je hem kiezen bij een referentie of een klus.</LegeStaat>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4">
          {docs.map((f) => {
            const vrij = f.personen === "geen" || f.personen === "toestemming";
            return (
              <li key={f.id} className="paneel">
                <Link href={`/website/galerij/${f.id}`} className="block no-underline hover:underline">
                  {/* eslint-disable-next-line @next/next/no-img-element -- own uploads, thumbnail size */}
                  <img src={f.sizes?.klein?.url ?? f.url ?? ""} alt="" className="aspect-[4/3] w-full bg-laag object-cover" />
                  <span className="block p-2 text-sm [overflow-wrap:anywhere]">{f.alt}</span>
                </Link>
                <div className="px-2 pb-2">
                  {vrij ? (
                    <Label toon="goed" icoon={Check}>
                      Mag op de site
                    </Label>
                  ) : (
                    <Label toon="let" icoon={AlertTriangle}>
                      {f.personen === "geen-toestemming" ? "Geen toestemming" : "Nog bekijken"}
                    </Label>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
