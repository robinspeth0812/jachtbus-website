import { Eye, EyeOff, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActieKnop } from "@/components/ActieKnop";
import { LegeStaat, PaginaKop, PublicatieLabel } from "@/components/ui";
import { payloadClient, vereisBeheerder } from "@/lib/auth";
import { datum } from "@/lib/datum";
import { websiteModules } from "@/lib/modules";
import { faqPaginas, labelVan } from "@/lib/opties";
import { zetGepubliceerd } from "../actions";

type Doc = Record<string, unknown> & { id: number; status?: string };

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  return { title: websiteModules[(await params).module]?.titel ?? "Website" };
}

/** The second line of a row, per module. */
function onderregel(key: string, d: Doc) {
  switch (key) {
    case "arrangementen":
      return String(d.kort ?? "");
    case "referenties":
      return [d.plaats, d.gelegenheid, d.toestemming ? "toestemming: ja" : "toestemming: nog niet"].filter(Boolean).join(", ");
    case "reviews":
      return `${String(d.bron ?? "")}: ${String(d.tekst ?? "").slice(0, 90)}`;
    case "faq":
      return labelVan(faqPaginas, d.pagina as string);
    case "werkgebied":
      return String(d.provincie ?? "");
    case "mededelingen":
      return d.vanaf || d.tot ? `${d.vanaf ? `Vanaf ${datum(d.vanaf as string)}` : ""}${d.tot ? ` tot en met ${datum(d.tot as string)}` : ""}` : "Geen einddatum";
    default:
      return "";
  }
}

export default async function ModuleLijst({ params }: { params: Promise<{ module: string }> }) {
  const user = await vereisBeheerder();
  const key = (await params).module;
  const m = websiteModules[key];
  if (!m) notFound();
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: m.slug, sort: m.sort, limit: 300, depth: 0, user, overrideAccess: false });

  const nieuw = (
    <Link href={`/website/${key}/nieuw`} className="knop knop-primair">
      <Plus aria-hidden size={18} /> {m.enkel} toevoegen
    </Link>
  );

  return (
    <>
      <PaginaKop titel={m.titel} info={m.info} actie={nieuw} />
      {docs.length === 0 ? (
        <LegeStaat titel={m.legeTitel}>{m.leeg}</LegeStaat>
      ) : (
        <ul className="paneel divide-y divide-rule">
          {(docs as unknown as Doc[]).map((d) => {
            const op = d.status === "gepubliceerd";
            const titel = String(d[m.titelVeld] ?? "");
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                <Link href={`/website/${key}/${d.id}`} className="min-w-0 flex-1 basis-56 no-underline hover:underline">
                  <span className="block font-semibold [overflow-wrap:anywhere]">{titel}</span>
                  <span className="block text-sm text-ink-muted [overflow-wrap:anywhere]">{onderregel(key, d)}</span>
                </Link>
                <PublicatieLabel status={d.status} />
                <ActieKnop actie={zetGepubliceerd} velden={{ id: d.id, module: key, status: op ? "concept" : "gepubliceerd" }} voor={titel}>
                  {op ? <EyeOff aria-hidden size={16} /> : <Eye aria-hidden size={16} />}
                  {op ? "Van de site" : "Op de site"}
                </ActieKnop>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
