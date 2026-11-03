/** Pure status of an inspection. No Payload imports: also used on the client. */
import { dagenTussen, isoNaarDag, nederlandseDatum } from "./datum";

export type KeuringStand = "te-laat" | "binnenkort" | "in-orde";

export function keuringStand(vervalt: string, herinnerDagen = 30, vandaag = nederlandseDatum()): { stand: KeuringStand; dagen: number } {
  const dagen = dagenTussen(vandaag, isoNaarDag(vervalt));
  return { stand: dagen < 0 ? "te-laat" : dagen <= herinnerDagen ? "binnenkort" : "in-orde", dagen };
}
