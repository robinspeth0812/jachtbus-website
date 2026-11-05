import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" ADD COLUMN "foto_id" integer;
  ALTER TABLE "reviews" ADD COLUMN "referentie_id" integer;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_referentie_id_referenties_id_fk" FOREIGN KEY ("referentie_id") REFERENCES "public"."referenties"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "reviews_foto_idx" ON "reviews" USING btree ("foto_id");
  CREATE INDEX "reviews_referentie_idx" ON "reviews" USING btree ("referentie_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" DROP CONSTRAINT "reviews_foto_id_media_id_fk";
  
  ALTER TABLE "reviews" DROP CONSTRAINT "reviews_referentie_id_referenties_id_fk";
  
  DROP INDEX "reviews_foto_idx";
  DROP INDEX "reviews_referentie_idx";
  ALTER TABLE "reviews" DROP COLUMN "foto_id";
  ALTER TABLE "reviews" DROP COLUMN "referentie_id";`)
}
