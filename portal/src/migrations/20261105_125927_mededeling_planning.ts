import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_mededelingen_dagen" AS ENUM('maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag');
  CREATE TABLE "mededelingen_dagen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_mededelingen_dagen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "mededelingen" ADD COLUMN "van_tijd" varchar;
  ALTER TABLE "mededelingen" ADD COLUMN "tot_tijd" varchar;
  ALTER TABLE "mededelingen" ADD COLUMN "volgorde" numeric DEFAULT 100;
  ALTER TABLE "mededelingen_dagen" ADD CONSTRAINT "mededelingen_dagen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mededelingen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "mededelingen_dagen_order_idx" ON "mededelingen_dagen" USING btree ("order");
  CREATE INDEX "mededelingen_dagen_parent_idx" ON "mededelingen_dagen" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "mededelingen_dagen" CASCADE;
  ALTER TABLE "mededelingen" DROP COLUMN "van_tijd";
  ALTER TABLE "mededelingen" DROP COLUMN "tot_tijd";
  ALTER TABLE "mededelingen" DROP COLUMN "volgorde";
  DROP TYPE "public"."enum_mededelingen_dagen";`)
}
