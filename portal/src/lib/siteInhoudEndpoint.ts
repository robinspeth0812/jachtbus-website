import { headersWithCors, type Endpoint } from "payload";
import { BEDRIJF } from "./bedrijf";
import { isoNaarDag } from "./datum";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "https://portal.jachtbusfoodtruck.nl";
const GEPUBLICEERD = { status: { equals: "gepubliceerd" } } as const;

/** Only keeps keys with a real value, so optional fields really are absent. */
const zonderLeeg = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== ""));

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

    const [instellingen, mededelingen, arrangementen, referenties, reviews, faq, plaatsen] = await Promise.all([
      payload.findGlobal({ slug: "instellingen", depth: 0, overrideAccess: true }),
      payload.find({ collection: "mededelingen", where: GEPUBLICEERD, sort: "vanaf", depth: 0, ...vraag }),
      payload.find({ collection: "arrangementen", where: GEPUBLICEERD, sort: "volgorde", depth: 0, ...vraag }),
      payload.find({ collection: "referenties", where: { and: [GEPUBLICEERD, { toestemming: { equals: true } }] }, sort: "-datum", depth: 1, ...vraag }),
      payload.find({ collection: "reviews", where: GEPUBLICEERD, sort: "-createdAt", depth: 0, ...vraag }),
      payload.find({ collection: "veelgesteld", where: GEPUBLICEERD, sort: "volgorde", depth: 0, ...vraag }),
      payload.find({ collection: "plaatsen", where: GEPUBLICEERD, sort: "naam", depth: 0, ...vraag }),
    ]);

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
        zonderLeeg({ tekst: m.tekst, linkTekst: m.linkTekst, linkUrl: m.linkUrl, vanaf: isoNaarDag(m.vanaf), tot: isoNaarDag(m.tot) }),
      ),
      arrangementen: arrangementen.docs.map((a) => ({ slug: a.slug, titel: a.titel, kort: a.kort, tekst: a.tekst, volgorde: a.volgorde ?? 0 })),
      referenties: referenties.docs.map((r) => {
        const foto = typeof r.foto === "object" && r.foto ? r.foto : null;
        const fotoMag = foto && (foto.personen === "geen" || foto.personen === "toestemming");
        const fotoPad = fotoMag ? foto.sizes?.groot?.url || foto.url : null;
        return zonderLeeg({
          slug: r.slug,
          titel: r.titel,
          plaats: r.plaats,
          gelegenheid: r.gelegenheid,
          gasten: r.gasten,
          datum: isoNaarDag(r.datum),
          verhaal: r.verhaal,
          // Payload gives an absolute URL when serverURL is set, a path otherwise.
          fotoUrl: fotoPad ? (fotoPad.startsWith("http") ? fotoPad : `${SERVER}${fotoPad}`) : undefined,
          fotoAlt: fotoMag ? foto.alt : undefined,
        });
      }),
      reviews: reviews.docs.map((r) =>
        zonderLeeg({ naam: r.naam, gelegenheid: r.gelegenheid, plaats: r.plaats, tekst: r.tekst, bron: r.bron, bronUrl: r.bronUrl }),
      ),
      faq: faq.docs.map((f) => ({ vraag: f.vraag, antwoord: f.antwoord, pagina: f.pagina })),
      plaatsen: plaatsen.docs.map((p) => ({ naam: p.naam, provincie: p.provincie })),
    };

    const headers = headersWithCors({ headers: new Headers({ "Cache-Control": "public, max-age=60, s-maxage=300" }), req });
    return Response.json(body, { headers });
  },
};
