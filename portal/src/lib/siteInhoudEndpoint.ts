import { headersWithCors, type Endpoint, type Where } from "payload";
import type { Media } from "@/payload-types";
import { BEDRIJF } from "./bedrijf";
import { bezetteStatussen } from "./opties";
import { moduleAan } from "./pakket";
import { dagNaarIso, isoNaarDag, nederlandseDatum } from "./datum";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "https://portal.jachtbusfoodtruck.nl";
const GEPUBLICEERD = { status: { equals: "gepubliceerd" } } as const;

/** Only keeps keys with a real value, so optional fields really are absent. */
const zonderLeeg = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== ""));

/** A photo for the site: only without recognisable people, or with their consent. */
const fotoVoorSite = (waarde: number | Media | null | undefined) => {
  const foto = typeof waarde === "object" && waarde ? waarde : null;
  if (!foto || (foto.personen !== "geen" && foto.personen !== "toestemming")) return null;
  const pad = foto.sizes?.groot?.url || foto.url;
  if (!pad) return null;
  // Payload gives an absolute URL when serverURL is set, a path otherwise.
  return { fotoUrl: pad.startsWith("http") ? pad : `${SERVER}${pad}`, fotoAlt: foto.alt };
};

/**
 * GET /api/site-inhoud: everything the site needs at build time. Each item is
 * rebuilt field by field from a known list, so nothing internal (prices,
 * ingredients, evidence notes) can slip out, and nothing private is queried.
 */
export const siteInhoudEndpoint: Endpoint = {
  path: "/site-inhoud",
  method: "get",
  handler: async (req) => {
    const { payload } = req;
    const vraag = { overrideAccess: true, limit: 500, pagination: false } as const;

    // Today at noon UTC, like every stored date: an event stays on until its last day is over.
    const vandaag = dagNaarIso(nederlandseDatum());
    const vanafVandaag: Where = { or: [{ datum: { greater_than_equal: vandaag } }, { totDatum: { greater_than_equal: vandaag } }] };
    const [instellingen, mededelingen, arrangementen, referenties, reviews, faq, plaatsen, evenementen, afspraken, geboekt, klussen] = await Promise.all([
      payload.findGlobal({ slug: "instellingen", depth: 0, overrideAccess: true }),
      payload.find({ collection: "mededelingen", where: GEPUBLICEERD, sort: "volgorde", depth: 0, ...vraag }),
      payload.find({ collection: "arrangementen", where: GEPUBLICEERD, sort: "volgorde", depth: 0, ...vraag }),
      payload.find({ collection: "referenties", where: { and: [GEPUBLICEERD, { toestemming: { equals: true } }] }, sort: "-datum", depth: 1, ...vraag }),
      payload.find({ collection: "reviews", where: GEPUBLICEERD, sort: "-createdAt", depth: 2, ...vraag }),
      payload.find({ collection: "veelgesteld", where: GEPUBLICEERD, sort: "volgorde", depth: 0, ...vraag }),
      payload.find({ collection: "plaatsen", where: GEPUBLICEERD, sort: "naam", depth: 0, ...vraag }),
      payload.find({ collection: "evenementen", where: { and: [GEPUBLICEERD, { soort: { equals: "event" } }, vanafVandaag] }, sort: "datum", depth: 1, ...vraag }),
      payload.find({ collection: "evenementen", where: { and: [GEPUBLICEERD, { soort: { equals: "afspraak" } }, vanafVandaag] }, sort: "datum", depth: 0, ...vraag }),
      // Confirmed requests count as booked without anyone typing them in twice. Only the date leaves the portal.
      payload.find({ collection: "aanvragen", where: { and: [{ fase: { equals: "bevestigd" } }, { datum: { greater_than_equal: vandaag } }] }, sort: "datum", depth: 0, select: { datum: true }, ...vraag }),
      moduleAan("klussen")
        ? payload.find({ collection: "klussen", where: { and: [{ status: { in: bezetteStatussen } }, { datum: { greater_than_equal: vandaag } }] }, sort: "datum", depth: 0, select: { datum: true }, ...vraag })
        : { docs: [] as { datum: string }[] },
    ]);

    // Private bookings: the date only, one entry per day or range.
    type Bezet = { datum: string; totDatum?: string };
    const bezet = (
      [
      ...afspraken.docs.map((a) => ({ datum: isoNaarDag(a.datum), ...(a.totDatum ? { totDatum: isoNaarDag(a.totDatum) } : {}) })),
      ...geboekt.docs.map((a) => ({ datum: isoNaarDag(a.datum) })),
      ...klussen.docs.map((k) => ({ datum: isoNaarDag(k.datum) })),
      ] as Bezet[]
    )
      .filter((b, i, alle) => b.datum && alle.findIndex((c) => c.datum === b.datum && c.totDatum === b.totDatum) === i)
      .sort((a, b) => a.datum.localeCompare(b.datum));

    const body = {
      contact: {
        telefoon: instellingen.contact?.telefoon || BEDRIJF.telefoon,
        whatsapp: instellingen.contact?.whatsapp || "",
        email: instellingen.contact?.email || "",
      },
      profielen: zonderLeeg({
        instagram: instellingen.profielen?.instagram,
        facebook: instellingen.profielen?.facebook,
        google: instellingen.profielen?.google,
      }),
      mededelingen: mededelingen.docs.map((m) =>
        zonderLeeg({ tekst: m.tekst, linkTekst: m.linkTekst, linkUrl: m.linkUrl, vanaf: isoNaarDag(m.vanaf), tot: isoNaarDag(m.tot), dagen: m.dagen?.length ? m.dagen : null, vanTijd: m.vanTijd, totTijd: m.totTijd }),
      ),
      arrangementen: arrangementen.docs.map((a) => ({ slug: a.slug, titel: a.titel, kort: a.kort, tekst: a.tekst, volgorde: a.volgorde ?? 0 })),
      referenties: referenties.docs.map((r) =>
        zonderLeeg({
          slug: r.slug,
          titel: r.titel,
          plaats: r.plaats,
          lat: r.lat,
          lng: r.lng,
          gelegenheid: r.gelegenheid,
          mogelijkheden: r.mogelijkheden?.length ? r.mogelijkheden : null,
          gasten: r.gasten,
          datum: isoNaarDag(r.datum),
          verhaal: r.verhaal,
          ...fotoVoorSite(r.foto),
        }),
      ),
      reviews: reviews.docs.map((r) => {
        // A linked reference only counts once it may be public itself.
        const gekoppeld = typeof r.referentie === "object" && r.referentie ? r.referentie : null;
        const verwijzing = gekoppeld?.status === "gepubliceerd" && gekoppeld.toestemming ? gekoppeld : null;
        return zonderLeeg({
          naam: r.naam,
          gelegenheid: r.gelegenheid || verwijzing?.gelegenheid,
          plaats: r.plaats || verwijzing?.plaats,
          tekst: r.tekst,
          bron: r.bron,
          bronUrl: r.bronUrl,
          sterren: r.sterren ?? undefined,
          caseSlug: verwijzing?.slug,
          caseTitel: verwijzing?.titel,
          ...(fotoVoorSite(r.foto) ?? fotoVoorSite(verwijzing?.foto)),
        });
      }),
      faq: faq.docs.map((f) => ({ vraag: f.vraag, antwoord: f.antwoord, pagina: f.pagina })),
      plaatsen: plaatsen.docs.map((p) => ({ naam: p.naam, provincie: p.provincie })),
      bezet,
      evenementen: evenementen.docs.map((e) =>
        zonderLeeg({
          titel: e.titel,
          datum: isoNaarDag(e.datum),
          totDatum: isoNaarDag(e.totDatum),
          vanTijd: e.vanTijd,
          totTijd: e.totTijd,
          plaats: e.plaats,
          locatie: e.locatie,
          tekst: e.tekst,
          linkTekst: e.linkTekst,
          linkUrl: e.linkUrl,
          ...fotoVoorSite(e.foto),
        }),
      ),
    };

    const headers = headersWithCors({ headers: new Headers({ "Cache-Control": "public, max-age=60, s-maxage=300" }), req });
    return Response.json(body, { headers });
  },
};
