import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { payloadClient, vereisBeheerder, vereisModule } from "@/lib/auth";
import { AANBETALING_BEVESTIGD, BEDRIJF } from "@/lib/bedrijf";
import { datum, nederlandseDatum } from "@/lib/datum";
import { prijs, regelBedrag, totalen } from "@/lib/offerte";
import { Afdrukbalk } from "../../Afdrukbalk";
import "../../afdruk.css";

export const metadata: Metadata = { title: "Offerte afdrukken" };

export default async function OfferteAfdruk({ params }: { params: Promise<{ id: string }> }) {
  vereisModule("offertes");
  const user = await vereisBeheerder();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const o = await payload.findByID({ collection: "offertes", id, depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!o) notFound();
  const klant = typeof o.klant === "object" ? o.klant : null;
  const instellingen = await payload.findGlobal({ slug: "instellingen", depth: 0, user, overrideAccess: false });
  const t = totalen(o.regels);

  return (
    <>
      <Afdrukbalk terug={`/offertes/${o.id}`} label={`Offerte ${o.nummer}`} uitleg="Kies in het printvenster Opslaan als PDF om hem te mailen." />
      <div className="a4-buiten">
        <main className="a4">
          <div className="a4-streep" aria-hidden />
          <div className="a4-kop">
            <div>
              <h1 className="a4-titel">Offerte</h1>
              <p>{o.titel}</p>
            </div>
            <div className="a4-rechts">
              <p>
                <strong>{BEDRIJF.naam}</strong>
                <br />
                {BEDRIJF.adres}
                <br />
                {BEDRIJF.postcode} {BEDRIJF.plaats}
                <br />
                {instellingen.contact?.telefoon || BEDRIJF.telefoon}
                {instellingen.contact?.email && (
                  <>
                    <br />
                    {instellingen.contact.email}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="a4-kop">
            <div>
              <p>
                <strong>Voor</strong>
                <br />
                {klant?.naam}
                {klant?.bedrijf && (
                  <>
                    <br />
                    {klant.bedrijf}
                  </>
                )}
                {klant?.adres && (
                  <>
                    <br />
                    {klant.adres}
                  </>
                )}
                {klant?.plaats && (
                  <>
                    <br />
                    {klant.plaats}
                  </>
                )}
              </p>
            </div>
            <div className="a4-rechts">
              <p>
                Offertenummer {o.nummer}
                <br />
                Datum {datum(o.verstuurdOp ?? nederlandseDatum())}
                <br />
                Geldig tot {datum(o.geldigTot)}
              </p>
            </div>
          </div>

          {o.intro && <p className="a4-tekst">{o.intro}</p>}

          <table className="a4-tabel">
            <thead>
              <tr>
                <th scope="col">Omschrijving</th>
                <th scope="col" className="getal">
                  Aantal
                </th>
                <th scope="col" className="getal">
                  Prijs
                </th>
                <th scope="col" className="getal">
                  Btw
                </th>
                <th scope="col" className="getal">
                  Bedrag
                </th>
              </tr>
            </thead>
            <tbody>
              {(o.regels ?? []).map((r, i) => (
                <tr key={r.id ?? i}>
                  <td>{r.omschrijving}</td>
                  <td className="getal">{r.aantal}</td>
                  <td className="getal">{prijs(r.prijs)}</td>
                  <td className="getal">{r.btw}%</td>
                  <td className="getal">{prijs(regelBedrag(r))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="a4-totalen">
            <div>
              <span>Totaal exclusief btw</span>
              <span>{prijs(t.excl)}</span>
            </div>
            {t.btw9 > 0 && (
              <div>
                <span>Btw 9%</span>
                <span>{prijs(t.btw9)}</span>
              </div>
            )}
            {t.btw21 > 0 && (
              <div>
                <span>Btw 21%</span>
                <span>{prijs(t.btw21)}</span>
              </div>
            )}
            <div className="a4-totaal">
              <span>Totaal</span>
              <span>{prijs(t.totaal)}</span>
            </div>
          </div>

          {o.slot && <p className="a4-tekst">{o.slot}</p>}

          {AANBETALING_BEVESTIGD ? (
            <p className="a4-tekst">We vragen een aanbetaling van 50% om de datum vast te leggen.</p>
          ) : (
            <p className="a4-concept">
              <strong>CONCEPT, nog niet bevestigd door Peer:</strong> we vragen een aanbetaling van 50% om de datum vast te leggen. Haal deze regel weg of bevestig hem voordat je deze offerte verstuurt.
            </p>
          )}

          <p className="a4-voet">
            {BEDRIJF.naam}, {BEDRIJF.adres}, {BEDRIJF.postcode} {BEDRIJF.plaats}. KVK {BEDRIJF.kvk}. {BEDRIJF.site.replace("https://", "")}
          </p>
        </main>
      </div>
    </>
  );
}
