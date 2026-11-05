import type { CollectionBeforeChangeHook } from "payload";

/**
 * Finds the map position of a reference from its town, so a new reference lands
 * on the map of the site without anyone looking up coordinates. Coordinates
 * filled in by hand win. When the lookup fails the reference is saved anyway,
 * and the site falls back to its list of known towns.
 */
export const zoekKaartpunt: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (typeof data.plaats !== "string") return data;
  const handmatig = data.lat != null && data.lng != null && (data.lat !== originalDoc?.lat || data.lng !== originalDoc?.lng);
  const zelfdePlaats = data.plaats === originalDoc?.plaats;
  if (handmatig || (zelfdePlaats && data.lat != null && data.lng != null)) return data;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.search = new URLSearchParams({ format: "jsonv2", limit: "1", countrycodes: "nl", q: data.plaats }).toString();
    const antwoord = await fetch(url, {
      headers: { "User-Agent": "jachtbus-portal/1.0 (https://portal.jachtbusfoodtruck.nl)" },
      signal: AbortSignal.timeout(4000),
    });
    const [treffer] = (await antwoord.json()) as { lat: string; lon: string }[];
    data.lat = treffer ? Number(treffer.lat) : null;
    data.lng = treffer ? Number(treffer.lon) : null;
  } catch (fout) {
    console.warn("Kaartpunt niet gevonden voor", data.plaats, fout);
    data.lat = null;
    data.lng = null;
  }
  return data;
};
