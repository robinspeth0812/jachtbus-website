import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_aanvragen_gelegenheid" ADD VALUE 'tuinfeest' BEFORE 'evenement';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "aanvragen" ALTER COLUMN "gelegenheid" SET DATA TYPE text;
  DROP TYPE "public"."enum_aanvragen_gelegenheid";
  CREATE TYPE "public"."enum_aanvragen_gelegenheid" AS ENUM('bruiloft', 'bedrijfsfeest', 'evenement', 'festival', 'bbq', 'verjaardag', 'jubileum', 'overige');
  ALTER TABLE "aanvragen" ALTER COLUMN "gelegenheid" SET DATA TYPE "public"."enum_aanvragen_gelegenheid" USING "gelegenheid"::"public"."enum_aanvragen_gelegenheid";`)
}
