CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"arrival_date" text,
	"departure_date" text,
	"message" text NOT NULL,
	"enquiry_items" text,
	"archived" boolean DEFAULT false,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"location" text NOT NULL,
	"rate" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gear_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_type" text NOT NULL,
	"day_cost" text NOT NULL,
	"week_cost" text NOT NULL,
	"additional_deets" text,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "price_guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"file_url" text,
	"file_name" text,
	"created_at" text,
	"updated_at" text
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"rating" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
