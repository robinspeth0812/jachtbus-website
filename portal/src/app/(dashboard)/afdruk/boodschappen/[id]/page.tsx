import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { payloadClient, vereisGebruiker, vereisModule } from "@/lib/auth";
import { datumLang } from "@/lib/datum";
import { Afdrukbalk } from "../../Afdrukbalk";
import "../../afdruk.css";

export const metadata: Metadata = { title: "Boodschappenlijst afdrukken" };

export default async function BoodschappenAfdruk({ params }: { params: Promise<{ id: string }> }) {
  vereisModule("klussen");
  const user = await vereisGebruiker();
  const payload = await payloadClient();
  const id = Number((await params).id);
  const k = await payload.findByID({ collection: "klussen", id, depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!k) notFound();

  return (
    <>
      <Afdrukbalk terug={`/klussen/${k.id}?tab=boodschappen`} label={k.titel} uitleg="Handig om mee te nemen naar de groothandel." />
      <div className="a4-buiten">
        <main className="a4">
          <div className="a4-streep" aria-hidden />
          <h1 className="a4-titel">Boodschappen</h1>
          <p>
            {k.titel}, {datumLang(k.datum)}
            {k.gasten ? `, ${k.gasten} gasten` : ""}
          </p>
          <table className="a4-tabel">
            <thead>
              <tr>
                <th scope="col" style={{ width: "8mm" }}>
                  <span className="sr-only">Gehaald</span>
                </th>
                <th scope="col">Wat</th>
                <th scope="col" className="getal">
                  Hoeveel
                </th>
              </tr>
            </thead>
            <tbody>
              {(k.boodschappen ?? []).map((b, i) => (
                <tr key={b.id ?? i}>
                  <td>
                    <span className="a4-vakje" aria-hidden />
                  </td>
                  <td>{b.gedaan ? <s>{b.naam}</s> : b.naam}</td>
                  <td className="getal">
                    {b.hoeveelheid ?? ""} {b.eenheid ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
