import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook, Payload } from "payload";

/**
 * Starts a new build of the site after a content change, debounced so a row of
 * edits gives one build. Without SITE_BUILD_HOOK_URL nothing is called, but the
 * portal still records that changes are waiting (shown in Instellingen).
 *
 * The hook is a plain POST, or a GitHub repository_dispatch when the URL points
 * at api.github.com (see docs/hosting.md).
 */
const WACHT_MS = 60_000;
let timer: ReturnType<typeof setTimeout> | null = null;

async function zetStatus(payload: Payload, data: { laatsteWijziging?: string; laatsteBuild?: string; laatsteFout?: string | null }) {
  try {
    await payload.updateGlobal({ slug: "sitestatus", data, overrideAccess: true });
  } catch {
    payload.logger.error("Sitestatus bijwerken mislukt");
  }
}

export async function startSiteBuild(payload: Payload, reden: string): Promise<boolean> {
  const url = process.env.SITE_BUILD_HOOK_URL;
  if (!url) return false;
  const github = url.includes("api.github.com");
  const token = process.env.SITE_BUILD_HOOK_TOKEN;
  try {
    const antwoord = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: github
        ? { Accept: "application/vnd.github+json", "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        : undefined,
      body: github ? JSON.stringify({ event_type: "portal-inhoud", client_payload: { reden } }) : undefined,
    });
    if (!antwoord.ok) throw new Error(String(antwoord.status));
    await zetStatus(payload, { laatsteBuild: new Date().toISOString(), laatsteFout: null });
    return true;
  } catch {
    payload.logger.error(`Site-build starten mislukt (${reden})`);
    await zetStatus(payload, { laatsteFout: new Date().toISOString() });
    return false;
  }
}

function plan(payload: Payload, reden: string) {
  // Outside the running transaction: on SQLite a second writer would wait on it.
  setTimeout(() => void zetStatus(payload, { laatsteWijziging: new Date().toISOString() }), 500);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void startSiteBuild(payload, reden);
  }, WACHT_MS);
}

export const herbouwSite: CollectionAfterChangeHook = ({ collection, req, context }) => {
  if (context.geenSiteBuild) return;
  plan(req.payload, collection.slug);
};

export const herbouwSiteNaVerwijderen: CollectionAfterDeleteHook = ({ collection, req, context }) => {
  if (context.geenSiteBuild) return;
  plan(req.payload, collection.slug);
};

export const herbouwSiteGlobal: GlobalAfterChangeHook = ({ global, req, context }) => {
  if (context.geenSiteBuild) return;
  plan(req.payload, global.slug);
};
