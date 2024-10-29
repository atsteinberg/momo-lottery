ALTER TABLE "lunch_requests" RENAME TO "meal_requests";--> statement-breakpoint
ALTER TABLE "meal_requests" DROP CONSTRAINT "lunch_requests_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_requests" ADD CONSTRAINT "meal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
