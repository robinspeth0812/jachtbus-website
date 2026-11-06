import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_evenementen_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TABLE "evenementen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"tot_datum" timestamp(3) with time zone,
  	"van_tijd" varchar,
  	"tot_tijd" varchar,
  	"plaats" varchar NOT NULL,
  	"locatie" varchar,
  	"tekst" varchar,
  	"link_tekst" varchar,
  	"link_url" varchar,
  	"foto_id" integer,
  	"status" "enum_evenementen_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "evenementen_id" integer;
  ALTER TABLE "evenementen" ADD CONSTRAINT "evenementen_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "evenementen_datum_idx" ON "evenementen" USING btree ("datum");
  CREATE INDEX "evenementen_tot_datum_idx" ON "evenementen" USING btree ("tot_datum");
  CREATE INDEX "evenementen_foto_idx" ON "evenementen" USING btree ("foto_id");
  CREATE INDEX "evenementen_status_idx" ON "evenementen" USING btree ("status");
  CREATE INDEX "evenementen_updated_at_idx" ON "evenementen" USING btree ("updated_at");
  CREATE INDEX "evenementen_created_at_idx" ON "evenementen" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_evenementen_fk" FOREIGN KEY ("evenementen_id") REFERENCES "public"."evenementen"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_evenementen_id_idx" ON "payload_locked_documents_rels" USING btree ("evenementen_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "evenementen" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "evenementen" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_evenementen_fk";
  
  DROP INDEX "payload_locked_documents_rels_evenementen_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "evenementen_id";
  DROP TYPE "public"."enum_evenementen_status";`)
}
