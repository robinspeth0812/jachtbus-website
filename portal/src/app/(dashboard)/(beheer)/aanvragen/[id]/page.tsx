import { FileText, Mail, MessageCircle, Phone, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { heeftRol } from "@/access";
import { ActieKnop } from "@/components/ActieKnop";
import { Verwijderen } from "@/components/Formulier";
import { AanvraagLabel, Gegevens, Melding, PaginaKop, Paneel, Waarschuwing } from "@/components/ui";
import { bezetOpDag } from "@/lib/agenda";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { BEDRIJF, telefoonInternationaal } from "@/lib/bedrijf";
import { datumLang, isoNaarDag, momentTekst } from "@/lib/datum";
import { aanvraagFasen, gelegenheden, labelVan, momentenOpties } from "@/lib/opties";
import { FaseKeuze, NotitieVeld } from "./Onderdelen";
import { maakKlus, verwijderAanvraag } from "../actions";

export const metadata: Metadata = { title: "Aanvraag" };

export default async function AanvraagDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ fout?: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const { id } = await params;
  const { fout } = await searchParams;
  const a = await payload.findByID({ collection: "aanvragen", id: Number(id), depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!a) notFound();

  const beheerder = heeftRol(user, "superadmin", "eigenaar");
  const klant = typeof a.klant === "object" ? a.klant : null;
  const klus = typeof a.klus === "object" ? a.klus : null;
  const bezet = a.datum ? await payload.find({ collection: "klussen", where: bezetOpDag(isoNaarDag(a.datum)), depth: 0, limit: 5, user, overrideAccess: false }) : null;
  const anderen = bezet?.docs.filter((k) => k.id !== klus?.id) ?? [];
  const whatsapp = telefoonInternationaal(a.telefoon);
  const gelegenheid = a.gelegenheid === "overige" && a.gelegenheidOverig ? `Iets anders: ${a.gelegenheidOverig}` : labelVan(gelegenheden, a.gelegenheid);

  return (
    <>
      <PaginaKop titel={a.naam} status={<AanvraagLabel fase={a.fase} />} terug={{ href: "/aanvragen", label: "Aanvragen" }} />

      <div className="space-y-3">
        {fout === "datum" && <Melding soort="fout">Er staat nog geen datum bij deze aanvraag. Vraag die eerst na, dan kun je er een klus van maken.</Melding>}
        {a.gasten !== null && a.gasten !== undefined && a.gasten < BEDRIJF.minimumGasten && (
          <Waarschuwing titel={`Minder dan ${BEDRIJF.minimumGasten} gasten`}>Deze aanvraag is voor {a.gasten} gasten. Jullie minimum is {BEDRIJF.minimumGasten}.</Waarschuwing>
        )}
        {anderen.length > 0 && (
          <Waarschuwing soort="fout" titel="De bus staat die dag al ergens">
            <ul>
              {anderen.map((k) => (
                <li key={k.id}>
                  <Link href={`/klussen/${k.id}`} className="underline">
                    {k.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </Waarschuwing>
        )}
      </div>

      {/* Reach the person: first thing you need next to the bus. */}
      <div className="my-6 flex flex-wrap gap-3">
        {a.telefoon && (
          <a href={`tel:${a.telefoon.replace(/\s/g, "")}`} className="knop knop-primair">
            <Phone aria-hidden size={18} /> Bel {a.telefoon}
          </a>
        )}
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="knop knop-secundair">
            <MessageCircle aria-hidden size={18} /> WhatsApp
          </a>
        )}
        <a href={`mailto:${a.email}`} className="knop knop-secundair">
          <Mail aria-hidden size={18} /> Mail
        </a>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Paneel id="gegevens-kop" titel="Wat ze invulden">
          <Gegevens
            rijen={[
              ["Gelegenheid", gelegenheid],
              ["Datum", a.datum ? datumLang(a.datum) : null],
              ["Tijd", a.tijd],
              ["Momenten", a.momenten?.length ? a.momenten.map((m) => labelVan(momentenOpties, m)).join(", ") : null],
              ["Plaats", a.plaats],
              ["Aantal gasten", a.gasten ? String(a.gasten) : null],
              ["Locatie", a.locatie],
              ["E-mail", a.email],
              ["Bedrijf", a.bedrijf],
              ["Telefoon", a.telefoon],
              ["Opmerking", a.opmerking],
              ["Binnengekomen", `${momentTekst(a.createdAt)}, ${a.bron === "handmatig" ? "zelf toegevoegd" : "via de site"}`],
              ["Klant", klant ? <Link key="k" href={`/klanten/${klant.id}`} className="inline-flex min-h-doel items-center underline">{klant.naam}</Link> : null],
            ]}
          />
        </Paneel>

        <div className="space-y-6">
          <Paneel id="fase-kop" titel="Volgende stap">
            <div className="space-y-4 p-4">
              <FaseKeuze id={a.id} fase={a.fase} fasen={aanvraagFasen.map((f) => ({ value: f.value, label: f.label }))} />
              <div className="flex flex-wrap gap-3 border-t border-rule pt-4">
                {klus ? (
                  <Link href={`/klussen/${klus.id}`} className="knop knop-secundair">
                    <Truck aria-hidden size={18} /> Naar de klus
                  </Link>
                ) : (
                  <ActieKnop actie={maakKlus} velden={{ id: a.id }} voor={a.naam} klasse="knop knop-primair">
                    <Truck aria-hidden size={18} /> Maak klus
                  </ActieKnop>
                )}
                {beheerder && (
                  <Link href={`/offertes/nieuw?aanvraag=${a.id}`} className="knop knop-secundair">
                    <FileText aria-hidden size={18} /> Maak offerte
                  </Link>
                )}
              </div>
            </div>
          </Paneel>

          <Paneel id="notities-kop" titel="Notities">
            <div className="p-4">
              <NotitieVeld id={a.id} waarde={a.notities ?? ""} />
            </div>
          </Paneel>
        </div>
      </div>

      <div className="mt-6">
        <Verwijderen actie={verwijderAanvraag} id={a.id} wat="Aanvraag" naam={a.naam} extra="De taken die erbij horen gaan ook weg. De klant blijft staan." />
      </div>
    </>
  );
}

