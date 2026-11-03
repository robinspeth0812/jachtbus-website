/**
 * Spam protection for the public request form, without captcha or cookies:
 * honeypot, fill-in time, and a per-IP rate limit. The rate limit lives in the
 * memory of one process; a restart resets it, which is fine at this scale.
 */
const MIN_INVULTIJD_MS = 3_000;
const MAX_LEEFTIJD_MS = 48 * 60 * 60 * 1000;
const MAX_PER_UUR = 5;
const UUR_MS = 60 * 60 * 1000;

const pogingen = new Map<string, number[]>();

/** The address our own proxy (Traefik in Coolify) saw: the last in X-Forwarded-For. */
export function ipVan(headers: Headers): string {
  const doorgestuurd = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return doorgestuurd || headers.get("x-real-ip") || "onbekend";
}

export function overLimiet(ip: string, nu = Date.now()): boolean {
  const recent = (pogingen.get(ip) ?? []).filter((t) => nu - t < UUR_MS);
  recent.push(nu);
  pogingen.set(ip, recent);
  if (pogingen.size > 10_000) {
    for (const [sleutel, tijden] of pogingen) if (tijden.every((t) => nu - t >= UUR_MS)) pogingen.delete(sleutel);
  }
  return recent.length > MAX_PER_UUR;
}

/** True when the submission looks like a bot: answer 200 and store nothing. */
export function isSpam(data: { website?: string; ts?: string }, nu = Date.now()): boolean {
  if (data.website?.trim()) return true;
  if (data.ts) {
    const geladen = Number(data.ts);
    if (!Number.isFinite(geladen)) return true;
    const leeftijd = nu - geladen;
    if (leeftijd < MIN_INVULTIJD_MS || leeftijd > MAX_LEEFTIJD_MS) return true;
  }
  return false;
}
