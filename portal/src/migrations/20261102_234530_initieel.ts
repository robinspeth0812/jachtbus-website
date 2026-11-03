import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_aanvragen_momenten" AS ENUM('borrel', 'diner', 'avondsnack');
  CREATE TYPE "public"."enum_aanvragen_gelegenheid" AS ENUM('bruiloft', 'bedrijfsfeest', 'evenement', 'festival', 'bbq', 'verjaardag', 'jubileum', 'overige');
  CREATE TYPE "public"."enum_aanvragen_fase" AS ENUM('nieuw', 'contact', 'offerte', 'bevestigd', 'afgewezen');
  CREATE TYPE "public"."enum_aanvragen_bron" AS ENUM('site', 'handmatig');
  CREATE TYPE "public"."enum_klussen_status" AS ENUM('optie', 'bevestigd', 'afgerond', 'geannuleerd');
  CREATE TYPE "public"."enum_offertes_regels_btw" AS ENUM('9', '21');
  CREATE TYPE "public"."enum_offertes_status" AS ENUM('concept', 'verstuurd', 'geaccepteerd', 'afgewezen', 'verlopen');
  CREATE TYPE "public"."enum_taken_soort" AS ENUM('reageren', 'offerte-sturen', 'nabellen', 'afstemmen', 'review', 'factuur', 'keuring', 'eigen');
  CREATE TYPE "public"."enum_keuringen_soort" AS ENUM('apk', 'gas', 'brand', 'elektra', 'haccp', 'verzekering', 'tachograaf', 'onderhoud', 'overig');
  CREATE TYPE "public"."enum_metingen_soort" AS ENUM('koeling', 'vriezer', 'kern', 'warmhouden');
  CREATE TYPE "public"."enum_team_werkdagen" AS ENUM('maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag');
  CREATE TYPE "public"."enum_team_rol" AS ENUM('eigenaar', 'kok', 'bediening', 'chauffeur', 'hulp');
  CREATE TYPE "public"."enum_arrangementen_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_referenties_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_reviews_bron" AS ENUM('Google', 'Facebook', 'E-mail van de klant', 'WhatsApp van de klant');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_veelgesteld_pagina" AS ENUM('algemeen', 'home', 'catering', 'bruiloft', 'bedrijfsfeest', 'evenement', 'bbq-smoker', 'contact');
  CREATE TYPE "public"."enum_veelgesteld_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_plaatsen_provincie" AS ENUM('Drenthe', 'Groningen', 'Friesland');
  CREATE TYPE "public"."enum_plaatsen_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_mededelingen_status" AS ENUM('concept', 'gepubliceerd');
  CREATE TYPE "public"."enum_media_licentie" AS ENUM('eigen', 'opdracht', 'stock', 'gratis', 'cc-by', 'toestemming');
  CREATE TYPE "public"."enum_media_personen" AS ENUM('geen', 'toestemming', 'geen-toestemming');
  CREATE TYPE "public"."enum_tickets_berichten_status_naar" AS ENUM('nieuw', 'mee-bezig', 'wacht-op-melder', 'klaar', 'niet-gedaan');
  CREATE TYPE "public"."enum_tickets_soort" AS ENUM('website', 'marketing', 'socials', 'google', 'portal', 'anders');
  CREATE TYPE "public"."enum_tickets_status" AS ENUM('nieuw', 'mee-bezig', 'wacht-op-melder', 'klaar', 'niet-gedaan');
  CREATE TYPE "public"."enum_users_rol" AS ENUM('eigenaar', 'medewerker', 'superadmin');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'mailHerinneringen', 'keuringTaken');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'mailHerinneringen', 'keuringTaken');
  CREATE TABLE "aanvragen_momenten" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_aanvragen_momenten",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "aanvragen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gelegenheid" "enum_aanvragen_gelegenheid" NOT NULL,
  	"gelegenheid_overig" varchar,
  	"datum" timestamp(3) with time zone,
  	"tijd" varchar,
  	"plaats" varchar,
  	"gasten" numeric,
  	"locatie" varchar,
  	"naam" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telefoon" varchar,
  	"opmerking" varchar,
  	"fase" "enum_aanvragen_fase" DEFAULT 'nieuw' NOT NULL,
  	"notities" varchar,
  	"bron" "enum_aanvragen_bron" DEFAULT 'site',
  	"klant_id" integer,
  	"klus_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "klanten" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"bedrijf" varchar,
  	"email" varchar,
  	"telefoon" varchar,
  	"adres" varchar,
  	"plaats" varchar,
  	"notities" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "klussen_draaiboek" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tijd" varchar,
  	"wat" varchar NOT NULL,
  	"wie" varchar
  );
  
  CREATE TABLE "klussen_boodschappen" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"hoeveelheid" numeric,
  	"eenheid" varchar,
  	"gedaan" boolean DEFAULT false,
  	"uit_arrangement" boolean DEFAULT false
  );
  
  CREATE TABLE "klussen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"status" "enum_klussen_status" DEFAULT 'optie' NOT NULL,
  	"datum" timestamp(3) with time zone NOT NULL,
  	"aankomst" varchar,
  	"opbouw" varchar,
  	"serveren" varchar,
  	"klaar" varchar,
  	"klant_id" integer,
  	"aanvraag_id" integer,
  	"plaats" varchar,
  	"adres" varchar,
  	"kilometers" numeric,
  	"gasten" numeric,
  	"arrangement_id" integer,
  	"dieetwensen" varchar,
  	"notities" varchar,
  	"chk_ruimte" boolean DEFAULT false,
  	"chk_ondergrond" boolean DEFAULT false,
  	"chk_toegang" boolean DEFAULT false,
  	"chk_stroom" boolean DEFAULT false,
  	"chk_weerplan" boolean DEFAULT false,
  	"weerplan" varchar,
  	"locatie_notitie" varchar,
  	"hoe_ging_het" varchar,
  	"review_gevraagd" boolean DEFAULT false,
  	"factuur_verstuurd" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "klussen_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"team_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "offertes_regels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"omschrijving" varchar NOT NULL,
  	"aantal" numeric DEFAULT 1 NOT NULL,
  	"prijs" numeric DEFAULT 0 NOT NULL,
  	"btw" "enum_offertes_regels_btw" DEFAULT '9' NOT NULL
  );
  
  CREATE TABLE "offertes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nummer" varchar NOT NULL,
  	"titel" varchar NOT NULL,
  	"status" "enum_offertes_status" DEFAULT 'concept' NOT NULL,
  	"klant_id" integer NOT NULL,
  	"aanvraag_id" integer,
  	"klus_id" integer,
  	"geldig_tot" timestamp(3) with time zone NOT NULL,
  	"verstuurd_op" timestamp(3) with time zone,
  	"intro" varchar,
  	"slot" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "taken" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"omschrijving" varchar,
  	"voor_id" integer,
  	"door_id" integer,
  	"vervalt" timestamp(3) with time zone NOT NULL,
  	"aanvraag_id" integer,
  	"klus_id" integer,
  	"keuring_id" integer,
  	"soort" "enum_taken_soort" DEFAULT 'eigen' NOT NULL,
  	"klaar" boolean DEFAULT false,
  	"klaar_op" timestamp(3) with time zone,
  	"gemaild" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "keuringen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"soort" "enum_keuringen_soort" NOT NULL,
  	"vervalt" timestamp(3) with time zone NOT NULL,
  	"laatste_keer" timestamp(3) with time zone,
  	"interval_maanden" numeric,
  	"herinner_dagen" numeric DEFAULT 30,
  	"uitvoerder" varchar,
  	"notitie" varchar,
  	"document_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "metingen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"soort" "enum_metingen_soort" NOT NULL,
  	"temperatuur" numeric NOT NULL,
  	"binnen_norm" boolean DEFAULT true,
  	"actie" varchar,
  	"op" timestamp(3) with time zone NOT NULL,
  	"klus_id" integer,
  	"door_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "schoonmaakrondes_punten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"punt" varchar NOT NULL,
  	"gedaan" boolean DEFAULT false
  );
  
  CREATE TABLE "schoonmaakrondes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"op" timestamp(3) with time zone NOT NULL,
  	"klus_id" integer,
  	"door_id" integer,
  	"opmerking" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_werkdagen" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_team_werkdagen",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "team_niet_beschikbaar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dag" timestamp(3) with time zone NOT NULL,
  	"reden" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"rol" "enum_team_rol" DEFAULT 'hulp' NOT NULL,
  	"telefoon" varchar,
  	"email" varchar,
  	"notitie" varchar,
  	"actief" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "arrangementen_ingredienten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"per_gast" numeric,
  	"eenheid" varchar
  );
  
  CREATE TABLE "arrangementen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"titel" varchar NOT NULL,
  	"kort" varchar NOT NULL,
  	"tekst" varchar NOT NULL,
  	"volgorde" numeric DEFAULT 0,
  	"interne_richtprijs" numeric,
  	"status" "enum_arrangementen_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "referenties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"titel" varchar NOT NULL,
  	"plaats" varchar NOT NULL,
  	"gelegenheid" varchar NOT NULL,
  	"gasten" numeric,
  	"datum" timestamp(3) with time zone,
  	"verhaal" varchar NOT NULL,
  	"foto_id" integer,
  	"toestemming" boolean DEFAULT false,
  	"status" "enum_referenties_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "referenties_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"gelegenheid" varchar,
  	"plaats" varchar,
  	"tekst" varchar NOT NULL,
  	"bron" "enum_reviews_bron" NOT NULL,
  	"bron_url" varchar,
  	"bewijs" varchar,
  	"status" "enum_reviews_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "veelgesteld" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vraag" varchar NOT NULL,
  	"antwoord" varchar NOT NULL,
  	"pagina" "enum_veelgesteld_pagina" DEFAULT 'algemeen' NOT NULL,
  	"volgorde" numeric DEFAULT 0,
  	"status" "enum_veelgesteld_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plaatsen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"provincie" "enum_plaatsen_provincie" NOT NULL,
  	"status" "enum_plaatsen_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mededelingen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tekst" varchar NOT NULL,
  	"link_tekst" varchar,
  	"link_url" varchar,
  	"vanaf" timestamp(3) with time zone,
  	"tot" timestamp(3) with time zone,
  	"status" "enum_mededelingen_status" DEFAULT 'concept' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"maker" varchar,
  	"licentie" "enum_media_licentie",
  	"bron_url" varchar,
  	"personen" "enum_media_personen",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_klein_url" varchar,
  	"sizes_klein_width" numeric,
  	"sizes_klein_height" numeric,
  	"sizes_klein_mime_type" varchar,
  	"sizes_klein_filesize" numeric,
  	"sizes_klein_filename" varchar,
  	"sizes_groot_url" varchar,
  	"sizes_groot_width" numeric,
  	"sizes_groot_height" numeric,
  	"sizes_groot_mime_type" varchar,
  	"sizes_groot_filesize" numeric,
  	"sizes_groot_filename" varchar
  );
  
  CREATE TABLE "bijlagen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tickets_berichten" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"door_id" integer,
  	"tekst" varchar NOT NULL,
  	"op" timestamp(3) with time zone NOT NULL,
  	"status_naar" "enum_tickets_berichten_status_naar"
  );
  
  CREATE TABLE "tickets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titel" varchar NOT NULL,
  	"soort" "enum_tickets_soort" DEFAULT 'website' NOT NULL,
  	"omschrijving" varchar NOT NULL,
  	"pagina" varchar,
  	"nodig_op" timestamp(3) with time zone,
  	"status" "enum_tickets_status" DEFAULT 'nieuw' NOT NULL,
  	"melder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tickets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"bijlagen_id" integer
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"naam" varchar NOT NULL,
  	"rol" "enum_users_rol" DEFAULT 'medewerker' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"aanvragen_id" integer,
  	"klanten_id" integer,
  	"klussen_id" integer,
  	"offertes_id" integer,
  	"taken_id" integer,
  	"keuringen_id" integer,
  	"metingen_id" integer,
  	"schoonmaakrondes_id" integer,
  	"team_id" integer,
  	"arrangementen_id" integer,
  	"referenties_id" integer,
  	"reviews_id" integer,
  	"veelgesteld_id" integer,
  	"plaatsen_id" integer,
  	"mededelingen_id" integer,
  	"media_id" integer,
  	"bijlagen_id" integer,
  	"tickets_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "instellingen" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_telefoon" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email" varchar,
  	"profielen_instagram" varchar,
  	"profielen_facebook" varchar,
  	"profielen_google" varchar,
  	"mail_aanvraag_extra" varchar,
  	"mail_herinnering_extra" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "instellingen_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "sitestatus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"laatste_wijziging" timestamp(3) with time zone,
  	"laatste_build" timestamp(3) with time zone,
  	"laatste_fout" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "aanvragen_momenten" ADD CONSTRAINT "aanvragen_momenten_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."aanvragen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "aanvragen" ADD CONSTRAINT "aanvragen_klant_id_klanten_id_fk" FOREIGN KEY ("klant_id") REFERENCES "public"."klanten"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "aanvragen" ADD CONSTRAINT "aanvragen_klus_id_klussen_id_fk" FOREIGN KEY ("klus_id") REFERENCES "public"."klussen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "klussen_draaiboek" ADD CONSTRAINT "klussen_draaiboek_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."klussen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "klussen_boodschappen" ADD CONSTRAINT "klussen_boodschappen_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."klussen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "klussen" ADD CONSTRAINT "klussen_klant_id_klanten_id_fk" FOREIGN KEY ("klant_id") REFERENCES "public"."klanten"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "klussen" ADD CONSTRAINT "klussen_aanvraag_id_aanvragen_id_fk" FOREIGN KEY ("aanvraag_id") REFERENCES "public"."aanvragen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "klussen" ADD CONSTRAINT "klussen_arrangement_id_arrangementen_id_fk" FOREIGN KEY ("arrangement_id") REFERENCES "public"."arrangementen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "klussen_rels" ADD CONSTRAINT "klussen_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."klussen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "klussen_rels" ADD CONSTRAINT "klussen_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "klussen_rels" ADD CONSTRAINT "klussen_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offertes_regels" ADD CONSTRAINT "offertes_regels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offertes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offertes" ADD CONSTRAINT "offertes_klant_id_klanten_id_fk" FOREIGN KEY ("klant_id") REFERENCES "public"."klanten"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offertes" ADD CONSTRAINT "offertes_aanvraag_id_aanvragen_id_fk" FOREIGN KEY ("aanvraag_id") REFERENCES "public"."aanvragen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offertes" ADD CONSTRAINT "offertes_klus_id_klussen_id_fk" FOREIGN KEY ("klus_id") REFERENCES "public"."klussen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taken" ADD CONSTRAINT "taken_voor_id_users_id_fk" FOREIGN KEY ("voor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taken" ADD CONSTRAINT "taken_door_id_users_id_fk" FOREIGN KEY ("door_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taken" ADD CONSTRAINT "taken_aanvraag_id_aanvragen_id_fk" FOREIGN KEY ("aanvraag_id") REFERENCES "public"."aanvragen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taken" ADD CONSTRAINT "taken_klus_id_klussen_id_fk" FOREIGN KEY ("klus_id") REFERENCES "public"."klussen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "taken" ADD CONSTRAINT "taken_keuring_id_keuringen_id_fk" FOREIGN KEY ("keuring_id") REFERENCES "public"."keuringen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "keuringen" ADD CONSTRAINT "keuringen_document_id_bijlagen_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."bijlagen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "metingen" ADD CONSTRAINT "metingen_klus_id_klussen_id_fk" FOREIGN KEY ("klus_id") REFERENCES "public"."klussen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "metingen" ADD CONSTRAINT "metingen_door_id_users_id_fk" FOREIGN KEY ("door_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schoonmaakrondes_punten" ADD CONSTRAINT "schoonmaakrondes_punten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schoonmaakrondes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "schoonmaakrondes" ADD CONSTRAINT "schoonmaakrondes_klus_id_klussen_id_fk" FOREIGN KEY ("klus_id") REFERENCES "public"."klussen"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schoonmaakrondes" ADD CONSTRAINT "schoonmaakrondes_door_id_users_id_fk" FOREIGN KEY ("door_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_werkdagen" ADD CONSTRAINT "team_werkdagen_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_niet_beschikbaar" ADD CONSTRAINT "team_niet_beschikbaar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "arrangementen_ingredienten" ADD CONSTRAINT "arrangementen_ingredienten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."arrangementen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referenties" ADD CONSTRAINT "referenties_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "referenties_rels" ADD CONSTRAINT "referenties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."referenties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "referenties_rels" ADD CONSTRAINT "referenties_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tickets_berichten" ADD CONSTRAINT "tickets_berichten_door_id_users_id_fk" FOREIGN KEY ("door_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tickets_berichten" ADD CONSTRAINT "tickets_berichten_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tickets" ADD CONSTRAINT "tickets_melder_id_users_id_fk" FOREIGN KEY ("melder_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tickets_rels" ADD CONSTRAINT "tickets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tickets_rels" ADD CONSTRAINT "tickets_rels_bijlagen_fk" FOREIGN KEY ("bijlagen_id") REFERENCES "public"."bijlagen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_aanvragen_fk" FOREIGN KEY ("aanvragen_id") REFERENCES "public"."aanvragen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_klanten_fk" FOREIGN KEY ("klanten_id") REFERENCES "public"."klanten"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_klussen_fk" FOREIGN KEY ("klussen_id") REFERENCES "public"."klussen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offertes_fk" FOREIGN KEY ("offertes_id") REFERENCES "public"."offertes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_taken_fk" FOREIGN KEY ("taken_id") REFERENCES "public"."taken"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_keuringen_fk" FOREIGN KEY ("keuringen_id") REFERENCES "public"."keuringen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_metingen_fk" FOREIGN KEY ("metingen_id") REFERENCES "public"."metingen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schoonmaakrondes_fk" FOREIGN KEY ("schoonmaakrondes_id") REFERENCES "public"."schoonmaakrondes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_arrangementen_fk" FOREIGN KEY ("arrangementen_id") REFERENCES "public"."arrangementen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_referenties_fk" FOREIGN KEY ("referenties_id") REFERENCES "public"."referenties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_veelgesteld_fk" FOREIGN KEY ("veelgesteld_id") REFERENCES "public"."veelgesteld"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plaatsen_fk" FOREIGN KEY ("plaatsen_id") REFERENCES "public"."plaatsen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mededelingen_fk" FOREIGN KEY ("mededelingen_id") REFERENCES "public"."mededelingen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bijlagen_fk" FOREIGN KEY ("bijlagen_id") REFERENCES "public"."bijlagen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instellingen_rels" ADD CONSTRAINT "instellingen_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."instellingen"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instellingen_rels" ADD CONSTRAINT "instellingen_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "aanvragen_momenten_order_idx" ON "aanvragen_momenten" USING btree ("order");
  CREATE INDEX "aanvragen_momenten_parent_idx" ON "aanvragen_momenten" USING btree ("parent_id");
  CREATE INDEX "aanvragen_datum_idx" ON "aanvragen" USING btree ("datum");
  CREATE INDEX "aanvragen_fase_idx" ON "aanvragen" USING btree ("fase");
  CREATE INDEX "aanvragen_klant_idx" ON "aanvragen" USING btree ("klant_id");
  CREATE INDEX "aanvragen_klus_idx" ON "aanvragen" USING btree ("klus_id");
  CREATE INDEX "aanvragen_updated_at_idx" ON "aanvragen" USING btree ("updated_at");
  CREATE INDEX "aanvragen_created_at_idx" ON "aanvragen" USING btree ("created_at");
  CREATE INDEX "klanten_email_idx" ON "klanten" USING btree ("email");
  CREATE INDEX "klanten_updated_at_idx" ON "klanten" USING btree ("updated_at");
  CREATE INDEX "klanten_created_at_idx" ON "klanten" USING btree ("created_at");
  CREATE INDEX "klussen_draaiboek_order_idx" ON "klussen_draaiboek" USING btree ("_order");
  CREATE INDEX "klussen_draaiboek_parent_id_idx" ON "klussen_draaiboek" USING btree ("_parent_id");
  CREATE INDEX "klussen_boodschappen_order_idx" ON "klussen_boodschappen" USING btree ("_order");
  CREATE INDEX "klussen_boodschappen_parent_id_idx" ON "klussen_boodschappen" USING btree ("_parent_id");
  CREATE INDEX "klussen_status_idx" ON "klussen" USING btree ("status");
  CREATE INDEX "klussen_datum_idx" ON "klussen" USING btree ("datum");
  CREATE INDEX "klussen_klant_idx" ON "klussen" USING btree ("klant_id");
  CREATE INDEX "klussen_aanvraag_idx" ON "klussen" USING btree ("aanvraag_id");
  CREATE INDEX "klussen_arrangement_idx" ON "klussen" USING btree ("arrangement_id");
  CREATE INDEX "klussen_updated_at_idx" ON "klussen" USING btree ("updated_at");
  CREATE INDEX "klussen_created_at_idx" ON "klussen" USING btree ("created_at");
  CREATE INDEX "klussen_rels_order_idx" ON "klussen_rels" USING btree ("order");
  CREATE INDEX "klussen_rels_parent_idx" ON "klussen_rels" USING btree ("parent_id");
  CREATE INDEX "klussen_rels_path_idx" ON "klussen_rels" USING btree ("path");
  CREATE INDEX "klussen_rels_team_id_idx" ON "klussen_rels" USING btree ("team_id");
  CREATE INDEX "klussen_rels_media_id_idx" ON "klussen_rels" USING btree ("media_id");
  CREATE INDEX "offertes_regels_order_idx" ON "offertes_regels" USING btree ("_order");
  CREATE INDEX "offertes_regels_parent_id_idx" ON "offertes_regels" USING btree ("_parent_id");
  CREATE INDEX "offertes_nummer_idx" ON "offertes" USING btree ("nummer");
  CREATE INDEX "offertes_status_idx" ON "offertes" USING btree ("status");
  CREATE INDEX "offertes_klant_idx" ON "offertes" USING btree ("klant_id");
  CREATE INDEX "offertes_aanvraag_idx" ON "offertes" USING btree ("aanvraag_id");
  CREATE INDEX "offertes_klus_idx" ON "offertes" USING btree ("klus_id");
  CREATE INDEX "offertes_updated_at_idx" ON "offertes" USING btree ("updated_at");
  CREATE INDEX "offertes_created_at_idx" ON "offertes" USING btree ("created_at");
  CREATE INDEX "taken_voor_idx" ON "taken" USING btree ("voor_id");
  CREATE INDEX "taken_door_idx" ON "taken" USING btree ("door_id");
  CREATE INDEX "taken_vervalt_idx" ON "taken" USING btree ("vervalt");
  CREATE INDEX "taken_aanvraag_idx" ON "taken" USING btree ("aanvraag_id");
  CREATE INDEX "taken_klus_idx" ON "taken" USING btree ("klus_id");
  CREATE INDEX "taken_keuring_idx" ON "taken" USING btree ("keuring_id");
  CREATE INDEX "taken_klaar_idx" ON "taken" USING btree ("klaar");
  CREATE INDEX "taken_updated_at_idx" ON "taken" USING btree ("updated_at");
  CREATE INDEX "taken_created_at_idx" ON "taken" USING btree ("created_at");
  CREATE INDEX "keuringen_vervalt_idx" ON "keuringen" USING btree ("vervalt");
  CREATE INDEX "keuringen_document_idx" ON "keuringen" USING btree ("document_id");
  CREATE INDEX "keuringen_updated_at_idx" ON "keuringen" USING btree ("updated_at");
  CREATE INDEX "keuringen_created_at_idx" ON "keuringen" USING btree ("created_at");
  CREATE INDEX "metingen_op_idx" ON "metingen" USING btree ("op");
  CREATE INDEX "metingen_klus_idx" ON "metingen" USING btree ("klus_id");
  CREATE INDEX "metingen_door_idx" ON "metingen" USING btree ("door_id");
  CREATE INDEX "metingen_updated_at_idx" ON "metingen" USING btree ("updated_at");
  CREATE INDEX "metingen_created_at_idx" ON "metingen" USING btree ("created_at");
  CREATE INDEX "schoonmaakrondes_punten_order_idx" ON "schoonmaakrondes_punten" USING btree ("_order");
  CREATE INDEX "schoonmaakrondes_punten_parent_id_idx" ON "schoonmaakrondes_punten" USING btree ("_parent_id");
  CREATE INDEX "schoonmaakrondes_op_idx" ON "schoonmaakrondes" USING btree ("op");
  CREATE INDEX "schoonmaakrondes_klus_idx" ON "schoonmaakrondes" USING btree ("klus_id");
  CREATE INDEX "schoonmaakrondes_door_idx" ON "schoonmaakrondes" USING btree ("door_id");
  CREATE INDEX "schoonmaakrondes_updated_at_idx" ON "schoonmaakrondes" USING btree ("updated_at");
  CREATE INDEX "schoonmaakrondes_created_at_idx" ON "schoonmaakrondes" USING btree ("created_at");
  CREATE INDEX "team_werkdagen_order_idx" ON "team_werkdagen" USING btree ("order");
  CREATE INDEX "team_werkdagen_parent_idx" ON "team_werkdagen" USING btree ("parent_id");
  CREATE INDEX "team_niet_beschikbaar_order_idx" ON "team_niet_beschikbaar" USING btree ("_order");
  CREATE INDEX "team_niet_beschikbaar_parent_id_idx" ON "team_niet_beschikbaar" USING btree ("_parent_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "arrangementen_ingredienten_order_idx" ON "arrangementen_ingredienten" USING btree ("_order");
  CREATE INDEX "arrangementen_ingredienten_parent_id_idx" ON "arrangementen_ingredienten" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "arrangementen_slug_idx" ON "arrangementen" USING btree ("slug");
  CREATE INDEX "arrangementen_status_idx" ON "arrangementen" USING btree ("status");
  CREATE INDEX "arrangementen_updated_at_idx" ON "arrangementen" USING btree ("updated_at");
  CREATE INDEX "arrangementen_created_at_idx" ON "arrangementen" USING btree ("created_at");
  CREATE UNIQUE INDEX "referenties_slug_idx" ON "referenties" USING btree ("slug");
  CREATE INDEX "referenties_foto_idx" ON "referenties" USING btree ("foto_id");
  CREATE INDEX "referenties_status_idx" ON "referenties" USING btree ("status");
  CREATE INDEX "referenties_updated_at_idx" ON "referenties" USING btree ("updated_at");
  CREATE INDEX "referenties_created_at_idx" ON "referenties" USING btree ("created_at");
  CREATE INDEX "referenties_rels_order_idx" ON "referenties_rels" USING btree ("order");
  CREATE INDEX "referenties_rels_parent_idx" ON "referenties_rels" USING btree ("parent_id");
  CREATE INDEX "referenties_rels_path_idx" ON "referenties_rels" USING btree ("path");
  CREATE INDEX "referenties_rels_media_id_idx" ON "referenties_rels" USING btree ("media_id");
  CREATE INDEX "reviews_status_idx" ON "reviews" USING btree ("status");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "veelgesteld_status_idx" ON "veelgesteld" USING btree ("status");
  CREATE INDEX "veelgesteld_updated_at_idx" ON "veelgesteld" USING btree ("updated_at");
  CREATE INDEX "veelgesteld_created_at_idx" ON "veelgesteld" USING btree ("created_at");
  CREATE INDEX "plaatsen_status_idx" ON "plaatsen" USING btree ("status");
  CREATE INDEX "plaatsen_updated_at_idx" ON "plaatsen" USING btree ("updated_at");
  CREATE INDEX "plaatsen_created_at_idx" ON "plaatsen" USING btree ("created_at");
  CREATE INDEX "mededelingen_status_idx" ON "mededelingen" USING btree ("status");
  CREATE INDEX "mededelingen_updated_at_idx" ON "mededelingen" USING btree ("updated_at");
  CREATE INDEX "mededelingen_created_at_idx" ON "mededelingen" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_klein_sizes_klein_filename_idx" ON "media" USING btree ("sizes_klein_filename");
  CREATE INDEX "media_sizes_groot_sizes_groot_filename_idx" ON "media" USING btree ("sizes_groot_filename");
  CREATE INDEX "bijlagen_updated_at_idx" ON "bijlagen" USING btree ("updated_at");
  CREATE INDEX "bijlagen_created_at_idx" ON "bijlagen" USING btree ("created_at");
  CREATE UNIQUE INDEX "bijlagen_filename_idx" ON "bijlagen" USING btree ("filename");
  CREATE INDEX "tickets_berichten_order_idx" ON "tickets_berichten" USING btree ("_order");
  CREATE INDEX "tickets_berichten_parent_id_idx" ON "tickets_berichten" USING btree ("_parent_id");
  CREATE INDEX "tickets_berichten_door_idx" ON "tickets_berichten" USING btree ("door_id");
  CREATE INDEX "tickets_status_idx" ON "tickets" USING btree ("status");
  CREATE INDEX "tickets_melder_idx" ON "tickets" USING btree ("melder_id");
  CREATE INDEX "tickets_updated_at_idx" ON "tickets" USING btree ("updated_at");
  CREATE INDEX "tickets_created_at_idx" ON "tickets" USING btree ("created_at");
  CREATE INDEX "tickets_rels_order_idx" ON "tickets_rels" USING btree ("order");
  CREATE INDEX "tickets_rels_parent_idx" ON "tickets_rels" USING btree ("parent_id");
  CREATE INDEX "tickets_rels_path_idx" ON "tickets_rels" USING btree ("path");
  CREATE INDEX "tickets_rels_bijlagen_id_idx" ON "tickets_rels" USING btree ("bijlagen_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_aanvragen_id_idx" ON "payload_locked_documents_rels" USING btree ("aanvragen_id");
  CREATE INDEX "payload_locked_documents_rels_klanten_id_idx" ON "payload_locked_documents_rels" USING btree ("klanten_id");
  CREATE INDEX "payload_locked_documents_rels_klussen_id_idx" ON "payload_locked_documents_rels" USING btree ("klussen_id");
  CREATE INDEX "payload_locked_documents_rels_offertes_id_idx" ON "payload_locked_documents_rels" USING btree ("offertes_id");
  CREATE INDEX "payload_locked_documents_rels_taken_id_idx" ON "payload_locked_documents_rels" USING btree ("taken_id");
  CREATE INDEX "payload_locked_documents_rels_keuringen_id_idx" ON "payload_locked_documents_rels" USING btree ("keuringen_id");
  CREATE INDEX "payload_locked_documents_rels_metingen_id_idx" ON "payload_locked_documents_rels" USING btree ("metingen_id");
  CREATE INDEX "payload_locked_documents_rels_schoonmaakrondes_id_idx" ON "payload_locked_documents_rels" USING btree ("schoonmaakrondes_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_arrangementen_id_idx" ON "payload_locked_documents_rels" USING btree ("arrangementen_id");
  CREATE INDEX "payload_locked_documents_rels_referenties_id_idx" ON "payload_locked_documents_rels" USING btree ("referenties_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_veelgesteld_id_idx" ON "payload_locked_documents_rels" USING btree ("veelgesteld_id");
  CREATE INDEX "payload_locked_documents_rels_plaatsen_id_idx" ON "payload_locked_documents_rels" USING btree ("plaatsen_id");
  CREATE INDEX "payload_locked_documents_rels_mededelingen_id_idx" ON "payload_locked_documents_rels" USING btree ("mededelingen_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_bijlagen_id_idx" ON "payload_locked_documents_rels" USING btree ("bijlagen_id");
  CREATE INDEX "payload_locked_documents_rels_tickets_id_idx" ON "payload_locked_documents_rels" USING btree ("tickets_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "instellingen_rels_order_idx" ON "instellingen_rels" USING btree ("order");
  CREATE INDEX "instellingen_rels_parent_idx" ON "instellingen_rels" USING btree ("parent_id");
  CREATE INDEX "instellingen_rels_path_idx" ON "instellingen_rels" USING btree ("path");
  CREATE INDEX "instellingen_rels_users_id_idx" ON "instellingen_rels" USING btree ("users_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "aanvragen_momenten" CASCADE;
  DROP TABLE "aanvragen" CASCADE;
  DROP TABLE "klanten" CASCADE;
  DROP TABLE "klussen_draaiboek" CASCADE;
  DROP TABLE "klussen_boodschappen" CASCADE;
  DROP TABLE "klussen" CASCADE;
  DROP TABLE "klussen_rels" CASCADE;
  DROP TABLE "offertes_regels" CASCADE;
  DROP TABLE "offertes" CASCADE;
  DROP TABLE "taken" CASCADE;
  DROP TABLE "keuringen" CASCADE;
  DROP TABLE "metingen" CASCADE;
  DROP TABLE "schoonmaakrondes_punten" CASCADE;
  DROP TABLE "schoonmaakrondes" CASCADE;
  DROP TABLE "team_werkdagen" CASCADE;
  DROP TABLE "team_niet_beschikbaar" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "arrangementen_ingredienten" CASCADE;
  DROP TABLE "arrangementen" CASCADE;
  DROP TABLE "referenties" CASCADE;
  DROP TABLE "referenties_rels" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "veelgesteld" CASCADE;
  DROP TABLE "plaatsen" CASCADE;
  DROP TABLE "mededelingen" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "bijlagen" CASCADE;
  DROP TABLE "tickets_berichten" CASCADE;
  DROP TABLE "tickets" CASCADE;
  DROP TABLE "tickets_rels" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "instellingen" CASCADE;
  DROP TABLE "instellingen_rels" CASCADE;
  DROP TABLE "sitestatus" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."enum_aanvragen_momenten";
  DROP TYPE "public"."enum_aanvragen_gelegenheid";
  DROP TYPE "public"."enum_aanvragen_fase";
  DROP TYPE "public"."enum_aanvragen_bron";
  DROP TYPE "public"."enum_klussen_status";
  DROP TYPE "public"."enum_offertes_regels_btw";
  DROP TYPE "public"."enum_offertes_status";
  DROP TYPE "public"."enum_taken_soort";
  DROP TYPE "public"."enum_keuringen_soort";
  DROP TYPE "public"."enum_metingen_soort";
  DROP TYPE "public"."enum_team_werkdagen";
  DROP TYPE "public"."enum_team_rol";
  DROP TYPE "public"."enum_arrangementen_status";
  DROP TYPE "public"."enum_referenties_status";
  DROP TYPE "public"."enum_reviews_bron";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_veelgesteld_pagina";
  DROP TYPE "public"."enum_veelgesteld_status";
  DROP TYPE "public"."enum_plaatsen_provincie";
  DROP TYPE "public"."enum_plaatsen_status";
  DROP TYPE "public"."enum_mededelingen_status";
  DROP TYPE "public"."enum_media_licentie";
  DROP TYPE "public"."enum_media_personen";
  DROP TYPE "public"."enum_tickets_berichten_status_naar";
  DROP TYPE "public"."enum_tickets_soort";
  DROP TYPE "public"."enum_tickets_status";
  DROP TYPE "public"."enum_users_rol";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
