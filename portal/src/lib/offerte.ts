/** Pure money maths for quotes. No Payload imports: also used in client components. */
export type OfferteRegel = { omschrijving?: string | null; aantal?: number | null; prijs?: number | null; btw?: string | null };

const centen = (n: number) => Math.round(n * 100) / 100;

export const regelBedrag = (r: OfferteRegel) => centen((Number(r.aantal) || 0) * (Number(r.prijs) || 0));

/** Unit prices are excluding VAT. */
export function totalen(regels: readonly OfferteRegel[] | null | undefined) {
  const lijst = regels ?? [];
  const excl = centen(lijst.reduce((s, r) => s + regelBedrag(r), 0));
  const grond = (tarief: string) => lijst.filter((r) => (r.btw ?? "9") === tarief).reduce((s, r) => s + regelBedrag(r), 0);
  const btw9 = centen(grond("9") * 0.09);
  const btw21 = centen(grond("21") * 0.21);
  return { excl, btw9, btw21, totaal: centen(excl + btw9 + btw21) };
}

const formaat = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
export const prijs = (n: number | null | undefined) => (n === null || n === undefined ? "-" : formaat.format(n).replace(/^€\s?/, "€ "));
