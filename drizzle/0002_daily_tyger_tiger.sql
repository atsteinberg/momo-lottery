ALTER TABLE "meal_requests" ADD COLUMN "meal_day_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_requests" ADD CONSTRAINT "meal_requests_meal_day_id_meal_days_id_fk" FOREIGN KEY ("meal_day_id") REFERENCES "public"."meal_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
