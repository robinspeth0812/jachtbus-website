// What Jachtbus pays for. Modules that are off stay visible in the menu, greyed out
// with a lock, so the team sees what else is possible. Flip a value to turn one on.
// This is about the package, not security: access control still guards the data.
export const MODULES = {
  offertes: false,
  agenda: false,
  klussen: false,
  taken: false,
  klanten: false,
  keuringen: false,
  voedselveiligheid: false,
} as const satisfies Record<string, boolean>;

export type Module = keyof typeof MODULES;

export const moduleAan = (m: Module): boolean => MODULES[m];
