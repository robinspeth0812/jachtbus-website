/**
 * Field definitions drive both the form UI (AutoVelden) and the server-side
 * reading and validation (leesVelden), so the two can never disagree.
 * No Payload imports: also used in client components.
 */
import { dagNaarIso, isoNaarDag } from "./datum";
import { emailPatroon, type Optie, tijdPatroon } from "./opties";

export type VeldSoort =
  | "tekst"
  | "lang"
  | "getal"
  | "datum"
  | "tijd"
  | "keuze"
  | "meerkeuze"
  | "vink"
  | "url"
  | "email"
  | "telefoon"
  | "relatie"
  | "relaties"
  | "foto"
  | "fotos";

export type Breedte = "tijd" | "datum" | "kort" | "middel" | "lang";

export type VeldDef = {
  naam: string;
  label: string;
  soort: VeldSoort;
  verplicht?: boolean;
  hulp?: string;
  /** Max characters (text) or largest number (getal). */
  max?: number;
  min?: number;
  stap?: number;
  opties?: readonly Optie[];
  /** Key in the `keuzes` prop for relation and photo fields. */
  bron?: string;
  /** Label of the empty choice in a relation or select. */
  leeg?: string;
  breedte?: Breedte;
  rijen?: number;
  voorbeeld?: string;
  /** Visible heading starting a new group of fields. */
  groep?: string;
};

export type HerhaalKolom = Omit<VeldDef, "bron" | "groep" | "rijen">;
export type HerhaalDef = {
  naam: string;
  label: string;
  hulp?: string;
  knop: string;
  kolommen: HerhaalKolom[];
};

export type Keuze = Optie & { url?: string | null };
export type Keuzes = Record<string, Keuze[]>;

const teks = (fd: FormData, naam: string, max: number) => String(fd.get(naam) ?? "").trim().slice(0, max);

/** One field from a form to the value Payload wants, plus an error text or null. */
function leesEen(fd: FormData, v: VeldDef | HerhaalKolom, sleutel: string): { waarde: unknown; fout: string | null } {
  const leeg = `Vul "${v.label}" in.`;
  switch (v.soort) {
    case "vink":
      return { waarde: fd.get(sleutel) === "1", fout: null };
    case "getal": {
      const ruw = teks(fd, sleutel, 20).replace(",", ".");
      if (!ruw) return { waarde: null, fout: v.verplicht ? leeg : null };
      const n = Number(ruw);
      if (!Number.isFinite(n)) return { waarde: null, fout: `"${v.label}" moet een getal zijn.` };
      if (v.min !== undefined && n < v.min) return { waarde: n, fout: `"${v.label}" is minimaal ${v.min}.` };
      if (v.max !== undefined && n > v.max) return { waarde: n, fout: `"${v.label}" is maximaal ${v.max}.` };
      return { waarde: n, fout: null };
    }
    case "datum": {
      const ruw = teks(fd, sleutel, 10);
      if (!ruw) return { waarde: null, fout: v.verplicht ? `Kies een datum bij "${v.label}".` : null };
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ruw)) return { waarde: null, fout: `Kies een datum bij "${v.label}".` };
      return { waarde: dagNaarIso(ruw), fout: null };
    }
    case "tijd": {
      const ruw = teks(fd, sleutel, 5);
      if (!ruw) return { waarde: "", fout: v.verplicht ? leeg : null };
      if (!tijdPatroon.test(ruw)) return { waarde: ruw, fout: "Vul de tijd in als 16:30." };
      return { waarde: ruw, fout: null };
    }
    case "keuze": {
      const ruw = teks(fd, sleutel, 60);
      if (!ruw) return { waarde: null, fout: v.verplicht ? `Maak een keuze bij "${v.label}".` : null };
      if (v.opties && !v.opties.some((o) => o.value === ruw)) return { waarde: null, fout: `Maak een keuze bij "${v.label}".` };
      return { waarde: ruw, fout: null };
    }
    case "meerkeuze": {
      const lijst = fd.getAll(sleutel).map(String).filter((w) => v.opties?.some((o) => o.value === w));
      return { waarde: lijst, fout: v.verplicht && !lijst.length ? `Kies iets bij "${v.label}".` : null };
    }
    case "relatie":
    case "foto": {
      const n = Number(fd.get(sleutel));
      if (!Number.isInteger(n) || n < 1) return { waarde: null, fout: v.verplicht ? `Maak een keuze bij "${v.label}".` : null };
      return { waarde: n, fout: null };
    }
    case "relaties":
    case "fotos":
      return { waarde: fd.getAll(sleutel).map(Number).filter((n) => Number.isInteger(n) && n > 0), fout: null };
    case "email": {
      const ruw = teks(fd, sleutel, 200);
      if (!ruw) return { waarde: null, fout: v.verplicht ? leeg : null };
      return { waarde: ruw, fout: emailPatroon.test(ruw) ? null : "Vul een e-mailadres in, zoals naam@voorbeeld.nl." };
    }
    case "telefoon": {
      const ruw = teks(fd, sleutel, 20);
      if (!ruw) return { waarde: "", fout: v.verplicht ? leeg : null };
      return { waarde: ruw, fout: /^[+\d][\d\s\-()]{7,}$/.test(ruw) ? null : "Vul een telefoonnummer in, zoals 06 12345678." };
    }
    case "url": {
      const ruw = teks(fd, sleutel, 500);
      if (!ruw) return { waarde: "", fout: v.verplicht ? leeg : null };
      return { waarde: ruw, fout: /^(https:\/\/\S+|\/\S*)$/.test(ruw) ? null : "Een link begint met https:// (of met / voor een pagina op de site)." };
    }
    default: {
      const ruw = teks(fd, sleutel, v.max ?? (v.soort === "lang" ? 8000 : 300));
      return { waarde: ruw, fout: v.verplicht && !ruw ? leeg : null };
    }
  }
}

export function leesVelden(formData: FormData, defs: readonly VeldDef[]) {
  const data: Record<string, unknown> = {};
  const velden: Record<string, string> = {};
  for (const v of defs) {
    const { waarde, fout } = leesEen(formData, v, v.naam);
    data[v.naam] = waarde;
    if (fout) velden[v.naam] = fout;
  }
  return { data, velden };
}

/** Repeating rows, named `regels.0.omschrijving`. Rows whose first text column is empty are dropped. */
export function leesRegels(formData: FormData, def: HerhaalDef) {
  const indexen = new Set<number>();
  for (const k of formData.keys()) {
    const m = k.match(new RegExp(`^${def.naam}\\.(\\d+)\\.`));
    if (m) indexen.add(Number(m[1]));
  }
  const rijen: Record<string, unknown>[] = [];
  const velden: Record<string, string> = {};
  const eerste = def.kolommen.find((k) => k.soort === "tekst");
  for (const i of [...indexen].sort((a, b) => a - b)) {
    if (eerste && !String(formData.get(`${def.naam}.${i}.${eerste.naam}`) ?? "").trim()) continue;
    const rij: Record<string, unknown> = {};
    for (const k of def.kolommen) {
      const { waarde, fout } = leesEen(formData, k, `${def.naam}.${i}.${k.naam}`);
      rij[k.naam] = waarde;
      if (fout) velden[`${def.naam}.${i}.${k.naam}`] = fout;
    }
    rijen.push(rij);
  }
  return { rijen, velden };
}

/** A value from a document as the string or list a form control wants. */
export function beginwaarde(doc: Record<string, unknown> | null | undefined, v: VeldDef | HerhaalKolom): string | string[] | boolean {
  const w = doc?.[v.naam];
  const id = (x: unknown) => String(typeof x === "object" && x ? (x as { id: unknown }).id : (x ?? ""));
  switch (v.soort) {
    case "vink":
      return Boolean(w);
    case "datum":
      return isoNaarDag(w as string | null);
    case "relatie":
    case "foto":
      return w ? id(w) : "";
    case "relaties":
    case "fotos":
      return Array.isArray(w) ? w.map(id) : [];
    case "meerkeuze":
      return Array.isArray(w) ? w.map(String) : [];
    default:
      return w === null || w === undefined ? "" : String(w);
  }
}
