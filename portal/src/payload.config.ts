import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nl } from "@payloadcms/translations/languages/nl";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Aanvragen } from "./collections/Aanvragen";
import { Bijlagen } from "./collections/Bijlagen";
import { Keuringen } from "./collections/Keuringen";
import { Klanten } from "./collections/Klanten";
import { Klussen } from "./collections/Klussen";
import { Media } from "./collections/Media";
import { Metingen } from "./collections/Metingen";
import { Offertes } from "./collections/Offertes";
import { Schoonmaakrondes } from "./collections/Schoonmaakrondes";
import { Taken } from "./collections/Taken";
import { Team } from "./collections/Team";
import { Tickets } from "./collections/Tickets";
import { Users } from "./collections/Users";
import { Arrangementen, Evenementen, Mededelingen, Plaatsen, Referenties, Reviews, Veelgesteld } from "./collections/Website";
import { Instellingen } from "./globals/Instellingen";
import { Sitestatus } from "./globals/Sitestatus";
import { mailHerinneringen } from "./jobs/herinneringen";
import { keuringTaken } from "./jobs/keuringTaken";
import { aanvraagEndpoint } from "./lib/aanvraagEndpoint";
import { siteInhoudEndpoint } from "./lib/siteInhoudEndpoint";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const secret = process.env.PAYLOAD_SECRET;
if (!secret) throw new Error("PAYLOAD_SECRET ontbreekt. Zie .env.example.");

// Production: Postgres, schema via migrations run at startup (prodMigrations).
// Local without DATABASE_URL: SQLite file, schema pushed automatically.
const databaseUrl = process.env.DATABASE_URL;
const db = databaseUrl?.startsWith("postgres")
  ? postgresAdapter({
      pool: { connectionString: databaseUrl },
      migrationDir: path.resolve(dirname, "migrations"),
      prodMigrations: migrations,
    })
  : sqliteAdapter({ client: { url: databaseUrl || "file:./jachtbus-dev.db" } });

// Mail via SMTP (set in Coolify). Without SMTP_HOST Payload only logs mail, so
// nothing leaves by accident locally. Resend: see docs/hosting.md.
const poort = Number(process.env.SMTP_PORT) || 465;
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.MAIL_VAN || "portal@jachtbusfoodtruck.nl",
      defaultFromName: "Jachtbus",
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: poort,
        secure: poort === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined;

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default buildConfig({
  secret,
  db,
  editor: lexicalEditor(),
  email,
  sharp,
  serverURL: serverUrl,
  // The site posts its form here and reads /api/site-inhoud at build time.
  cors: ["https://jachtbusfoodtruck.nl", "http://localhost:4321", "http://localhost:4399"],
  // Cookies are only for the portal itself; the site never logs in.
  csrf: serverUrl ? [serverUrl] : [],
  i18n: { supportedLanguages: { nl }, fallbackLanguage: "nl" },
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " | Jachtbus superadmin" },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    Aanvragen,
    Klanten,
    Klussen,
    Offertes,
    Taken,
    Keuringen,
    Metingen,
    Schoonmaakrondes,
    Team,
    Arrangementen,
    Referenties,
    Reviews,
    Veelgesteld,
    Plaatsen,
    Mededelingen,
    Evenementen,
    Media,
    Bijlagen,
    Tickets,
    Users,
  ],
  globals: [Instellingen, Sitestatus],
  // Works because the app runs as a fixed server (Coolify), not serverless.
  jobs: {
    tasks: [mailHerinneringen, keuringTaken],
    autoRun: [
      { cron: "*/5 * * * *", queue: "herinneringen" },
      { cron: "*/5 * * * *", queue: "onderhoud" },
    ],
    deleteJobOnComplete: true,
  },
  endpoints: [aanvraagEndpoint, siteInhoudEndpoint],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  graphQL: { disable: true },
});
