// The visitor's choices, kept on their own device as proof and so we only ask
// once. Storing the choice itself needs no consent. New purpose? Add a key to
// Consent and raise VERSION: everybody gets asked again, and nothing runs before
// that answer. Scripts that need consent wait for readConsent().
const KEY = 'jachtbus-toestemming';
const VERSION = 2;
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;

export const CONSENT_EVENT = 'jachtbus:toestemming';

export type ConsentKey = 'statistics' | 'marketing' | 'media';
export type Consent = Record<ConsentKey, boolean>;

// When the browser blocks storage, the choice lasts until the page closes.
let memory: Consent | null = null;

export const readConsent = (): Consent | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return memory;
    const saved = JSON.parse(raw);
    if (saved.version !== VERSION || Date.now() - saved.date > MAX_AGE) return null;
    return saved.choices;
  } catch {
    return memory;
  }
};

export const saveConsent = (choices: Consent) => {
  memory = choices;
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, date: Date.now(), choices }));
  } catch {
    // Storage blocked: the choice stays in memory.
  }
  document.dispatchEvent(new CustomEvent(CONSENT_EVENT));
};

/** Say yes to one purpose, and leave the rest as it was (or off, if never asked). */
export const allowOnly = (key: ConsentKey) => {
  saveConsent({ statistics: false, marketing: false, media: false, ...readConsent(), [key]: true });
};
