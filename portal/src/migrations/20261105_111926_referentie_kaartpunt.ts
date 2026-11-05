import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "referenties" ADD COLUMN "lat" numeric;
  ALTER TABLE "referenties" ADD COLUMN "lng" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "referenties" DROP COLUMN "lat";
  ALTER TABLE "referenties" DROP COLUMN "lng";`)
}
