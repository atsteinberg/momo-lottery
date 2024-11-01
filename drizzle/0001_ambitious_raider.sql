DROP TABLE "user_children";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "child_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "children" DROP COLUMN IF EXISTS "google_sheets_name";