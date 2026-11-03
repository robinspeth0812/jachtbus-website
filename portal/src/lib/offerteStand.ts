import { isoNaarDag, nederlandseDatum } from "./datum";
import type { OfferteStatus } from "./opties";

/** A sent quote past its date reads as expired, without anyone setting it. */
export function offerteStand(status: OfferteStatus, geldigTot: string | null | undefined): OfferteStatus {
  if (status === "verstuurd" && geldigTot && isoNaarDag(geldigTot) < nederlandseDatum()) return "verlopen";
  return status;
}
