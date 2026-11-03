import type { TaskConfig } from "payload";
import { momentTekst } from "../lib/datum";
import { ontvangersVan } from "../lib/mail";

const PORTAL = process.env.NEXT_PUBLIC_SERVER_URL || "https://portal.jachtbusfoodtruck.nl";
const html = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Taak = { titel: string; vervalt: string; aanvraag?: number | { id: number } | null; klus?: number | { id: number } | null };

const idVan = (x: number | { id: number } | null | undefined) => (typeof x === "object" ? x?.id : x);
const linkVan = (t: Taak) => {
  const aanvraag = idVan(t.aanvraag);
  const klus = idVan(t.klus);
  return aanvraag ? `${PORTAL}/aanvragen/${aanvraag}` : klus ? `${PORTAL}/klussen/${klus}` : `${PORTAL}/taken`;
};

export function herinneringsMail(taken: Taak[]) {
  const subject = taken.length === 1 ? `Herinnering: ${taken[0].titel}` : `${taken.length} taken vragen aandacht`;
  const kop = taken.length === 1 ? "Deze taak staat nog open:" : "Deze taken staan nog open:";
  const text = [
    "Moi,",
    "",
    kop,
    "",
    ...taken.map((t) => `- ${t.titel} (sinds ${momentTekst(t.vervalt)})\n  ${linkVan(t)}`),
    "",
    `Alle taken: ${PORTAL}/taken`,
    "",
    "Klaar? Vink de taak af in het portaal, dan komt hij niet meer terug.",
  ].join("\n");
  const lijst = taken
    .map(
      (t) =>
        `<li style="margin:0 0 12px"><a href="${html(linkVan(t))}" style="color:#1b1817;font-weight:600">${html(t.titel)}</a><br><span style="color:#5a534e">Sinds ${html(momentTekst(t.vervalt))}</span></li>`,
    )
    .join("");
  const body = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#1b1817;max-width:560px"><p>Moi,</p><p>${kop}</p><ul style="padding-left:20px">${lijst}</ul><p><a href="${html(`${PORTAL}/taken`)}" style="color:#1b1817">Alle taken bekijken</a></p></div>`;
  return { subject, text, html: body };
}

/** Hourly: overdue tasks not mailed yet, in one mail. Each task is mailed once. */
export const mailHerinneringen: TaskConfig<{ input: object; output: { verstuurd: number } }> = {
  slug: "mailHerinneringen",
  label: "Herinneringen mailen",
  schedule: [{ cron: "0 * * * *", queue: "herinneringen" }],
  outputSchema: [{ name: "verstuurd", type: "number", required: true }],
  retries: 2,
  handler: async ({ req }) => {
    const { payload } = req;
    const { docs: taken } = await payload.find({
      collection: "taken",
      where: { and: [{ klaar: { equals: false } }, { gemaild: { not_equals: true } }, { vervalt: { less_than_equal: new Date().toISOString() } }] },
      sort: "vervalt",
      limit: 50,
      depth: 0,
      req,
    });
    if (taken.length === 0) return { output: { verstuurd: 0 } };
    const aan = await ontvangersVan(payload, "herinnering");
    if (aan.length === 0) {
      payload.logger.warn("Herinneringen: geen ontvanger met een e-mailadres; niets verstuurd.");
      return { output: { verstuurd: 0 } };
    }
    await payload.sendEmail({ to: aan, ...herinneringsMail(taken) });
    await payload.update({ collection: "taken", where: { id: { in: taken.map((t) => t.id) } }, data: { gemaild: true }, req });
    return { output: { verstuurd: taken.length } };
  },
};
