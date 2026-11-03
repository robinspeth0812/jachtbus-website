"use client";

import {
  CalendarDays,
  ClipboardCheck,
  Contact,
  FileText,
  Globe,
  House,
  Images,
  Inbox,
  Camera,
  ListChecks,
  LogOut,
  MapPin,
  MapPinned,
  Megaphone,
  Menu,
  MessageCircleQuestion,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Thermometer,
  Ticket,
  Truck,
  Users,
  UtensilsCrossed,
  Wrench,
  X,
  Medal,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { uitloggen } from "@/app/(dashboard)/inloggen/actions";
import { BEDRIJF, GOOGLE_PROFIEL_URL, INSTAGRAM_URL } from "@/lib/bedrijf";

type Props = {
  gebruikersnaam: string;
  nieuweAanvragen: number;
  takenTeDoen: number;
  keuringenTeLaat: number;
  ticketsAanZet: number;
  /** Owners and web builder see prices, website content and settings. */
  beheerder: boolean;
  googleProfiel: string | null;
  instagram: string | null;
};

type Item = { href: string; label: string; icoon: typeof House; badge?: number; badgeLabel?: string; alleenBeheerder?: boolean };

export function Zijbalk({ gebruikersnaam, nieuweAanvragen, takenTeDoen, keuringenTeLaat, ticketsAanZet, beheerder, googleProfiel, instagram }: Props) {
  const pad = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const zoekRef = useRef<HTMLInputElement>(null);
  const navId = useId();

  // After navigating the phone menu closes.
  useEffect(() => setOpen(false), [pad]);

  // Ctrl/Cmd + K jumps to search.
  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => zoekRef.current?.focus());
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, []);

  const groepen: { titel?: string; items: Item[] }[] = [
    { items: [{ href: "/", label: "Home", icoon: House }] },
    {
      titel: "Dagelijks",
      items: [
        { href: "/aanvragen", label: "Aanvragen", icoon: Inbox, badge: nieuweAanvragen, badgeLabel: "nieuw" },
        { href: "/offertes", label: "Offertes", icoon: FileText, alleenBeheerder: true },
        { href: "/agenda", label: "Agenda", icoon: CalendarDays },
        { href: "/klussen", label: "Klussen", icoon: Truck },
        { href: "/taken", label: "Taken", icoon: ListChecks, badge: takenTeDoen, badgeLabel: "nu te doen" },
        { href: "/klanten", label: "Klanten", icoon: Contact },
      ],
    },
    {
      titel: "De bus",
      items: [
        { href: "/bus/keuringen", label: "Keuringen en onderhoud", icoon: Wrench, badge: keuringenTeLaat, badgeLabel: "te laat" },
        { href: "/bus/voedselveiligheid", label: "Voedselveiligheid", icoon: Thermometer },
        { href: "/bus/team", label: "Team", icoon: Users },
      ],
    },
    {
      titel: "Website",
      items: [
        { href: "/website/arrangementen", label: "Arrangementen", icoon: UtensilsCrossed, alleenBeheerder: true },
        { href: "/website/referenties", label: "Referenties", icoon: Medal, alleenBeheerder: true },
        { href: "/website/reviews", label: "Reviews", icoon: Star, alleenBeheerder: true },
        { href: "/website/faq", label: "Veelgestelde vragen", icoon: MessageCircleQuestion, alleenBeheerder: true },
        { href: "/website/werkgebied", label: "Werkgebied", icoon: MapPinned, alleenBeheerder: true },
        { href: "/website/galerij", label: "Galerij", icoon: Images, alleenBeheerder: true },
        { href: "/website/mededelingen", label: "Mededelingen", icoon: Megaphone, alleenBeheerder: true },
      ],
    },
    {
      titel: "Hulp en wensen",
      items: [{ href: "/tickets", label: "Tickets", icoon: Ticket, badge: ticketsAanZet, badgeLabel: "wachten op je reactie" }],
    },
  ];
  const zichtbaar = groepen
    .map((g) => ({ ...g, items: g.items.filter((i) => beheerder || !i.alleenBeheerder) }))
    .filter((g) => g.items.length > 0);

  const extern = [
    { href: BEDRIJF.site, label: "Site", uitleg: "Bekijk de website", icoon: Globe },
    { href: googleProfiel || GOOGLE_PROFIEL_URL, label: "Google", uitleg: "Google-bedrijfsprofiel: foto's en reviews", icoon: MapPin },
    { href: instagram || INSTAGRAM_URL, label: "Instagram", uitleg: "Instagram openen", icoon: Camera },
  ];

  const isActief = (href: string) => (href === "/" ? pad === "/" : pad === href || pad.startsWith(`${href}/`));

  // The four things you do next to the bus, always under your thumb on the phone.
  const onder = [
    { href: "/", label: "Home", icoon: House, badge: 0 },
    { href: "/aanvragen", label: "Aanvragen", icoon: Inbox, badge: nieuweAanvragen },
    { href: "/klussen", label: "Klussen", icoon: Truck, badge: 0 },
    { href: "/bus/voedselveiligheid", label: "Meten", icoon: ShieldCheck, badge: 0 },
  ];

  return (
    <>
      <header className="bg-donker text-nav-text lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <a href="#inhoud" className="sr-only z-[60] bg-signaal px-4 py-3 font-semibold text-donker focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Naar de inhoud
        </a>
        {/* Roof stripe of the bus. */}
        <div aria-hidden className="h-1.5 shrink-0 bg-signaal" />
        <div className="flex items-center justify-between gap-3 px-4 py-2 lg:justify-center lg:py-4">
          <Link href="/" className="inline-flex no-underline" aria-label="Jachtbus, naar de home van het portaal">
            {/* eslint-disable-next-line @next/next/no-img-element -- local brand SVG */}
            <img src="/jachtbus-logo-wit-goud.svg" alt="" width={917} height={746} className="h-12 w-auto lg:h-20" />
          </Link>
          <Link href="/zoeken" className="inline-flex min-h-doel items-center gap-2 border border-nav-rand px-3 no-underline lg:hidden">
            <Search aria-hidden size={20} />
            Zoeken
          </Link>
        </div>

        <div id={navId} className={`${open ? "flex" : "hidden"} fixed inset-x-0 top-0 bottom-onderbalk z-40 min-h-0 flex-col overflow-y-auto bg-donker lg:static lg:flex lg:flex-1 lg:overflow-hidden`}>
          <div aria-hidden className="h-1.5 shrink-0 bg-signaal lg:hidden" />
          <form
            role="search"
            className="shrink-0 px-4 pt-4 pb-4 lg:pt-0"
            onSubmit={(e) => {
              e.preventDefault();
              const q = zoekRef.current?.value.trim();
              if (q) router.push(`/zoeken?q=${encodeURIComponent(q)}`);
            }}
          >
            <label htmlFor="zoeken" className="sr-only">
              Zoeken in aanvragen, klanten, klussen en website
            </label>
            <div className="flex min-h-doel items-center gap-2 border border-nav-rand bg-donker-hoog px-3 focus-within:border-nav-muted">
              <Search aria-hidden size={18} className="shrink-0 text-nav-muted" />
              <input
                ref={zoekRef}
                id="zoeken"
                name="q"
                type="search"
                placeholder="Zoeken"
                className="min-w-0 flex-1 bg-transparent py-2 text-nav-text placeholder:text-nav-muted focus:outline-none"
              />
              <kbd className="hidden shrink-0 border border-nav-rand px-1.5 font-sans text-xs text-nav-muted lg:inline">Ctrl K</kbd>
            </div>
          </form>

          <nav aria-label="Hoofdmenu" className="zijbalk-scroll min-h-0 flex-1 px-2 lg:overflow-y-auto">
            {zichtbaar.map((groep, gi) => (
              <div key={gi} className={gi > 0 ? "mt-4" : ""}>
                {/* Not a heading: it would come before the page's h1. The list takes the group's name. */}
                {groep.titel && (
                  <p id={`${navId}-groep-${gi}`} className="px-3 pb-1 text-sm text-nav-muted">
                    {groep.titel}
                  </p>
                )}
                <ul className="space-y-0.5" aria-labelledby={groep.titel ? `${navId}-groep-${gi}` : undefined}>
                  {groep.items.map(({ href, label, icoon: Icoon, badge, badgeLabel }) => {
                    const actief = isActief(href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={pad === href ? "page" : undefined}
                          className={`flex min-h-doel items-center gap-3 px-3 no-underline transition-colors duration-150 hover:bg-donker-hover ${actief ? "nav-actief font-semibold" : ""}`}
                        >
                          <Icoon aria-hidden size={20} className={`shrink-0 ${actief ? "text-white" : "text-nav-muted"}`} />
                          <span className="min-w-0 flex-1">{label}</span>
                          {badge ? (
                            <span className="shrink-0 bg-signaal px-1.5 text-sm font-semibold text-donker">
                              {badge}
                              <span className="sr-only"> {badgeLabel}</span>
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-4 shrink-0 space-y-1 border-t border-nav-rand px-2 py-3 lg:mt-0">
            <ul aria-label="Snel naar, opent in een nieuw tabblad" className="grid grid-cols-3 gap-1 pb-1">
              {extern.map(({ href, label, uitleg, icoon: Icoon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={uitleg}
                    className="flex min-h-doel flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-sm text-nav-text no-underline transition-colors duration-150 hover:bg-donker-hover"
                  >
                    <Icoon aria-hidden size={18} className="shrink-0 text-nav-muted" />
                    <span>{label}</span>
                    <span className="sr-only">: {uitleg}</span>
                  </a>
                </li>
              ))}
            </ul>
            {beheerder && (
              <Link
                href="/instellingen"
                aria-current={pad === "/instellingen" ? "page" : undefined}
                className={`flex min-h-doel items-center gap-3 px-3 no-underline transition-colors duration-150 hover:bg-donker-hover ${isActief("/instellingen") ? "nav-actief font-semibold" : ""}`}
              >
                <Settings aria-hidden size={20} className="shrink-0 text-nav-muted" />
                Instellingen
              </Link>
            )}
            <form action={uitloggen}>
              <button type="submit" className="flex min-h-doel w-full items-center gap-3 px-3 text-left transition-colors duration-150 hover:bg-donker-hover">
                <LogOut aria-hidden size={20} className="shrink-0 text-nav-muted" />
                <span className="min-w-0 flex-1">
                  Uitloggen
                  <span className="block truncate text-sm text-nav-muted">{gebruikersnaam}</span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Phone: bottom navigation with big targets. */}
      <nav aria-label="Snelmenu" className="fixed inset-x-0 bottom-0 z-50 border-t border-nav-rand bg-donker text-nav-text lg:hidden">
        <ul className="grid h-onderbalk grid-cols-5">
          {onder.map(({ href, label, icoon: Icoon, badge }) => {
            const actief = isActief(href) && !open;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pad === href ? "page" : undefined}
                  className={`relative flex h-full flex-col items-center justify-center gap-0.5 text-xs no-underline ${actief ? "onder-actief font-semibold" : "text-nav-text"}`}
                >
                  <Icoon aria-hidden size={22} />
                  {label}
                  {badge > 0 && (
                    <span className="absolute top-1.5 left-1/2 ml-2 bg-signaal px-1 text-xs font-semibold text-donker">
                      {badge}
                      <span className="sr-only"> nieuw</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={navId}
              onClick={() => setOpen((o) => !o)}
              className={`flex h-full w-full flex-col items-center justify-center gap-0.5 text-xs ${open ? "onder-actief font-semibold" : ""}`}
            >
              {open ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
              {open ? "Sluiten" : "Menu"}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
