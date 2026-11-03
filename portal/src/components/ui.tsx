import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Ban,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  FileEdit,
  MessageCircleQuestion,
  Phone,
  Send,
  Timer,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import type { KeuringStand } from "@/lib/keuringStand";
import { type AanvraagFase, aanvraagFasen, type KlusStatus, klusStatussen, labelVan, type OfferteStatus, offerteStatussen, type TicketStatus, ticketStatussen } from "@/lib/opties";
import { Info } from "./Info";

/** Title on the left, one primary action on the right. Explanation behind an info button. */
export function PaginaKop({
  titel,
  info,
  status,
  actie,
  terug,
}: {
  titel: string;
  info?: React.ReactNode;
  /** Status label, right next to the title it belongs to. */
  status?: React.ReactNode;
  actie?: React.ReactNode;
  terug?: { href: string; label: string };
}) {
  return (
    <header className="mb-6">
      {terug && (
        <Link href={terug.href} className="lijn-link mb-1 text-ink-muted hover:text-ink">
          <ArrowLeft aria-hidden size={16} /> {terug.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="kop-display min-w-0 text-4xl [overflow-wrap:anywhere]">{titel}</h1>
          {info && (
            <span className="-ml-2">
              <Info over={titel}>{info}</Info>
            </span>
          )}
          {status}
        </div>
        {actie && <div className="flex shrink-0 flex-wrap items-center gap-3">{actie}</div>}
      </div>
    </header>
  );
}

type Toon = "nieuw" | "bezig" | "offerte" | "goed" | "uit" | "let" | "fout";

const toonKlassen: Record<Toon, string> = {
  nieuw: "bg-st-nieuw-bg text-st-nieuw",
  bezig: "bg-st-bezig-bg text-st-bezig",
  offerte: "bg-st-offerte-bg text-st-offerte",
  goed: "bg-st-goed-bg text-st-goed",
  uit: "bg-st-uit-bg text-st-uit",
  let: "bg-st-let-bg text-st-let",
  fout: "bg-fout-bg text-fout",
};

/** Status is always colour + word + icon, never colour alone. */
export function Label({ toon, icoon: Icoon, children }: { toon: Toon; icoon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-sm font-semibold whitespace-nowrap ${toonKlassen[toon]}`}>
      <Icoon aria-hidden size={14} strokeWidth={2.5} className="shrink-0" />
      {children}
    </span>
  );
}

const faseStijl: Record<AanvraagFase, { toon: Toon; icoon: LucideIcon }> = {
  nieuw: { toon: "nieuw", icoon: CircleDot },
  contact: { toon: "bezig", icoon: Phone },
  offerte: { toon: "offerte", icoon: Send },
  bevestigd: { toon: "goed", icoon: Check },
  afgewezen: { toon: "uit", icoon: X },
};
export const AanvraagLabel = ({ fase }: { fase: AanvraagFase }) => (
  <Label {...faseStijl[fase]}>{labelVan(aanvraagFasen, fase)}</Label>
);

const klusStijl: Record<KlusStatus, { toon: Toon; icoon: LucideIcon }> = {
  optie: { toon: "nieuw", icoon: Clock3 },
  bevestigd: { toon: "goed", icoon: Check },
  afgerond: { toon: "uit", icoon: Check },
  geannuleerd: { toon: "uit", icoon: Ban },
};
export const KlusLabel = ({ status }: { status: KlusStatus }) => <Label {...klusStijl[status]}>{labelVan(klusStatussen, status)}</Label>;

const offerteStijl: Record<OfferteStatus, { toon: Toon; icoon: LucideIcon }> = {
  concept: { toon: "uit", icoon: FileEdit },
  verstuurd: { toon: "offerte", icoon: Send },
  geaccepteerd: { toon: "goed", icoon: Check },
  afgewezen: { toon: "uit", icoon: X },
  verlopen: { toon: "let", icoon: Timer },
};
export const OfferteLabel = ({ status }: { status: OfferteStatus }) => <Label {...offerteStijl[status]}>{labelVan(offerteStatussen, status)}</Label>;

const ticketStijl: Record<TicketStatus, { toon: Toon; icoon: LucideIcon }> = {
  nieuw: { toon: "nieuw", icoon: CircleDot },
  "mee-bezig": { toon: "bezig", icoon: Clock3 },
  "wacht-op-melder": { toon: "offerte", icoon: MessageCircleQuestion },
  klaar: { toon: "goed", icoon: Check },
  "niet-gedaan": { toon: "uit", icoon: X },
};
export const TicketLabel = ({ status }: { status: TicketStatus }) => <Label {...ticketStijl[status]}>{labelVan(ticketStatussen, status)}</Label>;

export function KeuringLabel({ stand, dagen }: { stand: KeuringStand; dagen: number }) {
  if (stand === "te-laat") return <Label toon="fout" icoon={AlertCircle}>{`Te laat, ${Math.abs(dagen)} ${Math.abs(dagen) === 1 ? "dag" : "dagen"}`}</Label>;
  if (stand === "binnenkort") return <Label toon="let" icoon={Clock3}>{dagen === 0 ? "Vandaag" : `Over ${dagen} ${dagen === 1 ? "dag" : "dagen"}`}</Label>;
  return <Label toon="goed" icoon={Check}>In orde</Label>;
}

/** The bus can only be in one place. */
export const ConflictLabel = () => (
  <Label toon="fout" icoon={TriangleAlert}>
    Dubbel geboekt
  </Label>
);

export function PublicatieLabel({ status }: { status: string | null | undefined }) {
  return status === "gepubliceerd" ? <Label toon="goed" icoon={Check}>Op de site</Label> : <Label toon="uit" icoon={FileEdit}>Concept</Label>;
}

/** Tabs as links: every tab has its own URL, so Back and sharing work. */
export function TabLinks({ label, tabs }: { label: string; tabs: { href: string; label: string; actief: boolean; aantal?: number }[] }) {
  return (
    <nav aria-label={label} className="mb-6 overflow-x-auto border-b-[1.5px] border-donker">
      <ul className="flex min-w-max gap-1">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.actief ? "page" : undefined}
              className={`relative inline-flex min-h-doel items-center gap-2 px-3 no-underline ${t.actief ? "font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-signaal" : "text-ink-muted hover:text-ink"}`}
            >
              {t.label}
              {t.aantal !== undefined && <span className="bg-laag px-1.5 text-sm font-semibold text-ink">{t.aantal}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Panel with heading and link on one line. */
export function Paneel({
  titel,
  link,
  id,
  children,
  className = "",
}: {
  titel: string;
  link?: { href: string; label: string };
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`paneel ${className}`}>
      <div className="paneel-kop">
        <h2 id={id} className="paneel-titel">
          {titel}
        </h2>
        {link && (
          <Link href={link.href} className="lijn-link">
            {link.label} <ChevronRight aria-hidden size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/** Collapsible group with heading and count. */
export function Groep({ kop, aantal, wat, open, children }: { kop: React.ReactNode; aantal: number; wat: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="paneel group">
      <summary className="flex min-h-doel cursor-pointer list-none items-center gap-3 px-4 py-2 hover:bg-canvas [&::-webkit-details-marker]:hidden">
        <ChevronRight aria-hidden size={18} className="shrink-0 text-ink-muted transition-transform duration-150 group-open:rotate-90" />
        {kop}
        <span className="text-ink-muted">
          {aantal}
          <span className="sr-only"> {wat}</span>
        </span>
      </summary>
      <div className="border-t border-rule">{children}</div>
    </details>
  );
}

/** Empty state that explains what comes here and how to begin. */
export function LegeStaat({ titel, children, actie }: { titel: string; children: React.ReactNode; actie?: React.ReactNode }) {
  return (
    <div className="paneel px-6 py-10">
      <h2 className="text-lg font-semibold">{titel}</h2>
      <p className="mt-1 max-w-prose text-ink-muted">{children}</p>
      {actie && <div className="mt-5">{actie}</div>}
    </div>
  );
}

/** Message after saving. role=status so screen readers hear it. */
export function Melding({ soort, children }: { soort: "goed" | "fout"; children: React.ReactNode }) {
  const Icoon = soort === "fout" ? AlertCircle : Check;
  return (
    <p role={soort === "fout" ? "alert" : "status"} className={`flex items-start gap-2 border px-3 py-2 ${soort === "fout" ? "border-fout bg-fout-bg text-fout" : "border-st-goed bg-st-goed-bg text-st-goed"}`}>
      <Icoon aria-hidden size={18} strokeWidth={2.5} className="mt-0.5 shrink-0" />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/** Warning inside a page, always with icon and word. */
export function Waarschuwing({ titel, children, soort = "let" }: { titel: string; children?: React.ReactNode; soort?: "let" | "fout" }) {
  return (
    <div className={`flex items-start gap-3 border-[1.5px] px-4 py-3 ${soort === "fout" ? "border-fout bg-fout-bg text-fout" : "border-st-let bg-st-let-bg text-st-let"}`}>
      <AlertTriangle aria-hidden size={20} strokeWidth={2.5} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold">{titel}</p>
        {children && <div className="mt-0.5">{children}</div>}
      </div>
    </div>
  );
}

/** Term and value pairs, for detail pages. */
export function Gegevens({ rijen }: { rijen: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-rule">
      {rijen.map(([term, waarde]) => (
        <div key={term} className="grid gap-x-4 px-4 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)]">
          <dt className="text-sm font-semibold text-ink-muted sm:text-base sm:font-normal">{term}</dt>
          <dd className="[overflow-wrap:anywhere] whitespace-pre-line">{waarde || <span className="text-ink-muted">Niet ingevuld</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

export const meervoud = (n: number, een: string, meer: string) => `${n} ${n === 1 ? een : meer}`;
