import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_referenties_mogelijkheden" AS ENUM('Walking dinner', 'BBQ-smoker', 'Streetfood', 'Buffet', 'Aan tafel');
  CREATE TABLE "referenties_mogelijkheden" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_referenties_mogelijkheden",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "referenties_mogelijkheden" ADD CONSTRAINT "referenties_mogelijkheden_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."referenties"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "referenties_mogelijkheden_order_idx" ON "referenties_mogelijkheden" USING btree ("order");
  CREATE INDEX "referenties_mogelijkheden_parent_idx" ON "referenties_mogelijkheden" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "referenties_mogelijkheden" CASCADE;
  DROP TYPE "public"."enum_referenties_mogelijkheden";`)
}
