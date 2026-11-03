import type { Payload } from "payload";

const PORTAL = process.env.NEXT_PUBLIC_SERVER_URL || "https://portal.jachtbusfoodtruck.nl";

const html = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const omhulsel = (inhoud: string) =>
  `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#000000;max-width:560px">${inhoud}</div>`;

/**
 * Short notice from the portal: a few sentences and one link.
 * A failed send is logged and the action carries on. Without SMTP Payload only
 * logs the mail (local).
 */
export async function stuurMelding(
  payload: Payload,
  { aan, onderwerp, alineas, pad, knop, antwoordAan }: { aan: string[]; onderwerp: string; alineas: string[]; pad: string; knop: string; antwoordAan?: string },
) {
  const ontvangers = [...new Set(aan.filter(Boolean))];
  if (ontvangers.length === 0) return;
  const link = `${PORTAL}${pad}`;
  const text = ["Moi,", "", ...alineas.flatMap((a) => [a, ""]), `${knop}: ${link}`].join("\n");
  const body = omhulsel(
    `<p>Moi,</p>${alineas.map((a) => `<p style="white-space:pre-line">${html(a)}</p>`).join("")}<p><a href="${html(link)}" style="color:#000000;font-weight:600">${html(knop)}</a></p>`,
  );
  try {
    await payload.sendEmail({ to: ontvangers, subject: onderwerp, text, html: body, ...(antwoordAan ? { replyTo: antwoordAan } : {}) });
  } catch {
    payload.logger.error(`Mail versturen mislukt: ${onderwerp}`);
  }
}

/** Plain mail to someone outside the portal, such as the confirmation to a requester. */
export async function stuurTekstMail(payload: Payload, { aan, onderwerp, alineas }: { aan: string; onderwerp: string; alineas: string[] }) {
  try {
    await payload.sendEmail({
      to: aan,
      subject: onderwerp,
      text: alineas.join("\n\n"),
      html: omhulsel(alineas.map((a) => `<p style="white-space:pre-line">${html(a)}</p>`).join("")),
    });
  } catch {
    payload.logger.error(`Mail versturen mislukt: ${onderwerp}`);
  }
}

export async function adressenVan(payload: Payload, rollen: string[]) {
  const { docs } = await payload.find({
    collection: "users",
    where: { rol: { in: rollen } },
    select: { email: true },
    limit: 20,
    depth: 0,
    overrideAccess: true,
  });
  return docs.map((u) => u.email).filter(Boolean);
}

/** Recipients of a kind of mail, from Instellingen. Nobody chosen: the owners. */
export async function ontvangersVan(payload: Payload, soort: "aanvraag" | "herinnering") {
  const instellingen = await payload.findGlobal({ slug: "instellingen", depth: 1, overrideAccess: true });
  const keuze = instellingen.mail?.[soort];
  const mensen = (keuze?.aan ?? []).flatMap((u) => (typeof u === "object" && u?.email ? [u.email] : []));
  const adressen = [...mensen, ...(keuze?.extra ? [keuze.extra] : [])];
  return adressen.length ? [...new Set(adressen)] : adressenVan(payload, ["eigenaar"]);
}
