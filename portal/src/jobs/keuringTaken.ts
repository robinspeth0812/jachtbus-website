import type { TaskConfig } from "payload";
import { zorgVoorTaak } from "../lib/keuring";

/** Daily: every inspection inside its reminder window gets one open task. */
export const keuringTaken: TaskConfig<{ input: object; output: { bekeken: number } }> = {
  slug: "keuringTaken",
  label: "Taken voor keuringen klaarzetten",
  schedule: [{ cron: "0 5 * * *", queue: "onderhoud" }],
  outputSchema: [{ name: "bekeken", type: "number", required: true }],
  retries: 1,
  handler: async ({ req }) => {
    const { docs } = await req.payload.find({ collection: "keuringen", limit: 200, depth: 0, req });
    for (const k of docs) await zorgVoorTaak(req.payload, k, req);
    return { output: { bekeken: docs.length } };
  },
};
