// Which province a job lies in, from the same outlines the map draws. A job has
// its own position from the portal, or else the position of its town.
import provincies from '../data/provincies-noord.json';
import { plaatsKaart } from '../data/nieuw';
import type { Referentie } from './cms';

// The outlines carry the official name.
const officieel: Record<string, string> = { Friesland: 'Fryslân' };

export const provincieVan = (naam: string) => {
  const feature = provincies.features.find((item) => item.properties.naam === (officieel[naam] ?? naam));
  if (!feature) throw new Error(`Unknown province: ${naam}`);
  return feature;
};

const inRing = (lng: number, lat: number, ring: number[][]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const crosses = ring[i][1] > lat !== ring[j][1] > lat;
    if (crosses && lng < ((ring[j][0] - ring[i][0]) * (lat - ring[i][1])) / (ring[j][1] - ring[i][1]) + ring[i][0]) inside = !inside;
  }
  return inside;
};

/** The jobs in one province. A job without any known position is left out. */
export const casesIn = (naam: string, referenties: Referentie[]) => {
  const { geometry } = provincieVan(naam);
  const vlakken = (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates) as unknown as number[][][][];
  return referenties.filter((item) => {
    const lat = item.lat ?? plaatsKaart[item.plaats]?.[0];
    const lng = item.lng ?? plaatsKaart[item.plaats]?.[1];
    if (lat === undefined || lng === undefined) return false;
    return vlakken.some((vlak) => inRing(lng, lat, vlak[0]));
  });
};
