import { Mail, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { heeftRol } from "@/access";
import { Bevestig } from "@/components/Bevestig";
import { ItemFormulier } from "@/components/ItemFormulier";
import { AanvraagLabel, KlusLabel, OfferteLabel, PaginaKop, Paneel } from "@/components/ui";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { telefoonInternationaal } from "@/lib/bedrijf";
import { kortDatum } from "@/lib/datum";
import { totalen, prijs } from "@/lib/offerte";
import { gelegenheden, labelVan } from "@/lib/opties";
import { klantVelden } from "@/lib/velddefs";
import { bewaarKlant, vergeetKlant } from "../actions";

export const metadata: Metadata = { title: "Klant" };

export default async function KlantDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const toegang = { user, overrideAccess: false } as const;
  const k = await payload.findByID({ collection: "klanten", id, depth: 0, ...toegang }).catch(() => null);
  if (!k) notFound();

  const beheerder = heeftRol(user, "superadmin", "eigenaar");
  const [aanvragen, klussen, offertes] = await Promise.all([
    payload.find({ collection: "aanvragen", where: { klant: { equals: id } }, sort: "-createdAt", depth: 0, limit: 50, ...toegang }),
    payload.find({ collection: "klussen", where: { klant: { equals: id } }, sort: "-datum", depth: 0, limit: 50, ...toegang }),
    beheerder ? payload.find({ collection: "offertes", where: { klant: { equals: id } }, sort: "-createdAt", depth: 0, limit: 50, ...toegang }) : Promise.resolve({ docs: [] }),
  ]);
  const whatsapp = telefoonInternationaal(k.telefoon);

  return (
    <>
      <PaginaKop titel={k.naam} terug={{ href: "/klanten", label: "Klanten" }} />
      <div className="mb-6 flex flex-wrap gap-3">
        {k.telefoon && (
          <a href={`tel:${k.telefoon.replace(/\s/g, "")}`} className="knop knop-primair">
            <Phone aria-hidden size={18} /> Bel {k.telefoon}
          </a>
        )}
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="knop knop-secundair">
            <MessageCircle aria-hidden size={18} /> WhatsApp
          </a>
        )}
        {k.email && (
          <a href={`mailto:${k.email}`} className="knop knop-secundair">
            <Mail aria-hidden size={18} /> Mail
          </a>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ItemFormulier actie={bewaarKlant.bind(null, k.id)} defs={klantVelden} doc={k as unknown as Record<string, unknown>} />
        <div className="space-y-6">
          <Paneel id="geschiedenis-kop" titel="Geschiedenis">
            {aanvragen.docs.length + klussen.docs.length + offertes.docs.length === 0 ? (
              <p className="px-4 py-5 text-ink-muted">Nog geen aanvragen, offertes of klussen.</p>
            ) : (
              <ul className="divide-y divide-rule">
                {aanvragen.docs.map((a) => (
                  <li key={`a${a.id}`}>
                    <Link href={`/aanvragen/${a.id}`} className="rij-link">
                      <span className="min-w-0 flex-1 basis-40">
                        Aanvraag {labelVan(gelegenheden, a.gelegenheid).toLowerCase()}
                        <span className="block text-sm text-ink-muted">{a.datum ? kortDatum(a.datum) : "Geen datum"}</span>
                      </span>
                      <AanvraagLabel fase={a.fase} />
                    </Link>
                  </li>
                ))}
                {offertes.docs.map((o) => (
                  <li key={`o${o.id}`}>
                    <Link href={`/offertes/${o.id}`} className="rij-link">
                      <span className="min-w-0 flex-1 basis-40">
                        Offerte {o.nummer}
                        <span className="block text-sm text-ink-muted">{prijs(totalen(o.regels).totaal)}</span>
                      </span>
                      <OfferteLabel status={o.status} />
                    </Link>
                  </li>
                ))}
                {klussen.docs.map((j) => (
                  <li key={`k${j.id}`}>
                    <Link href={`/klussen/${j.id}`} className="rij-link">
                      <span className="min-w-0 flex-1 basis-40">
                        {j.titel}
                        <span className="block text-sm text-ink-muted">{kortDatum(j.datum)}</span>
                      </span>
                      <KlusLabel status={j.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Paneel>

          <Paneel id="privacy-kop" titel="Privacy">
            <div className="space-y-3 p-4">
              <p className="max-w-prose">
                Mag je dit nog bewaren? Bewaar alleen wat je voor het werk en de boekhouding nodig hebt. Facturen moet je 7 jaar houden, die staan in je boekhouding en niet hier.
              </p>
              <Bevestig
                actie={vergeetKlant}
                velden={{ id: k.id }}
                gevaar
                knop={
                  <>
                    <ShieldAlert aria-hidden size={18} /> Klant en gegevens verwijderen
                  </>
                }
                titel={`Alles van ${k.naam} verwijderen?`}
                tekst="De klant, de aanvragen, offertes en taken gaan weg. Klussen blijven in de agenda staan, maar zonder naam, adres of notities. Dit kun je niet ongedaan maken."
                ja="Ja, verwijder alles"
              />
            </div>
          </Paneel>
        </div>
      </div>
    </>
  );
}
