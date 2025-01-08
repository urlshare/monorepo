CREATE TYPE "public"."role" AS ENUM('NEW_USER', 'USER');--> statement-breakpoint
CREATE TABLE "urlshare_categories" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user_id" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(30) NOT NULL,
	"urls_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "urlshare_categories_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "urlshare_follows" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"follower_id" char(26) NOT NULL,
	"following_id" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "urlshare_follows_follower_id_following_id_unique" UNIQUE("follower_id","following_id")
);
--> statement-breakpoint
CREATE TABLE "urlshare_urls" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"url" text NOT NULL,
	"url_hash" char(40) NOT NULL,
	"metadata" json DEFAULT '{}'::json NOT NULL,
	CONSTRAINT "urlshare_urls_url_hash_unique" UNIQUE("url_hash")
);
--> statement-breakpoint
CREATE TABLE "urlshare_user_profiles" (
	"id" char(29) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"user_id" char(26) NOT NULL,
	"username" varchar(15) NOT NULL,
	"username_normalized" varchar(15) NOT NULL,
	"image_url" text,
	"following_count" integer DEFAULT 0 NOT NULL,
	"followers_count" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"liked_count" bigint DEFAULT 0 NOT NULL,
	"urls_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "urlshare_user_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "urlshare_user_profiles_username_unique" UNIQUE("username"),
	CONSTRAINT "urlshare_user_profiles_username_normalized_unique" UNIQUE("username_normalized")
);
--> statement-breakpoint
CREATE TABLE "urlshare_user_urls_categories" (
	"user_url_id" char(30) NOT NULL,
	"category_id" char(26) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "urlshare_user_urls_categories_user_url_id_category_id_pk" PRIMARY KEY("user_url_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "urlshare_users" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"api_key" char(30),
	"role" "role" DEFAULT 'NEW_USER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "urlshare_users_urls" (
	"id" char(30) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"user_id" char(26) NOT NULL,
	"url_id" char(26) NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "urlshare_categories" ADD CONSTRAINT "urlshare_categories_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_follows" ADD CONSTRAINT "urlshare_follows_follower_id_urlshare_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_follows" ADD CONSTRAINT "urlshare_follows_following_id_urlshare_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_user_profiles" ADD CONSTRAINT "urlshare_user_profiles_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_user_urls_categories" ADD CONSTRAINT "urlshare_user_urls_categories_user_url_id_urlshare_users_urls_id_fk" FOREIGN KEY ("user_url_id") REFERENCES "public"."urlshare_users_urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_user_urls_categories" ADD CONSTRAINT "urlshare_user_urls_categories_category_id_urlshare_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."urlshare_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_users" ADD CONSTRAINT "urlshare_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_users_urls" ADD CONSTRAINT "urlshare_users_urls_user_id_urlshare_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."urlshare_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urlshare_users_urls" ADD CONSTRAINT "urlshare_users_urls_url_id_urlshare_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urlshare_urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "urlshare_categories_user_id_index" ON "urlshare_categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "urlshare_follows_follower_id_index" ON "urlshare_follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "urlshare_follows_following_id_index" ON "urlshare_follows" USING btree ("following_id");--> statement-breakpoint
CREATE INDEX "urlshare_user_urls_categories_user_url_id_index" ON "urlshare_user_urls_categories" USING btree ("user_url_id");--> statement-breakpoint
CREATE INDEX "urlshare_user_urls_categories_category_id_index" ON "urlshare_user_urls_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "urlshare_users_urls_user_id_index" ON "urlshare_users_urls" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "urlshare_users_urls_url_id_index" ON "urlshare_users_urls" USING btree ("url_id");