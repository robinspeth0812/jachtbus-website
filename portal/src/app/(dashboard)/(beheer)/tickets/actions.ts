"use server";

import { revalidatePath } from "next/cache";
import { heeftRol } from "@/access";
import { payloadClient, vereisGebruiker } from "@/lib/auth";
import { type FormStatus, leesId, tekst } from "@/lib/formulier";
import { adressenVan, stuurMelding } from "@/lib/mail";
import { labelVan, type TicketStatus, ticketSoorten, ticketStatussen } from "@/lib/opties";
import type { Ticket, User } from "@/payload-types";

const BESTAND_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const BESTAND_MAX = 10 * 1024 * 1024;
const MAX_BESTANDEN = 5;

const isWebbouwer = (user: User) => heeftRol(user, "superadmin");

function leesBestanden(formData: FormData): { bestanden: File[]; fout?: string } {
  const bestanden = formData.getAll("bijlagen").filter((b): b is File => b instanceof File && b.size > 0);
  if (bestanden.length > MAX_BESTANDEN) return { bestanden, fout: `Kies maximaal ${MAX_BESTANDEN} bestanden.` };
  const fout = bestanden.find((b) => !BESTAND_TYPES.includes(b.type))
    ? "Kies schermafbeeldingen (JPG, PNG, WebP, GIF) of een PDF."
    : bestanden.find((b) => b.size > BESTAND_MAX)
      ? "Een bestand is groter dan 10 MB."
      : bestanden.reduce((n, b) => n + b.size, 0) > 2 * BESTAND_MAX
        ? "Samen zijn de bestanden groter dan 20 MB. Stuur ze in twee keer."
        : undefined;
  return { bestanden, fout };
}

async function bewaarBestanden(bestanden: File[], user: User) {
  const payload = await payloadClient();
  const ids: number[] = [];
  for (const b of bestanden) {
    const doc = await payload.create({
      collection: "bijlagen",
      data: {},
      file: { data: Buffer.from(await b.arrayBuffer()), mimetype: b.type, name: b.name, size: b.size },
      user,
      overrideAccess: false,
    });
    ids.push(doc.id);
  }
  return ids;
}

const idsVan = (lijst: Ticket["bijlagen"]) => (lijst ?? []).map((b) => (typeof b === "object" ? b.id : b));

export async function maakTicket(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const titel = tekst(formData, "titel", 140);
  const soortWaarde = tekst(formData, "soort", 20);
  const omschrijving = tekst(formData, "omschrijving", 5000);
  const pagina = tekst(formData, "pagina", 500);
  const nodigOp = tekst(formData, "nodigOp", 10);
  const soort = ticketSoorten.find((s) => s.value === soortWaarde)?.value;

  const velden: Record<string, string> = {};
  if (!titel) velden.titel = "Geef het ticket een korte titel.";
  if (!soort) velden.soort = "Kies waar het over gaat.";
  if (!omschrijving) velden.omschrijving = "Schrijf op wat je wilt of wat er niet klopt.";
  if (nodigOp && !/^\d{4}-\d{2}-\d{2}$/.test(nodigOp)) velden.nodigOp = "Kies een datum.";
  const { bestanden, fout } = leesBestanden(formData);
  if (fout) velden.bijlagen = fout;
  if (Object.keys(velden).length) return { velden };

  const payload = await payloadClient();
  let id: number;
  try {
    const bijlagen = await bewaarBestanden(bestanden, user);
    const ticket = await payload.create({
      collection: "tickets",
      data: { titel, soort: soort!, omschrijving, pagina, nodigOp: nodigOp ? `${nodigOp}T12:00:00.000Z` : null, status: "nieuw", melder: user.id, bijlagen },
      user,
      overrideAccess: false,
    });
    id = ticket.id;
  } catch {
    return { fout: "Versturen lukte niet. Probeer het opnieuw." };
  }

  await stuurMelding(payload, {
    aan: await adressenVan(payload, ["superadmin"]),
    onderwerp: `Nieuw ticket #${id}: ${titel}`,
    alineas: [`${user.naam} heeft een ticket ingediend (${labelVan(ticketSoorten, soort)}).`, omschrijving],
    pad: `/tickets/${id}`,
    knop: "Bekijk het ticket",
  });

  revalidatePath("/", "layout");
  return { naar: `/tickets/${id}?verstuurd=1` };
}

/**
 * Reply, optionally with a new status (web builder only). A reply from the team
 * while the web builder waits, or on a closed ticket, reopens it as "Mee bezig".
 */
export async function reageerOpTicket(_v: FormStatus, formData: FormData): Promise<FormStatus> {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return { fout: "Dit ticket bestaat niet meer." };
  const bericht = tekst(formData, "bericht", 5000);
  const gekozen = tekst(formData, "status", 20);
  const { bestanden, fout } = leesBestanden(formData);

  const payload = await payloadClient();
  const ticket = await payload.findByID({ collection: "tickets", id, depth: 1, user, overrideAccess: false }).catch(() => null);
  if (!ticket) return { fout: "Dit ticket bestaat niet meer." };

  const webbouwer = isWebbouwer(user);
  let status: TicketStatus = ticket.status;
  if (webbouwer && ticketStatussen.some((s) => s.value === gekozen)) status = gekozen as TicketStatus;
  else if (!webbouwer && ["wacht-op-melder", "klaar", "niet-gedaan"].includes(ticket.status)) status = "mee-bezig";
  const statusAnders = status !== ticket.status;

  const velden: Record<string, string> = {};
  if (!bericht && !statusAnders && bestanden.length === 0) velden.bericht = "Schrijf een bericht.";
  if (fout) velden.bijlagen = fout;
  if (Object.keys(velden).length) return { velden };

  try {
    const nieuweBijlagen = await bewaarBestanden(bestanden, user);
    await payload.update({
      collection: "tickets",
      id,
      data: {
        status,
        bijlagen: [...idsVan(ticket.bijlagen), ...nieuweBijlagen],
        berichten: [
          ...(ticket.berichten ?? []).map((b) => ({ ...b, door: typeof b.door === "object" ? b.door?.id : b.door })),
          { door: user.id, tekst: bericht || (nieuweBijlagen.length ? "Bijlage toegevoegd." : `Status: ${labelVan(ticketStatussen, status)}.`), op: new Date().toISOString(), statusNaar: statusAnders ? status : null },
        ],
      },
      user,
      overrideAccess: false,
    });
  } catch {
    return { fout: "Versturen lukte niet. Probeer het opnieuw." };
  }

  const melder = typeof ticket.melder === "object" ? ticket.melder : null;
  const aan = webbouwer ? (melder && melder.id !== user.id ? [melder.email] : []) : await adressenVan(payload, ["superadmin"]);
  await stuurMelding(payload, {
    aan,
    onderwerp: `${statusAnders ? `${labelVan(ticketStatussen, status)}: ` : "Reactie op "}ticket #${id}, ${ticket.titel}`,
    alineas: [`${user.naam} heeft gereageerd${statusAnders ? ` en de status gezet op "${labelVan(ticketStatussen, status)}"` : ""}.`, ...(bericht ? [bericht] : [])],
    pad: `/tickets/${id}`,
    knop: "Bekijk het ticket",
  });

  revalidatePath("/", "layout");
  return { goed: statusAnders ? `Verstuurd. Status: ${labelVan(ticketStatussen, status)}.` : "Verstuurd." };
}

export async function trekTicketIn(formData: FormData) {
  const user = await vereisGebruiker();
  const id = leesId(formData);
  if (!id) return;
  const payload = await payloadClient();
  const ticket = await payload.findByID({ collection: "tickets", id, depth: 0, user, overrideAccess: false }).catch(() => null);
  if (!ticket) return;
  await payload.update({
    collection: "tickets",
    id,
    data: { status: "niet-gedaan", berichten: [...(ticket.berichten ?? []), { door: user.id, tekst: "Ingetrokken: niet meer nodig.", op: new Date().toISOString(), statusNaar: "niet-gedaan" }] },
    user,
    overrideAccess: false,
  });
  revalidatePath("/", "layout");
}
