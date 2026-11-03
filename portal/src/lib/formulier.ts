/** Shared between server actions and forms. */
export type FormStatus = {
  goed?: string;
  fout?: string;
  /** Error per field name, for aria-invalid and the text at the field. */
  velden?: Record<string, string>;
  /** After creating: where the form goes next. */
  naar?: string;
};

export const leesId = (formData: FormData): number | null => {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const tekst = (formData: FormData, naam: string, max: number) =>
  String(formData.get(naam) ?? "").trim().slice(0, max);

/** "walking-dinner" from "Walking dinner!". Lower case, digits and hyphens. */
export const maakSlug = (waarde: string) =>
  waarde
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
