CREATE TABLE IF NOT EXISTS "app_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"target_month" integer NOT NULL,
	"target_year" integer NOT NULL,
	"deadline" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "children" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"day" integer NOT NULL,
	"meal_type" text NOT NULL,
	CONSTRAINT "meal_days_year_month_day_meal_type_unique" UNIQUE("year","month","day","meal_type")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_request_meal_days" (
	"meal_request_id" uuid NOT NULL,
	"meal_day_id" uuid NOT NULL,
	CONSTRAINT "meal_request_meal_days_meal_request_id_meal_day_id_pk" PRIMARY KEY("meal_request_id","meal_day_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid,
	"child_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"first_name" text,
	"last_name" text,
	"email" varchar(255) NOT NULL,
	"clerk_id" text NOT NULL,
	"child_id" uuid,
	"is_verified" boolean DEFAULT false,
	"is_admin" boolean DEFAULT false,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_request_meal_days" ADD CONSTRAINT "meal_request_meal_days_meal_request_id_meal_requests_id_fk" FOREIGN KEY ("meal_request_id") REFERENCES "public"."meal_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_request_meal_days" ADD CONSTRAINT "meal_request_meal_days_meal_day_id_meal_days_id_fk" FOREIGN KEY ("meal_day_id") REFERENCES "public"."meal_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_requests" ADD CONSTRAINT "meal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meal_requests" ADD CONSTRAINT "meal_requests_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
