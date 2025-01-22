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
